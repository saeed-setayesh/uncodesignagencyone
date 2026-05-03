import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { customerUser, db, supportTicket, ticketMessage } from '@/lib/db'
import { AdminReplyForm } from './AdminReplyForm'

export const revalidate = 0

export default async function AdminSupportTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [row] = await db
    .select({
      ticket: supportTicket,
      email: customerUser.email,
      name: customerUser.name,
    })
    .from(supportTicket)
    .innerJoin(customerUser, eq(supportTicket.customerId, customerUser.id))
    .where(eq(supportTicket.id, id))
    .limit(1)
  if (!row) notFound()

  const messages = await db
    .select()
    .from(ticketMessage)
    .where(eq(ticketMessage.ticketId, id))
    .orderBy(asc(ticketMessage.createdAt))

  return (
    <div dir="rtl">
      <Link href="/admin/support-tickets" className="text-sm text-brand hover:underline mb-4 inline-block">
        ← تیکت‌ها
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{row.ticket.subject}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {row.name} · <span dir="ltr">{row.email}</span> · وضعیت: {row.ticket.status}
      </p>

      <ul className="space-y-3">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`rounded-xl p-4 text-sm ${
              m.fromCustomer ? 'bg-gray-100 border border-gray-200 me-8' : 'bg-brand-light/40 border border-brand/20 ms-8'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{m.fromCustomer ? 'مشتری' : 'مدیر'}</div>
            <p className="whitespace-pre-wrap">{m.body}</p>
            <div className="text-xs text-gray-400 mt-2">{new Date(m.createdAt).toLocaleString('fa-IR')}</div>
          </li>
        ))}
      </ul>

      <AdminReplyForm ticketId={id} />
    </div>
  )
}
