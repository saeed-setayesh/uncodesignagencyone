import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { city, db, neighborhood } from '@/lib/db'

export const revalidate = 0

export default async function AdminNeighborhoodsPage() {
  const rows = await db
    .select({
      id: neighborhood.id,
      slug: neighborhood.slug,
      fa: neighborhood.fa,
      active: neighborhood.active,
      cityId: neighborhood.cityId,
      cityFa: city.fa,
    })
    .from(neighborhood)
    .innerJoin(city, eq(neighborhood.cityId, city.id))
    .orderBy(asc(neighborhood.cityId), asc(neighborhood.fa))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">محله‌ها</h2>
          <p className="text-sm text-gray-500 mt-1">{rows.length} مورد</p>
        </div>
        <Link
          href="/admin/neighborhoods/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + محله جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">محله</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">اسلاگ</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">شهر</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">وضعیت</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{n.fa}</td>
                <td className="px-5 py-3 font-mono text-xs text-gray-600">{n.slug}</td>
                <td className="px-5 py-3 text-gray-700">{n.cityFa}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      n.active ? 'bg-brand-light text-brand-dark' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {n.active ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/neighborhoods/${n.id}/edit`} className="text-brand hover:underline text-xs">
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
