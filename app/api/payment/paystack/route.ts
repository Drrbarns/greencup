import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { getChargeAmountForOrder } from '@/lib/payment/plan';
import { findOrderForPayment } from '@/lib/payment/find-order';
import { initializePaystackTransaction, paystackConfigured } from '@/lib/payment/paystack';

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`payment:${clientId}`, RATE_LIMITS.payment);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
          },
        }
      );
    }

    if (!paystackConfigured()) {
      console.error('[paystack] missing PAYSTACK_SECRET_KEY');
      return NextResponse.json(
        { success: false, message: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { orderId, customerEmail } = body;

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid orderId' }, { status: 400 });
    }

    const order = await findOrderForPayment(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ success: false, message: 'Order is already paid' }, { status: 400 });
    }

    const amount = getChargeAmountForOrder(order);
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid order amount' }, { status: 400 });
    }

    const requestUrl = new URL(req.url);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin).replace(/\/+$/, '');
    const isBalancePayment = order.payment_status === 'partially_paid';

    const link = await initializePaystackTransaction({
      email: typeof customerEmail === 'string' ? customerEmail : order.email,
      phone: order.phone,
      amountGhs: amount,
      orderId: order.id,
      orderNumber: order.order_number,
      callbackUrl: `${baseUrl}/api/payment/paystack/callback`,
    });

    await query(
      `UPDATE orders
          SET payment_method = 'paystack',
              payment_provider = 'paystack',
              metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb
        WHERE id = $1::uuid`,
      [
        order.id,
        JSON.stringify({
          paystack_reference: link.reference,
          payment_provider: 'paystack',
          payment_method: 'paystack',
          payment_link_created_at: new Date().toISOString(),
          pending_charge_amount: amount,
        }),
      ]
    );

    return NextResponse.json({
      success: true,
      url: link.url,
      reference: link.reference,
      amount,
      payment_phase: isBalancePayment ? 'balance' : 'initial',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[paystack] initialize failed:', message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
