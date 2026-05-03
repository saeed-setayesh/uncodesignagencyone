import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db, supportTicket, ticketMessage } from '@/lib/db'
import { requireCustomerSession } from '@/lib/customer-api-auth'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  const { id: ticketId } = await context.params
  const [ticket] = await db.select().from(supportTicket).where(eq(supportTicket.id, ticketId)).limit(1)
  if (!ticket || ticket.customerId !== auth.customerId) {
    return NextResponse.json({ error: 'یافت نشد' }, { status: 404 })
  }
  if (ticket.status === 'closed') {
    return NextResponse.json({ error: 'تیکت بسته است' }, { status: 400 })
  }

  let body: { body?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const text = String(body.body ?? '').trim()
  if (!text) {
    return NextResponse.json({ error: 'پیام خالی است' }, { status: 400 })
  }

  const now = new Date()
  await db.insert(ticketMessage).values({
    id: randomUUID(),
    ticketId,
    fromCustomer: true,
    body: text,
    createdAt: now,
  })

  let status = ticket.status
  if (status === 'answered') status = 'open'
  await db
    .update(supportTicket)
    .set({ updatedAt: now, status })
    .where(eq(supportTicket.id, ticketId))

  return NextResponse.json({ ok: true })
}
