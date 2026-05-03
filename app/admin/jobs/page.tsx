import Link from 'next/link'
import { asc } from 'drizzle-orm'
import { db, job } from '@/lib/db'

export const revalidate = 0

export default async function AdminJobsPage() {
  const jobs = await db
    .select()
    .from(job)
    .orderBy(asc(job.sortOrder), asc(job.fa))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">فرصت‌های شغلی</h2>
          <p className="text-sm text-gray-500 mt-1">{jobs.length} مورد</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + شغل جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">نام</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">اسلاگ</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">وضعیت</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{j.fa}</td>
                <td className="px-5 py-3 font-mono text-xs text-gray-600">{j.slug}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      j.active ? 'bg-brand-light text-brand-dark' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {j.active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/jobs/${j.id}/edit`} className="text-brand hover:underline text-xs">
                      ویرایش
                    </Link>
                    <Link href={`/${j.slug}`} target="_blank" className="text-gray-400 hover:text-gray-600 text-xs">
                      مشاهده
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
