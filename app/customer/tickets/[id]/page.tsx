import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db, supportTicket, ticketMessage } from '@/lib/db'
import { ReplyForm } from './ReplyForm'

export default async function CustomerTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const [ticket] = await db.select().from(supportTicket).where(eq(supportTicket.id, id)).limit(1)
  if (!ticket || ticket.customerId !== session!.user!.id) notFound()

  const messages = await db
    .select()
    .from(ticketMessage)
    .where(eq(ticketMessage.ticketId, id))
    .orderBy(asc(ticketMessage.createdAt))

  return (
    <div dir="rtl">
      <Link href="/customer/tickets" className="text-sm text-brand hover:underline mb-4 inline-block">
        ← تیکت‌ها
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{ticket.subject}</h2>
      <p className="text-xs text-gray-400 mb-6">وضعیت: {ticket.status}</p>

      <ul className="space-y-3">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`rounded-xl p-4 text-sm ${
              m.fromCustomer ? 'bg-brand-light/40 border border-brand/20 me-8' : 'bg-gray-100 border border-gray-200 ms-8'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{m.fromCustomer ? 'شما' : 'پشتیبانی'}</div>
            <p className="whitespace-pre-wrap text-gray-800">{m.body}</p>
            <div className="text-xs text-gray-400 mt-2">{new Date(m.createdAt).toLocaleString('fa-IR')}</div>
          </li>
        ))}
      </ul>

      <ReplyForm ticketId={id} closed={ticket.status === 'closed'} />
    </div>
  )
}
