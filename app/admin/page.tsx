import Link from 'next/link'
import { count, desc, eq } from 'drizzle-orm'
import { city, db, generatedPage, industry } from '@/lib/db'

export const revalidate = 0

export default async function AdminDashboard() {
  const [cityCountRow, industryCountRow, pageCountRow, recentRows] = await Promise.all([
    db.select({ c: count() }).from(city).where(eq(city.active, true)),
    db.select({ c: count() }).from(industry).where(eq(industry.active, true)),
    db.select({ c: count() }).from(generatedPage),
    db
      .select({
        id: generatedPage.id,
        service: generatedPage.service,
        createdAt: generatedPage.createdAt,
        industryFa: industry.fa,
        industrySlug: industry.slug,
        cityFa: city.fa,
        citySlug: city.slug,
      })
      .from(generatedPage)
      .innerJoin(industry, eq(generatedPage.industryId, industry.id))
      .innerJoin(city, eq(generatedPage.cityId, city.id))
      .orderBy(desc(generatedPage.createdAt))
      .limit(5),
  ])

  const cityCount = Number(cityCountRow[0]?.c ?? 0)
  const industryCount = Number(industryCountRow[0]?.c ?? 0)
  const pageCount = Number(pageCountRow[0]?.c ?? 0)

  const totalPossible = cityCount * industryCount
  const pending = Math.max(0, totalPossible - pageCount)

  const stats = [
    { label: 'صفحات تولیدشده', value: pageCount.toLocaleString('fa-IR'), color: 'bg-brand', href: '/admin/pages' },
    { label: 'شهرهای فعال', value: cityCount.toLocaleString('fa-IR'), color: 'bg-brand-dark', href: '/admin/cities' },
    { label: 'صنف‌های فعال', value: industryCount.toLocaleString('fa-IR'), color: 'bg-brand/80', href: '/admin/industries' },
    { label: 'در انتظار تولید', value: pending.toLocaleString('fa-IR'), color: 'bg-brand-dark/90', href: '/admin/pages' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">داشبورد</h2>
        <p className="text-sm text-gray-500 mt-1">خلاصه وضعیت سیستم</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${s.color} rounded-lg mb-3`} />
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/cities/new"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-brand font-bold text-xl">+</div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">افزودن شهر جدید</div>
            <div className="text-xs text-gray-500">صفحات برای شهر جدید ایجاد شود</div>
          </div>
        </Link>
        <Link
          href="/admin/industries/new"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-brand font-bold text-xl">+</div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">افزودن صنف جدید</div>
            <div className="text-xs text-gray-500">صفحات برای صنف جدید ایجاد شود</div>
          </div>
        </Link>
        <Link
          href="/admin/pages"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand hover:shadow-sm transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-brand font-bold text-xl">⟳</div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">مدیریت صفحات</div>
            <div className="text-xs text-gray-500">تولید، حذف و بازسازی صفحات</div>
          </div>
        </Link>
      </div>

      {recentRows.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">آخرین صفحات تولیدشده</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentRows.map((page) => (
              <div key={page.id} className="px-5 py-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{page.industryFa}</span>
                  <span className="text-gray-400 mx-2">در</span>
                  <span className="text-gray-700">{page.cityFa}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(page.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                  <Link
                    href={`/${page.service ?? 'web-design'}/${page.industrySlug}/${page.citySlug}`}
                    target="_blank"
                    className="text-xs text-brand hover:underline"
                  >
                    مشاهده
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
