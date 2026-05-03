import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { customerUser, db } from '@/lib/db'

export const revalidate = 0

export default async function AdminCustomersPage() {
  const rows = await db.select().from(customerUser).orderBy(desc(customerUser.createdAt))

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">مشتریان</h2>
      <p className="text-sm text-gray-500 mb-6">{rows.length} حساب ثبت‌شده</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">نام</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">ایمیل</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">موبایل</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{c.email}</td>
                <td className="px-4 py-3 text-gray-500" dir="ltr">
                  {c.phone || '—'}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(c.createdAt).toLocaleDateString('fa-IR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        ورود مشتری:{' '}
        <Link href="/customer/login" className="text-brand hover:underline" target="_blank">
          /customer/login
        </Link>
      </p>
    </div>
  )
}
