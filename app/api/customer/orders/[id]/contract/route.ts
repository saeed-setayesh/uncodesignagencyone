import { createHash } from 'node:crypto'
import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { contractAcceptance, customerOrder, db } from '@/lib/db'
import { requireCustomerSession } from '@/lib/customer-api-auth'
import { CONTRACT_TERMS_FA, CONTRACT_TERMS_VERSION } from '@/lib/contract-terms'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  const { id: orderId } = await context.params
  let body: { accepted?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.accepted) {
    return NextResponse.json({ error: 'پذیرش شرایط الزامی است' }, { status: 400 })
  }

  const [order] = await db
    .select()
    .from(customerOrder)
    .where(and(eq(customerOrder.id, orderId), eq(customerOrder.customerId, auth.customerId)))
    .limit(1)

  if (!order) {
    return NextResponse.json({ error: 'سفارش یافت نشد' }, { status: 404 })
  }
  if (order.status !== 'paid') {
    return NextResponse.json({ error: 'فقط پس از پرداخت می‌توانید قرارداد را تأیید کنید' }, { status: 400 })
  }

  const [existing] = await db
    .select({ id: contractAcceptance.id })
    .from(contractAcceptance)
    .where(eq(contractAcceptance.orderId, orderId))
    .limit(1)
  if (existing) {
    return NextResponse.json({ ok: true, already: true })
  }

  const termsHash = createHash('sha256').update(CONTRACT_TERMS_FA).digest('hex')
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? ''
  const userAgent = req.headers.get('user-agent') ?? ''

  await db.insert(contractAcceptance).values({
    id: randomUUID(),
    customerId: auth.customerId,
    orderId,
    termsVersion: CONTRACT_TERMS_VERSION,
    termsHash,
    acceptedAt: new Date(),
    ip,
    userAgent,
  })

  return NextResponse.json({ ok: true })
}
