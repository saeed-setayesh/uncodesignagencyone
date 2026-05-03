import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db, supportTicket } from '@/lib/db'

const statusLabel: Record<string, string> = {
  open: 'باز',
  answered: 'پاسخ داده‌شده',
  closed: 'بسته',
}

export default async function CustomerTicketsPage() {
  const session = await getServerSession(authOptions)
  const tickets = await db
    .select()
    .from(supportTicket)
    .where(eq(supportTicket.customerId, session!.user!.id))
    .orderBy(desc(supportTicket.updatedAt))

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">تیکت‌های پشتیبانی</h2>
          <p className="text-sm text-gray-500 mt-1">پیام مستقیم به تیم آنکو دیزاین</p>
        </div>
        <Link
          href="/customer/tickets/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark"
        >
          تیکت جدید
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="text-gray-500 text-sm">هنوز تیکتی ثبت نکرده‌اید.</p>
      ) : (
        <ul className="space-y-2">
          {tickets.map((t) => (
            <li key={t.id}>
              <Link
                href={`/customer/tickets/${t.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-brand/30 transition-colors"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-gray-900">{t.subject}</span>
                  <span className="text-xs text-gray-500 shrink-0">{statusLabel[t.status] ?? t.status}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(t.updatedAt).toLocaleString('fa-IR')}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
