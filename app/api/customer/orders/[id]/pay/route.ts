import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { customerOrder, db, paymentTransaction } from '@/lib/db'
import { requireCustomerSession } from '@/lib/customer-api-auth'
import { zarinpalCreatePayment } from '@/lib/payments/zarinpal'
import { getServerCallbackOrigin } from '@/lib/site-url'

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  const { id: orderId } = await context.params

  const [order] = await db
    .select()
    .from(customerOrder)
    .where(and(eq(customerOrder.id, orderId), eq(customerOrder.customerId, auth.customerId)))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: 'سفارش یافت نشد' }, { status: 404 })
  }
  if (order.status !== 'pending_payment' && order.status !== 'draft') {
    return NextResponse.json({ error: 'این سفارش قابل پرداخت نیست' }, { status: 400 })
  }

  const site = getServerCallbackOrigin()
  const callbackUrl = `${site}/api/payments/zarinpal/callback`

  const snap = order.planSnapshot as { plan?: { name?: string }; serviceFa?: string }
  const desc = `سفارش ${snap?.serviceFa ?? ''} — ${snap?.plan?.name ?? order.id}`

  let pay: Awaited<ReturnType<typeof zarinpalCreatePayment>>
  try {
    pay = await zarinpalCreatePayment({
      amountRial: order.amountRial,
      description: desc,
      callbackUrl,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'درگاه پرداخت پیکربندی نشده یا خطای شبکه' }, { status: 500 })
  }

  if (!pay.ok) {
    return NextResponse.json({ error: pay.message }, { status: 502 })
  }

  const now = new Date()
  await db.insert(paymentTransaction).values({
    id: randomUUID(),
    orderId: order.id,
    provider: 'zarinpal',
    authority: pay.authority,
    status: 'pending',
    createdAt: now,
  })

  await db
    .update(customerOrder)
    .set({ status: 'pending_payment', updatedAt: now })
    .where(eq(customerOrder.id, order.id))

  return NextResponse.json({ redirectUrl: pay.redirectUrl, authority: pay.authority })
}
