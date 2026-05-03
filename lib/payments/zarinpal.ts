import type { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from './types'

function baseUrl(): string {
  const sandbox = process.env.ZARINPAL_SANDBOX === '1' || process.env.ZARINPAL_SANDBOX === 'true'
  return sandbox ? 'https://sandbox.zarinpal.com' : 'https://api.zarinpal.com'
}

function merchantId(): string {
  const id = process.env.ZARINPAL_MERCHANT_ID
  if (!id) throw new Error('ZARINPAL_MERCHANT_ID is not set')
  return id
}

export async function zarinpalCreatePayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  const res = await fetch(`${baseUrl()}/pg/v4/payment/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: merchantId(),
      amount: input.amountRial,
      description: input.description.slice(0, 500),
      callback_url: input.callbackUrl,
    }),
  })
  const json = (await res.json()) as {
    data?: { code?: number; authority?: string; message?: string }
    errors?: unknown
  }
  const code = json.data?.code
  const authority = json.data?.authority
  if (code !== 100 || !authority) {
    const msg =
      typeof json.data?.message === 'string'
        ? json.data.message
        : `Zarinpal request failed (code ${code ?? '?'})`
    return { ok: false, message: msg }
  }
  const startPath = process.env.ZARINPAL_SANDBOX === '1' || process.env.ZARINPAL_SANDBOX === 'true'
    ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
    : `https://www.zarinpal.com/pg/StartPay/${authority}`
  return { ok: true, authority, redirectUrl: startPath }
}

export async function zarinpalVerify(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
  const res = await fetch(`${baseUrl()}/pg/v4/payment/verify.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: merchantId(),
      amount: input.amountRial,
      authority: input.authority,
    }),
  })
  const json = (await res.json()) as {
    data?: { code?: number; ref_id?: number; message?: string }
    errors?: unknown
  }
  const code = json.data?.code
  const refId = json.data?.ref_id
  if (code === 100 && refId != null) {
    return { ok: true, refId: String(refId), raw: json }
  }
  const msg =
    typeof json.data?.message === 'string' ? json.data.message : `Verify failed (code ${code ?? '?'})`
  return { ok: false, message: msg, raw: json }
}
