import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db, supportTicket, ticketMessage } from '@/lib/db'
import { requireCustomerSession } from '@/lib/customer-api-auth'

export async function GET() {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  const tickets = await db
    .select()
    .from(supportTicket)
    .where(eq(supportTicket.customerId, auth.customerId))
    .orderBy(desc(supportTicket.updatedAt))

  return NextResponse.json({ tickets })
}

export async function POST(req: Request) {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  let body: { subject?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const subject = String(body.subject ?? '').trim()
  const message = String(body.message ?? '').trim()
  if (!subject || !message) {
    return NextResponse.json({ error: 'موضوع و پیام الزامی است' }, { status: 400 })
  }

  const ticketId = randomUUID()
  const now = new Date()
  await db.insert(supportTicket).values({
    id: ticketId,
    customerId: auth.customerId,
    subject,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  })
  await db.insert(ticketMessage).values({
    id: randomUUID(),
    ticketId,
    fromCustomer: true,
    body: message,
    createdAt: now,
  })

  return NextResponse.json({ id: ticketId })
}
