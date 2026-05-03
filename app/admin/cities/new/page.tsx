'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { countWords } from '@/lib/utils'
import { MAX_CITY_SEO_WORDS } from '@/lib/cities-seo'

export default function NewCityPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    slug: '',
    fa: '',
    province: '',
    active: true,
    seoDescription: '',
  })
  const seoWords = useMemo(() => countWords(form.seoDescription), [form.seoDescription])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFaChange(value: string) {
    setForm((f) => ({ ...f, fa: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطا در ذخیره‌سازی')
      router.push('/admin/cities')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/cities" className="text-gray-400 hover:text-gray-600 text-sm">
          ← بازگشت
        </Link>
        <h2 className="text-xl font-bold text-gray-900">افزودن شهر جدید</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام فارسی *</label>
            <input
              type="text"
              value={form.fa}
              onChange={(e) => handleFaChange(e.target.value)}
              required
              placeholder="مثال: اصفهان"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسلاگ (URL) *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              required
              placeholder="مثال: isfahan"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="text-xs text-gray-400 mt-1">فقط حروف انگلیسی، اعداد و خط تیره</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">استان *</label>
            <input
              type="text"
              value={form.province}
              onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
              required
              placeholder="مثال: Isfahan"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیح سئو (اختیاری، حداکثر {MAX_CITY_SEO_WORDS} واژه)
            </label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
              rows={8}
              placeholder="متن بلند مخصوص این شهر برای تقویت سئوی صفحات محلی..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-y min-h-[120px]"
            />
            <p
              className={`text-xs mt-1 ${seoWords > MAX_CITY_SEO_WORDS ? 'text-red-600 font-medium' : 'text-gray-400'}`}
            >
              {seoWords} / {MAX_CITY_SEO_WORDS} واژه
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="w-4 h-4 text-brand rounded"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              شهر فعال (در سایت نمایش داده شود)
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || seoWords > MAX_CITY_SEO_WORDS}
              className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'در حال ذخیره...' : 'ذخیره شهر'}
            </button>
            <Link href="/admin/cities" className="px-6 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">
              انصراف
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
