import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { customerOrder, db, paymentTransaction } from '@/lib/db'
import { zarinpalVerify } from '@/lib/payments/zarinpal'

/** Zarinpal redirects browser here with ?Authority=&Status=OK|NOK */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const authority = url.searchParams.get('Authority') ?? ''
  const status = url.searchParams.get('Status') ?? ''
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

  if (!authority) {
    return NextResponse.redirect(`${site}/customer/orders?pay=error`)
  }

  const [tx] = await db
    .select()
    .from(paymentTransaction)
    .where(eq(paymentTransaction.authority, authority))
    .orderBy(desc(paymentTransaction.createdAt))
    .limit(1)

  if (!tx) {
    return NextResponse.redirect(`${site}/customer/orders?pay=error`)
  }

  const [order] = await db.select().from(customerOrder).where(eq(customerOrder.id, tx.orderId)).limit(1)
  if (!order) {
    return NextResponse.redirect(`${site}/customer/orders?pay=error`)
  }

  const failRedirect = `${site}/customer/orders/${order.id}?pay=failed`

  if (status !== 'OK') {
    await db
      .update(paymentTransaction)
      .set({
        status: 'failed',
        rawPayload: { Status: status },
      })
      .where(eq(paymentTransaction.id, tx.id))
    await db
      .update(customerOrder)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(customerOrder.id, order.id))
    return NextResponse.redirect(failRedirect)
  }

  const verified = await zarinpalVerify({ authority, amountRial: order.amountRial })
  if (!verified.ok) {
    await db
      .update(paymentTransaction)
      .set({ status: 'failed', rawPayload: verified.raw ?? { message: verified.message } })
      .where(eq(paymentTransaction.id, tx.id))
    return NextResponse.redirect(failRedirect)
  }

  const now = new Date()
  await db
    .update(paymentTransaction)
    .set({
      status: 'success',
      refId: verified.refId,
      rawPayload: verified.raw,
    })
    .where(eq(paymentTransaction.id, tx.id))

  await db
    .update(customerOrder)
    .set({ status: 'paid', updatedAt: now })
    .where(eq(customerOrder.id, order.id))

  return NextResponse.redirect(`${site}/customer/orders/${order.id}?pay=success`)
}
