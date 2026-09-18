import { NextRequest, NextResponse } from 'next/server';
import { applyVerifiedOrderPayment } from '@/lib/payment/apply-verified';
import { findOrderByPaystackReference, findOrderForPayment } from '@/lib/payment/find-order';
import { getChargeAmountForOrder } from '@/lib/payment/plan';
import { orderNumberFromPaystackData, verifyPaystackReference } from '@/lib/payment/paystack';

function publicOrigin(request: NextRequest): string {
  const configured = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
  if (configured && !/0\.0\.0\.0|localhost|127\.0\.0\.1/i.test(configured)) return configured;
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  if (host && !/0\.0\.0\.0/i.test(host)) return `${proto}://${host}`;
  return 'https://greencup4u.com';
}

export async function GET(request: NextRequest) {
  const origin = publicOrigin(request);
  const reference = request.nextUrl.searchParams.get('reference');
  if (!reference) {
    return NextResponse.redirect(new URL('/checkout', origin));
  }

  try {
    const byRef = await findOrderByPaystackReference(reference);
    const parsedNumber = orderNumberFromPaystackData({ reference });
    const order = byRef || (parsedNumber ? await findOrderForPayment(parsedNumber) : null);
    if (!order) {
      return NextResponse.redirect(new URL('/checkout', origin));
    }

    const successUrl = new URL(
      `/order-success?order=${encodeURIComponent(order.order_number)}&payment_success=true`,
      origin
    );

    if (order.payment_status === 'paid') {
      return NextResponse.redirect(successUrl);
    }

    const expected = getChargeAmountForOrder(order);
    const verified = await verifyPaystackReference(reference, expected);
    if (!verified.verified) {
      return NextResponse.redirect(successUrl);
    }

    await applyVerifiedOrderPayment({
      orderNumber: order.order_number,
      provider: 'paystack',
      reference,
      chargedAmount: verified.amountGhs ?? expected,
      previousPaymentStatus: order.payment_status,
      confirmationAlreadySent: order.metadata?.confirmation_sent_at,
    });

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('[paystack callback]', error);
    return NextResponse.redirect(new URL('/checkout', origin));
  }
}
