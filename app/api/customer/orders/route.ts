import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { customerOrder, db, service as serviceTable } from '@/lib/db'
import { requireCustomerSession } from '@/lib/customer-api-auth'
import { getPlanAmountRial, getPlanSnapshotForOrder } from '@/lib/customer-order-amount'

export async function GET() {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  const rows = await db
    .select()
    .from(customerOrder)
    .where(eq(customerOrder.customerId, auth.customerId))
    .orderBy(desc(customerOrder.createdAt))

  return NextResponse.json({ orders: rows })
}

export async function POST(req: Request) {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  let body: { serviceId?: string; planIndex?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const serviceId = String(body.serviceId ?? '')
  const planIndex = Number(body.planIndex)
  if (!serviceId || !Number.isInteger(planIndex)) {
    return NextResponse.json({ error: 'serviceId and planIndex required' }, { status: 400 })
  }

  const [svc] = await db.select().from(serviceTable).where(eq(serviceTable.id, serviceId)).limit(1)
  if (!svc || !svc.active) {
    return NextResponse.json({ error: 'سرویس یافت نشد' }, { status: 404 })
  }

  const amountRial = getPlanAmountRial(svc, planIndex)
  if (amountRial == null) {
    return NextResponse.json({ error: 'این پلن قابل پرداخت آنلاین نیست' }, { status: 400 })
  }

  const snapshot = getPlanSnapshotForOrder(svc, planIndex)
  if (!snapshot) {
    return NextResponse.json({ error: 'پلن نامعتبر' }, { status: 400 })
  }

  const now = new Date()
  const id = randomUUID()
  await db.insert(customerOrder).values({
    id,
    customerId: auth.customerId,
    serviceId: svc.id,
    planIndex,
    planSnapshot: snapshot,
    status: 'pending_payment',
    amountRial,
    currency: 'IRR',
    createdAt: now,
    updatedAt: now,
  })

  const [order] = await db.select().from(customerOrder).where(eq(customerOrder.id, id)).limit(1)
  return NextResponse.json({ order })
}
