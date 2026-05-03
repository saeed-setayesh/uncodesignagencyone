'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'
import { toPersianDigits } from '@/lib/utils'
import type { AdminLandingPageStats } from '@/lib/admin-page-stats'

export type AdminPageRow = {
  id: string
  service: string
  neighborhoodKey: string
  cacheVersion: string
  createdAt: Date | string
  updatedAt: Date | string
  industry: { fa: string; slug: string }
  city: { fa: string; slug: string }
}

export type ServiceRow = { slug: string; fa: string }

const BADGE = 'bg-brand-light text-brand-dark ring-1 ring-brand/25'

function fmt(n: number) {
  return toPersianDigits(n.toLocaleString('en-US'))
}

export default function AdminPagesClient({
  initialPages,
  services,
  stats,
}: {
  initialPages: AdminPageRow[]
  services: ServiceRow[]
  stats: AdminLandingPageStats
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const serviceLabel: Record<string, string> = Object.fromEntries(services.map((s) => [s.slug, s.fa]))
  const serviceSlugs = services.map((s) => s.slug)

  async function handleDelete(id: string) {
    if (!confirm('آیا مطمئن هستید؟ صفحه حذف می‌شود.')) return
    setDeleting(id)
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' })
    setDeleting(null)
    router.refresh()
  }

  const pages = initialPages
  const filtered = filter === 'all' ? pages : pages.filter((p) => p.service === filter)

  const counts = pages.reduce<Record<string, number>>((acc, p) => {
    acc[p.service] = (acc[p.service] ?? 0) + 1
    return acc
  }, {})

  function publicPath(p: AdminPageRow): string {
    const base = `/${p.service}/${p.industry.slug}/${p.city.slug}`
    if (p.neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) return `${base}/${p.neighborhoodKey}`
    return base
  }

  function neighborhoodLabel(p: AdminPageRow): string {
    if (p.neighborhoodKey === CITY_LEVEL_NEIGHBORHOOD_KEY) return '—'
    return p.neighborhoodKey
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">مدیریت صفحات</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            <span className="text-gray-800 font-medium">{fmt(stats.stored)}</span> رکورد با محتوای ذخیره‌شده
            {' — '}
            از حداکثر{' '}
            <span className="text-brand-dark font-semibold">{fmt(stats.theoreticalMax)}</span> مسیر ممکن طبق
            قواعد ایجاد صفحه (سرویس فعال × صنف مرتبط × شهر، به‌همراه نسخهٔ جداگانه برای هر محله)
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + صفحه جدید
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-gray-800">{fmt(stats.stored)}</div>
          <div className="text-xs text-gray-500 mt-0.5">ذخیره‌شده در دیتابیس</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-brand/20 text-center col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold text-brand-dark">{fmt(stats.theoreticalMax)}</div>
          <div className="text-xs text-gray-500 mt-0.5">ظرفیت کل مسیرها</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-lg font-bold text-gray-700">{fmt(stats.theoreticalCityLevelOnly)}</div>
          <div className="text-xs text-gray-500 mt-0.5">فقط سطح شهر (بدون محله جدا)</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-lg font-bold text-gray-700">{fmt(stats.citiesActive)}</div>
          <div className="text-xs text-gray-500 mt-0.5">شهر فعال</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-lg font-bold text-gray-700">{fmt(stats.industriesActive)}</div>
          <div className="text-xs text-gray-500 mt-0.5">صنف فعال</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="text-lg font-bold text-gray-700">{fmt(stats.servicesActive)}</div>
          <div className="text-xs text-gray-500 mt-0.5">سرویس فعال</div>
        </div>
        {serviceSlugs.map((key) => (
          <div key={key} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-brand">{fmt(counts[key] ?? 0)}</div>
            <div className="text-xs text-gray-500 mt-0.5">ذخیره‌شده · {serviceLabel[key] ?? key}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
          }`}
        >
          همه
        </button>
        {serviceSlugs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
            }`}
          >
            {serviceLabel[key] ?? key}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">سرویس</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">صنف</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">شهر</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">محله</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">آخرین بروزرسانی</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${BADGE}`}>
                    {serviceLabel[page.service] ?? page.service}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 font-medium">{page.industry.fa}</td>
                <td className="px-4 py-3 text-gray-700">{page.city.fa}</td>
                <td className="px-4 py-3 text-gray-600 text-xs font-mono">{neighborhoodLabel(page)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(page.updatedAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link href={publicPath(page)} target="_blank" className="text-brand hover:underline text-xs">
                      مشاهده
                    </Link>
                    <Link href={`/admin/pages/${page.id}/edit`} className="text-gray-500 hover:text-brand text-xs">
                      ویرایش
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(page.id)}
                      disabled={deleting === page.id}
                      className="text-red-500 hover:underline text-xs disabled:opacity-50"
                    >
                      {deleting === page.id ? '...' : 'حذف'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            هیچ صفحه‌ای یافت نشد.{' '}
            <Link href="/admin/pages/new" className="text-brand hover:underline">
              ایجاد اولین صفحه
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
