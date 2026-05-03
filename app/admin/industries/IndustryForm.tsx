'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type ServiceOpt = { slug: string; fa: string }

type Initial = {
  id: string
  slug: string
  fa: string
  desc: string
  active: boolean
  suggestedServices: string[]
}

export default function IndustryForm({
  services,
  initial,
}: {
  services: ServiceOpt[]
  initial?: Initial | null
}) {
  const router = useRouter()
  const isEdit = !!initial
  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    fa: initial?.fa ?? '',
    desc: initial?.desc ?? '',
    active: initial?.active ?? true,
  })
  const [selectedServices, setSelectedServices] = useState<string[]>(initial?.suggestedServices ?? [])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleService(slug: string) {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, suggestedServices: selectedServices }
      const url = isEdit && initial?.id ? `/api/admin/industries/${initial.id}` : '/api/admin/industries'
      const method = isEdit && initial?.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطا در ذخیره‌سازی')
      router.push('/admin/industries')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !initial?.id) return
    if (!confirm('آیا مطمئن هستید؟ تمام صفحات این صنف نیز حذف خواهند شد.')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/industries/${initial.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('خطا در حذف')
      router.push('/admin/industries')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/industries" className="text-gray-400 hover:text-gray-600 text-sm">
          ← بازگشت
        </Link>
        <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'ویرایش صنف' : 'افزودن صنف جدید'}</h2>
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
              onChange={(e) => setForm((f) => ({ ...f, fa: e.target.value }))}
              required
              placeholder="مثال: کلینیک و مطب"
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
              placeholder="مثال: clinic"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="text-xs text-gray-400 mt-1">فقط حروف انگلیسی، اعداد و خط تیره</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیح انگلیسی (برای هوش مصنوعی) *</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              required
              rows={3}
              placeholder="medical clinic or doctor office offering outpatient services"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">این متن به هوش مصنوعی کمک می‌کند محتوای دقیق‌تری تولید کند</p>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">سرویس‌های پیشنهادی (فهرست صفحات)</span>
            <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {services.length === 0 ? (
                <p className="text-xs text-gray-500">ابتدا در «سرویس‌ها» حداقل یک سرویس فعال تعریف کنید.</p>
              ) : (
                services.map((s) => (
                  <label key={s.slug} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s.slug)}
                      onChange={() => toggleService(s.slug)}
                      className="rounded border-gray-300"
                    />
                    {s.fa} <span className="text-gray-400 font-mono text-xs">({s.slug})</span>
                  </label>
                ))
              )}
            </div>
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
              صنف فعال (در سایت نمایش داده شود)
            </label>
          </div>
          <div className="flex gap-3 pt-2 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ذخیره صنف'}
            </button>
            <Link
              href="/admin/industries"
              className="px-6 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              انصراف
            </Link>
            {isEdit && initial?.id && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 ms-auto disabled:opacity-60"
              >
                حذف صنف
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
