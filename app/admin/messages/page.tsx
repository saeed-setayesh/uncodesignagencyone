import { getServerSession } from 'next-auth'
import { desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { contactMessage, db } from '@/lib/db'
import { MarkReadButton } from './MarkReadButton'

export const metadata = { title: 'پیام‌های تماس — پنل' }

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/admin/login?callbackUrl=/admin/messages')
  }

  const messages = await db
    .select()
    .from(contactMessage)
    .orderBy(desc(contactMessage.createdAt))
    .limit(200)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">پیام‌های فرم تماس</h1>
      <p className="text-sm text-gray-500 mb-6">پیام‌های ارسال‌شده از /contact</p>

      {messages.length === 0 ? (
        <p className="text-gray-500 text-sm">هنوز پیامی ثبت نشده.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border p-4 ${
                m.read ? 'bg-white border-gray-200' : 'bg-amber-50/80 border-amber-200'
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <div className="font-semibold text-gray-900">{m.name}</div>
                <div className="text-xs text-gray-500" dir="ltr">
                  {m.phone}
                </div>
                <div className="text-xs text-gray-400 w-full sm:w-auto sm:ms-auto">{fmtDate(m.createdAt)}</div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-3">{m.message}</p>
              {!m.read && <MarkReadButton id={m.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
