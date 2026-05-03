import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { customerUser, db, supportTicket } from '@/lib/db'

export const revalidate = 0

export default async function AdminSupportTicketsPage() {
  const rows = await db
    .select({
      ticket: supportTicket,
      email: customerUser.email,
      name: customerUser.name,
    })
    .from(supportTicket)
    .innerJoin(customerUser, eq(supportTicket.customerId, customerUser.id))
    .orderBy(desc(supportTicket.updatedAt))

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">تیکت‌های پشتیبانی</h2>
      <p className="text-sm text-gray-500 mb-6">{rows.length} تیکت</p>
      <ul className="space-y-2">
        {rows.map(({ ticket, email, name }) => (
          <li key={ticket.id}>
            <Link
              href={`/admin/support-tickets/${ticket.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-brand/30"
            >
              <div className="flex justify-between gap-2">
                <span className="font-medium text-gray-900">{ticket.subject}</span>
                <span className="text-xs text-gray-500">{ticket.status}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {name} · {email}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(ticket.updatedAt).toLocaleString('fa-IR')}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
