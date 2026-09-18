import { createHmac, timingSafeEqual } from 'node:crypto';

const PAYSTACK_API = 'https://api.paystack.co';

export function paystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) {
    throw new Error('Paystack is not configured. Set PAYSTACK_SECRET_KEY.');
  }
  return key;
}

export type PaystackInitResult = {
  url: string;
  reference: string;
};

export type PaystackVerifyResult = {
  verified: boolean;
  amountGhs?: number;
  currency?: string;
  status?: string;
  reference?: string;
  orderNumber?: string | null;
  metadata?: Record<string, unknown>;
};

type PaystackInitResponse = {
  status?: boolean;
  message?: string;
  data?: { authorization_url?: string; reference?: string };
};

type PaystackVerifyResponse = {
  status?: boolean;
  message?: string;
  data?: {
    status?: string;
    amount?: number;
    currency?: string;
    reference?: string;
    metadata?: Record<string, unknown> | null;
  };
};

export function checkoutEmail(email: string | null | undefined, phone?: string | null): string {
  const trimmed = email?.trim();
  if (trimmed && trimmed.includes('@') && !trimmed.endsWith('@pos.local') && trimmed !== 'pos-walkin@store.local') {
    return trimmed;
  }
  const digits = (phone || '').replace(/\D/g, '');
  return `${digits || 'customer'}@customers.greencupghana.com`;
}

export function orderNumberFromPaystackData(data: {
  metadata?: unknown;
  reference?: string | null;
}): string | null {
  const meta = data.metadata;
  if (meta && typeof meta === 'object' && meta !== null && 'order_number' in meta) {
    const value = (meta as { order_number?: unknown }).order_number;
    if (typeof value === 'string' && value.startsWith('ORD-')) return value;
  }
  const reference = data.reference || '';
  if (reference.startsWith('GCWEB-')) {
    const rest = reference.slice('GCWEB-'.length);
    const lastDash = rest.lastIndexOf('-');
    if (lastDash > 0) return rest.slice(0, lastDash);
  }
  return null;
}

export async function initializePaystackTransaction(input: {
  email: string;
  phone?: string | null;
  amountGhs: number;
  orderId: string;
  orderNumber: string;
  callbackUrl: string;
}): Promise<PaystackInitResult> {
  const key = secretKey();
  const amountPesewas = Math.round(input.amountGhs * 100);
  if (!Number.isFinite(amountPesewas) || amountPesewas < 100) {
    throw new Error('Invalid payment amount');
  }

  const reference = `GCWEB-${input.orderNumber}-${Date.now()}`;
  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: checkoutEmail(input.email, input.phone),
      amount: amountPesewas,
      currency: 'GHS',
      reference,
      channels: ['card', 'mobile_money'],
      callback_url: input.callbackUrl,
      metadata: {
        order_id: input.orderId,
        order_number: input.orderNumber,
        phone: input.phone || '',
        source: 'website',
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const payload = (await response.json()) as PaystackInitResponse;
  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message || 'Paystack could not create a payment link');
  }

  return {
    url: payload.data.authorization_url,
    reference: payload.data.reference || reference,
  };
}

export async function verifyPaystackReference(
  reference: string,
  expectedGhs: number
): Promise<PaystackVerifyResult> {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key || !reference) return { verified: false };

  try {
    const response = await fetch(
      `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(15_000),
      }
    );
    const payload = (await response.json()) as PaystackVerifyResponse;
    const data = payload.data;
    const amountGhs = Number(data?.amount ?? 0) / 100;
    const verified = Boolean(
      response.ok &&
        payload.status &&
        data?.status === 'success' &&
        data.currency === 'GHS' &&
        Number(data.amount ?? 0) >= Math.round(expectedGhs * 100)
    );

    return {
      verified,
      amountGhs,
      currency: data?.currency,
      status: data?.status,
      reference: data?.reference || reference,
      orderNumber: orderNumberFromPaystackData({
        metadata: data?.metadata,
        reference: data?.reference || reference,
      }),
      metadata: data?.metadata || undefined,
    };
  } catch (error) {
    console.error('[paystack] verify failed:', error);
    return { verified: false };
  }
}

export function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key || !signature) return false;
  const expected = createHmac('sha512', key).update(rawBody).digest('hex');
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
