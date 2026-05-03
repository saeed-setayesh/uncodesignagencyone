import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db, supportTicket, ticketMessage } from '@/lib/db'
import { requireCustomerSession } from '@/lib/customer-api-auth'

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireCustomerSession()
  if (!auth.ok) return auth.response

  const { id } = await context.params
  const [ticket] = await db
    .select()
    .from(supportTicket)
    .where(eq(supportTicket.id, id))
    .limit(1)

  if (!ticket || ticket.customerId !== auth.customerId) {
    return NextResponse.json({ error: 'یافت نشد' }, { status: 404 })
  }

  const messages = await db
    .select()
    .from(ticketMessage)
    .where(eq(ticketMessage.ticketId, id))
    .orderBy(asc(ticketMessage.createdAt))

  return NextResponse.json({ ticket, messages })
}
