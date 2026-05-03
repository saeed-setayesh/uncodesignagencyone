import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { city, db, service as serviceTable } from '@/lib/db'
import { NATIONAL_HUB_CITY_SLUG } from '@/lib/content'
import CityActiveToggle from './CityActiveToggle'

export const revalidate = 0

export default async function AdminCitiesPage() {
  const [cities, sampleRows] = await Promise.all([
    db.select().from(city).orderBy(asc(city.fa)),
    db
      .select({ slug: serviceTable.slug })
      .from(serviceTable)
      .where(eq(serviceTable.active, true))
      .orderBy(asc(serviceTable.sortOrder))
      .limit(1),
  ])
  const sampleService = sampleRows[0]
  const demoBase = sampleService ? `/${sampleService.slug}/clinic` : '/web-design/clinic'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">شهرها</h2>
          <p className="text-sm text-gray-500 mt-1">{cities.length} شهر ثبت‌شده</p>
        </div>
        <Link
          href="/admin/cities/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + شهر جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">نام فارسی</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">اسلاگ</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">استان</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">توضیح سئو</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">وضعیت</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cities.map((cityRow) => (
              <tr key={cityRow.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{cityRow.fa}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{cityRow.slug}</td>
                <td className="px-5 py-3 text-gray-600">{cityRow.province}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {cityRow.seoDescription?.trim()
                    ? `${cityRow.seoDescription.trim().split(/\s+/).length} واژه`
                    : '—'}
                </td>
                <td className="px-5 py-3">
                  <CityActiveToggle
                    cityId={cityRow.id}
                    initialActive={cityRow.active}
                    isNationalHub={cityRow.slug === NATIONAL_HUB_CITY_SLUG}
                  />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/cities/${cityRow.id}/edit`} className="text-brand hover:underline text-xs">
                      ویرایش
                    </Link>
                    <Link
                      href={`${demoBase}/${cityRow.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
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
