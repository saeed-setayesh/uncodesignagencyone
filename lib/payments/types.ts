export type CreatePaymentInput = {
  amountRial: number
  description: string
  callbackUrl: string
}

export type CreatePaymentResult =
  | { ok: true; redirectUrl: string; authority: string }
  | { ok: false; message: string }

export type VerifyPaymentInput = {
  authority: string
  amountRial: number
}

export type VerifyPaymentResult =
  | { ok: true; refId: string; raw: unknown }
  | { ok: false; message: string; raw?: unknown }

export type PaymentProviderId = 'zarinpal'
