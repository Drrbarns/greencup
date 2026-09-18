-- Provider-agnostic payment apply used by Paystack (and existing Moolre).
CREATE OR REPLACE FUNCTION public.apply_verified_order_payment(
  p_order_ref text,
  p_provider text,
  p_provider_ref text,
  p_charged_amount numeric DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_event_key text;
  v_result jsonb;
BEGIN
  IF p_provider NOT IN ('paystack', 'moolre') THEN
    RAISE EXCEPTION 'unsupported payment provider: %', p_provider;
  END IF;

  v_event_key := coalesce(nullif(p_provider_ref, ''), p_order_ref);

  INSERT INTO payment_events (provider, event_key, order_number, provider_ref, payload, authenticity, processing_state)
  VALUES (
    p_provider,
    v_event_key,
    p_order_ref,
    p_provider_ref,
    jsonb_build_object('charged_amount', p_charged_amount, 'provider', p_provider),
    'verified',
    'accepted'
  )
  ON CONFLICT (provider, event_key) DO UPDATE
    SET attempts = payment_events.attempts + 1;

  v_result := public.mark_order_paid(p_order_ref, p_provider_ref, p_charged_amount);

  UPDATE orders
     SET payment_method = p_provider,
         payment_provider = p_provider,
         metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
           'payment_provider', p_provider,
           'paystack_reference', CASE
             WHEN p_provider = 'paystack' THEN p_provider_ref
             ELSE COALESCE(metadata->>'paystack_reference', NULL)
           END
         )
   WHERE order_number = p_order_ref;

  UPDATE payment_events
     SET processing_state = CASE WHEN v_result ? 'id' THEN 'applied' ELSE 'failed' END,
         processed_at = now()
   WHERE provider = p_provider AND event_key = v_event_key;

  SELECT to_jsonb(o.*) INTO v_result FROM orders o WHERE o.order_number = p_order_ref;
  RETURN v_result;
END;
$$;
