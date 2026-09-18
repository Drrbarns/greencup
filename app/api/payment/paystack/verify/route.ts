import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { applyVerifiedOrderPayment } from '@/lib/payment/apply-verified';
import { findOrderForPayment } from '@/lib/payment/find-order';
import { getChargeAmountForOrder } from '@/lib/payment/plan';
import { paystackConfigured, verifyPaystackReference } from '@/lib/payment/paystack';

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`verify:${clientId}`, RATE_LIMITS.payment);
    if (!rateLimitResult.success) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    const { orderNumber, reference } = (await req.json()) as {
      orderNumber?: unknown;
      reference?: unknown;
    };

    if (!orderNumber || typeof orderNumber !== 'string' || !orderNumber.startsWith('ORD-')) {
      return NextResponse.json({ success: false, message: 'Missing or invalid orderNumber' }, { status: 400 });
    }

    const order = await findOrderForPayment(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        status: order.status,
        payment_status: order.payment_status,
        message: 'Order already paid',
      });
    }

    if (!paystackConfigured()) {
      return NextResponse.json(
        {
          success: false,
          status: order.status,
          payment_status: order.payment_status,
          message: 'Payment verification unavailable',
        },
        { status: 503 }
      );
    }

    const storedRef =
      (typeof reference === 'string' && reference) ||
      (typeof order.metadata?.paystack_reference === 'string' ? order.metadata.paystack_reference : '');

    if (!storedRef) {
      return NextResponse.json({
        success: false,
        status: order.status,
        payment_status: order.payment_status,
        message: 'Payment not yet confirmed by payment provider',
      });
    }

    const expectedCharge = getChargeAmountForOrder(order);
    const check = await verifyPaystackReference(storedRef, expectedCharge);
    if (!check.verified) {
      return NextResponse.json({
        success: false,
        status: order.status,
        payment_status: order.payment_status,
        message: 'Payment not yet confirmed by payment provider',
      });
    }

    const orderJson = await applyVerifiedOrderPayment({
      orderNumber: order.order_number,
      provider: 'paystack',
      reference: check.reference || storedRef,
      chargedAmount: check.amountGhs ?? expectedCharge,
      previousPaymentStatus: order.payment_status,
      confirmationAlreadySent: order.metadata?.confirmation_sent_at,
    });

    if (!orderJson) {
      return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: orderJson.status || 'processing',
      payment_status: orderJson.payment_status,
      message:
        orderJson.payment_status === 'partially_paid'
          ? 'Deposit verified. Remaining balance is due before pickup or delivery.'
          : 'Payment verified and order updated',
      balance_due: (orderJson.metadata as Record<string, unknown> | undefined)?.balance_due ?? 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error('[paystack verify]', message);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
