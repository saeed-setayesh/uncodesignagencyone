'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { countWords } from '@/lib/utils'
import { MIN_SERVICE_SEO_WORDS } from '@/lib/service-seo'
import { buildSeedServiceSeoBody } from '@/lib/seed-default-seo-body'
import { buildDefaultPricingPlans } from '@/lib/default-pricing-plans'
import PricingPlansEditor from '@/components/admin/PricingPlansEditor'
import type { PricingPlan } from '@/types/pricing'
import { PricingPlansSchema } from '@/types/pricing'

type JobRow = {
  id?: string
  slug: string
  fa: string
  seoBody: string
  metaTitle: string | null
  metaDescription: string | null
  pricingPlans: unknown | null
  active: boolean
  sortOrder: number
}

export default function JobAdminForm({ initial }: { initial?: JobRow | null }) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    fa: initial?.fa ?? '',
    seoBody: initial?.seoBody ?? buildSeedServiceSeoBody('فرصت شغلی جدید'),
    metaTitle: initial?.metaTitle ?? '',
    metaDescription: initial?.metaDescription ?? '',
    active: initial?.active ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  })
  const [usePlans, setUsePlans] = useState(() => {
    if (initial?.pricingPlans == null) return false
    return PricingPlansSchema.safeParse(initial.pricingPlans).success
  })
  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    if (initial?.pricingPlans) {
      const p = PricingPlansSchema.safeParse(initial.pricingPlans)
      if (p.success) return p.data
    }
    return buildDefaultPricingPlans(2)
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const seoWords = useMemo(() => countWords(form.seoBody), [form.seoBody])

  useEffect(() => {
    if (!usePlans) return
    setPlans((prev) => (prev.length === 4 ? prev : buildDefaultPricingPlans(2)))
  }, [usePlans])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        metaTitle: form.metaTitle.trim() || null,
        metaDescription: form.metaDescription.trim() || null,
        pricingPlans: usePlans ? plans : null,
      }
      const url = isEdit ? `/api/admin/jobs/${initial!.id}` : '/api/admin/jobs'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطا در ذخیره')
      router.push('/admin/jobs')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !initial?.id) return
    if (!confirm('حذف این شغل؟')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/jobs/${initial.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'خطا در حذف')
      router.push('/admin/jobs')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/jobs" className="text-gray-400 hover:text-gray-600 text-sm">
          ← بازگشت
        </Link>
        <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'ویرایش شغل' : 'شغل جدید'}</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm max-w-[200px]"
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
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            متن سئو (حداقل {MIN_SERVICE_SEO_WORDS} واژه) *
          </label>
          <textarea
            required
            value={form.seoBody}
            onChange={(e) => setForm((f) => ({ ...f, seoBody: e.target.value }))}
            rows={18}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-y min-h-[240px]"
          />
          <p className={`text-xs ${seoWords < MIN_SERVICE_SEO_WORDS ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {seoWords} واژه — حداقل {MIN_SERVICE_SEO_WORDS}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h3 className="font-semibold text-gray-800">متا (اختیاری)</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">عنوان</label>
            <input
              value={form.metaTitle}
              onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">توضیح</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <input
              type="checkbox"
              checked={usePlans}
              onChange={(e) => setUsePlans(e.target.checked)}
              className="rounded border-gray-300"
            />
            نمایش پلن‌های قیمت (۴ پلن)
          </label>
          {usePlans && <PricingPlansEditor plans={plans} onChange={setPlans} />}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="submit"
            disabled={loading || seoWords < MIN_SERVICE_SEO_WORDS}
            className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? '...' : 'ذخیره'}
          </button>
          <Link
            href="/admin/jobs"
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
  )
}
