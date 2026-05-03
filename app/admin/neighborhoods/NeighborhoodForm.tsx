'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type CityOpt = { id: string; fa: string; province: string }

type Initial = {
  id: string
  cityId: string
  slug: string
  fa: string
  seoDescription: string
  active: boolean
}

export default function NeighborhoodForm({
  cities,
  initial,
}: {
  cities: CityOpt[]
  initial?: Initial | null
}) {
  const router = useRouter()
  const isEdit = !!initial
  const [form, setForm] = useState({
    cityId: initial?.cityId ?? '',
    slug: initial?.slug ?? '',
    fa: initial?.fa ?? '',
    seoDescription: initial?.seoDescription ?? '',
    active: initial?.active ?? true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isEdit ? `/api/admin/neighborhoods/${initial!.id}` : '/api/admin/neighborhoods'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطا در ذخیره')
      router.push('/admin/neighborhoods')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !initial?.id) return
    if (!confirm('حذف این محله؟')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/neighborhoods/${initial.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطا در حذف')
      router.push('/admin/neighborhoods')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/neighborhoods" className="text-gray-400 hover:text-gray-600 text-sm">
          ← بازگشت
        </Link>
        <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'ویرایش محله' : 'محله جدید'}</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">شهر *</label>
            <select
              required
              value={form.cityId}
              onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
            >
              <option value="">انتخاب کنید</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fa} — {c.province}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام فارسی *</label>
            <input
              required
              value={form.fa}
              onChange={(e) => setForm((f) => ({ ...f, fa: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسلاگ *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">توضیح سئو (اختیاری)</label>
            <textarea
              value={form.seoDescription}
              onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
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
              فعال
            </label>
          </div>
          <div className="flex gap-3 pt-2 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? '...' : 'ذخیره'}
            </button>
            <Link
              href="/admin/neighborhoods"
              className="px-6 py-2.5 rounded-lg text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              انصراف
            </Link>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 ms-auto disabled:opacity-60"
              >
                حذف
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
