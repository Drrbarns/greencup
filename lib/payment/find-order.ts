import { queryOne } from '@/lib/db';

export type PayableOrder = {
  id: string;
  order_number: string;
  total: number;
  email: string;
  phone: string | null;
  payment_status: string;
  status: string;
  metadata: Record<string, unknown> | null;
};

export async function findOrderForPayment(orderId: string): Promise<PayableOrder | null> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
  return queryOne<PayableOrder>(
    isUUID
      ? `SELECT id, order_number, total, email, phone, payment_status::text AS payment_status,
                status::text AS status, metadata
           FROM orders WHERE id = $1::uuid OR order_number = $1::text LIMIT 1`
      : `SELECT id, order_number, total, email, phone, payment_status::text AS payment_status,
                status::text AS status, metadata
           FROM orders WHERE order_number = $1::text LIMIT 1`,
    [orderId]
  );
}

export async function findOrderByPaystackReference(reference: string): Promise<PayableOrder | null> {
  return queryOne<PayableOrder>(
    `SELECT id, order_number, total, email, phone, payment_status::text AS payment_status,
            status::text AS status, metadata
       FROM orders
      WHERE metadata->>'paystack_reference' = $1
         OR metadata->>'moolre_reference' = $1
      LIMIT 1`,
    [reference]
  );
}
