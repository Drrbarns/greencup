import { query, queryOne } from '@/lib/db';
import { applyCouponUsageForOrder } from '@/lib/coupons';
import { sendOrderConfirmation } from '@/lib/notifications';

type OrderJson = Record<string, unknown>;

export async function applyVerifiedOrderPayment(input: {
  orderNumber: string;
  provider: 'paystack' | 'moolre';
  reference: string;
  chargedAmount: number;
  previousPaymentStatus?: string;
  confirmationAlreadySent?: unknown;
}): Promise<OrderJson | null> {
  const paidRow = await queryOne<{ result: OrderJson }>(
    `SELECT apply_verified_order_payment($1, $2, $3, $4) AS result`,
    [input.orderNumber, input.provider, input.reference, input.chargedAmount]
  );
  const orderJson = paidRow?.result;
  if (!orderJson) return null;

  const prevStatus = input.previousPaymentStatus;
  const becamePaid =
    (orderJson.payment_status === 'paid' || orderJson.payment_status === 'partially_paid') &&
    prevStatus !== 'paid' &&
    prevStatus !== 'partially_paid';

  if (becamePaid) {
    try {
      await applyCouponUsageForOrder(orderJson);
    } catch (error) {
      console.error('[payment] coupon usage failed:', error);
    }
  }

  if (orderJson.payment_status === 'paid' && orderJson.email && prevStatus !== 'paid') {
    try {
      await query(`SELECT update_customer_stats($1, $2)`, [
        String(orderJson.email),
        Number(orderJson.total),
      ]);
    } catch (error) {
      console.error('[payment] customer stats failed:', error);
    }
  }

  if (
    !input.confirmationAlreadySent &&
    (orderJson.payment_status === 'paid' || orderJson.payment_status === 'partially_paid')
  ) {
    try {
      await sendOrderConfirmation(orderJson);
      await query(
        `UPDATE orders SET metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb WHERE order_number = $1`,
        [input.orderNumber, JSON.stringify({ confirmation_sent_at: new Date().toISOString() })]
      );
    } catch (error) {
      console.error('[payment] confirmation failed:', error);
    }
  }

  return orderJson;
}
