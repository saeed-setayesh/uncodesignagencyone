import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db, supportTicket, ticketMessage } from '@/lib/db'
import { requireAdminSession } from '@/lib/admin-api-auth'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id: ticketId } = await context.params
  const [ticket] = await db.select().from(supportTicket).where(eq(supportTicket.id, ticketId)).limit(1)
  if (!ticket) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  let body: { body?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const text = String(body.body ?? '').trim()
  if (!text) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 })
  }

  const now = new Date()
  await db.insert(ticketMessage).values({
    id: randomUUID(),
    ticketId,
    fromCustomer: false,
    body: text,
    createdAt: now,
  })

  await db
    .update(supportTicket)
    .set({ updatedAt: now, status: 'answered' })
    .where(eq(supportTicket.id, ticketId))

  return NextResponse.json({ ok: true })
}
