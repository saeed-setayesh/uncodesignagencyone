import Link from 'next/link'
import { asc } from 'drizzle-orm'
import { db, industry } from '@/lib/db'

export const revalidate = 0

export default async function AdminIndustriesPage() {
  const industries = await db.select().from(industry).orderBy(asc(industry.fa))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">صنف‌ها</h2>
          <p className="text-sm text-gray-500 mt-1">{industries.length} صنف ثبت‌شده</p>
        </div>
        <Link
          href="/admin/industries/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + صنف جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">نام فارسی</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">اسلاگ</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">توضیح انگلیسی</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">وضعیت</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {industries.map((ind) => (
              <tr key={ind.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{ind.fa}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{ind.slug}</td>
                <td className="px-5 py-3 text-gray-500 text-xs max-w-xs truncate">{ind.desc}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${ind.active ? 'bg-brand-light text-brand-dark' : 'bg-gray-100 text-gray-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ind.active ? 'bg-brand' : 'bg-gray-400'}`} />
                    {ind.active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/industries/${ind.id}/edit`} className="text-brand hover:underline text-xs">
                      ویرایش
                    </Link>
                    <Link href={`/web-design/${ind.slug}`} target="_blank" className="text-gray-400 hover:text-gray-600 text-xs">
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
