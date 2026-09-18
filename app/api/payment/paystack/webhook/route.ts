import { applyVerifiedOrderPayment } from '@/lib/payment/apply-verified';
import { findOrderByPaystackReference, findOrderForPayment } from '@/lib/payment/find-order';
import { getChargeAmountForOrder } from '@/lib/payment/plan';
import {
  orderNumberFromPaystackData,
  paystackConfigured,
  verifyPaystackReference,
  verifyPaystackSignature,
} from '@/lib/payment/paystack';

export async function POST(request: Request) {
  const raw = await request.text();
  if (!paystackConfigured()) {
    return Response.json({ error: 'Paystack is not configured' }, { status: 503 });
  }

  const given = request.headers.get('x-paystack-signature') || '';
  if (!verifyPaystackSignature(raw, given)) {
    console.warn('[paystack webhook] bad signature');
    return new Response('Forbidden', { status: 403 });
  }

  const event = JSON.parse(raw) as {
    event?: string;
    data?: {
      reference?: string;
      status?: string;
      metadata?: Record<string, unknown>;
    };
  };

  console.log(
    `[paystack webhook] event=${event.event} ref=${event.data?.reference || '—'} status=${event.data?.status || '—'}`
  );

  if (event.event !== 'charge.success' || !event.data?.reference || event.data.status !== 'success') {
    return Response.json({ success: true });
  }

  const reference = event.data.reference;
  const parsedNumber = orderNumberFromPaystackData({
    metadata: event.data.metadata,
    reference,
  });
  const order =
    (await findOrderByPaystackReference(reference)) ||
    (parsedNumber ? await findOrderForPayment(parsedNumber) : null);

  if (!order) {
    console.warn('[paystack webhook] order not found', parsedNumber || reference);
    return Response.json({ success: true });
  }

  if (order.payment_status === 'paid') {
    return Response.json({ success: true });
  }

  const expected = getChargeAmountForOrder(order);
  const verified = await verifyPaystackReference(reference, expected);
  if (!verified.verified) {
    console.warn('[paystack webhook] verify rejected', order.order_number);
    return Response.json({ success: true });
  }

  await applyVerifiedOrderPayment({
    orderNumber: order.order_number,
    provider: 'paystack',
    reference,
    chargedAmount: verified.amountGhs ?? expected,
    previousPaymentStatus: order.payment_status,
    confirmationAlreadySent: order.metadata?.confirmation_sent_at,
  });

  console.log(`[paystack webhook] marked paid order=${order.order_number}`);
  return Response.json({ success: true });
}
