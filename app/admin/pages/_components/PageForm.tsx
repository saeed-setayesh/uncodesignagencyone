'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { City, Industry } from '@/lib/db'
import type { PageContent } from '@/types/content'
import { industryOffersService } from '@/lib/industry-service-queries'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'

export type ServiceOption = { value: string; label: string }
export type NeighborhoodOption = { cityId: string; slug: string; fa: string }

const EMPTY_CONTENT: PageContent = {
  metaTitle: '',
  metaDescription: '',
  h1: '',
  heroSubtitle: '',
  urgencyText: '',
  stats: { projects: '+۱۴۰', satisfaction: '۹۷٪', rating: '۴.۹' },
  benefits: [
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' },
    { title: '', desc: '' },
  ],
  processSteps: [
    { title: '', desc: '', timing: '' },
    { title: '', desc: '', timing: '' },
    { title: '', desc: '', timing: '' },
    { title: '', desc: '', timing: '' },
  ],
  testimonials: [
    { text: '', name: '', business: '', initials: '' },
    { text: '', name: '', business: '', initials: '' },
  ],
  faq: [
    { q: '', a: '' },
    { q: '', a: '' },
    { q: '', a: '' },
    { q: '', a: '' },
  ],
  ctaHeading: '',
  ctaSubtext: '',
  whatsappText: '',
}

interface Props {
  industries: Industry[]
  cities: City[]
  serviceOptions: ServiceOption[]
  neighborhoods: NeighborhoodOption[]
  initialData?: {
    id: string
    service: string
    industryId: string
    cityId: string
    neighborhoodKey: string
    content: PageContent
  }
}

function Input({ label, value, onChange, textarea = false, rows = 2 }: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  rows?: number
}) {
  const cls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors'
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {textarea ? (
        <textarea className={cls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default function PageForm({
  industries,
  cities,
  serviceOptions,
  neighborhoods,
  initialData,
}: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const defaultService = initialData?.service ?? serviceOptions[0]?.value ?? 'web-design'
  const [service, setService] = useState(defaultService)
  const [industryId, setIndustryId] = useState(initialData?.industryId ?? '')
  const [cityId, setCityId] = useState(initialData?.cityId ?? '')
  const [neighborhoodKey, setNeighborhoodKey] = useState(
    initialData?.neighborhoodKey ?? CITY_LEVEL_NEIGHBORHOOD_KEY
  )
  const [content, setContent] = useState<PageContent>(initialData?.content ?? EMPTY_CONTENT)

  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const industriesForService = useMemo(() => {
    const list = industries.filter((i) => industryOffersService(i.suggestedServices, service))
    if (isEdit && initialData) {
      const cur = industries.find((i) => i.id === initialData.industryId)
      if (cur && !list.some((x) => x.id === cur.id)) return [...list, cur]
    }
    return list
  }, [industries, service, isEdit, initialData])

  const neighborhoodsForCity = useMemo(() => {
    if (!cityId) return []
    return neighborhoods.filter((n) => n.cityId === cityId)
  }, [neighborhoods, cityId])

  useEffect(() => {
    const ind = industries.find((i) => i.id === industryId)
    if (industryId && !industryOffersService(ind?.suggestedServices, service)) {
      setIndustryId('')
    }
  }, [service, industries, industryId])

  useEffect(() => {
    if (isEdit) return
    if (neighborhoodKey === CITY_LEVEL_NEIGHBORHOOD_KEY) return
    const ok = neighborhoodsForCity.some((n) => n.slug === neighborhoodKey)
    if (!ok) setNeighborhoodKey(CITY_LEVEL_NEIGHBORHOOD_KEY)
  }, [cityId, neighborhoodsForCity, neighborhoodKey, isEdit])

  function updateContent(path: string, value: unknown) {
    setContent((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  async function handleGenerateAI() {
    if (neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) {
      setError('تولید خودکار فعلاً فقط برای صفحهٔ سطح شهر (بدون محله) در دسترس است')
      return
    }
    const industry = industries.find((i) => i.id === industryId)
    const city = cities.find((c) => c.id === cityId)
    if (!industry || !city) { setError('لطفاً ابتدا صنف و شهر را انتخاب کنید'); return }

    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/pages/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industrySlug: industry.slug, citySlug: city.slug, service }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'خطا در تولید محتوا'); return }
      setContent(data.content)
      setSuccess('محتوا با موفقیت توسط هوش مصنوعی تولید شد. می‌توانید ویرایش کنید.')
    } catch {
      setError('خطا در ارتباط با سرور')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!industryId || !cityId) { setError('لطفاً صنف و شهر را انتخاب کنید'); return }

    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const url = isEdit ? `/api/admin/pages/${initialData!.id}` : '/api/admin/pages'
      const method = isEdit ? 'PUT' : 'POST'
      const body = isEdit
        ? { content }
        : { industryId, cityId, service, neighborhoodKey, content }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'خطا در ذخیره'); return }
      setSuccess('صفحه با موفقیت ذخیره شد')
      router.push('/admin/pages')
    } catch {
      setError('خطا در ارتباط با سرور')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Sticky toolbar */}
      <div className="sticky top-14 z-10 bg-gray-100 pb-3 pt-1">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerateAI}
            disabled={generating || saving || neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY}
            className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand transition-colors disabled:opacity-60"
          >
            {generating ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                در حال تولید...
              </>
            ) : '✨ تولید با هوش مصنوعی'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || generating}
            className="bg-brand text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {saving ? 'در حال ذخیره...' : '💾 ذخیره صفحه'}
          </button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
          {success && <span className="text-brand-dark text-sm">{success}</span>}
        </div>
      </div>

      {/* Page settings */}
      <Section title="تنظیمات صفحه">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">سرویس</label>
            <select
              disabled={isEdit}
              value={service}
              onChange={(e) => {
                setService(e.target.value)
                setIndustryId('')
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-gray-50"
            >
              {serviceOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">صنف</label>
            <select
              disabled={isEdit}
              value={industryId}
              onChange={(e) => setIndustryId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-gray-50"
            >
              <option value="">انتخاب کنید</option>
              {industriesForService.map((i) => (
                <option key={i.id} value={i.id}>{i.fa}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">شهر</label>
            <select
              disabled={isEdit}
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value)
                if (!isEdit) setNeighborhoodKey(CITY_LEVEL_NEIGHBORHOOD_KEY)
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-gray-50"
            >
              <option value="">انتخاب کنید</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.fa} — {c.province}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">محله (اختیاری)</label>
            <select
              disabled={isEdit || !cityId}
              value={neighborhoodKey}
              onChange={(e) => setNeighborhoodKey(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-gray-50"
            >
              <option value={CITY_LEVEL_NEIGHBORHOOD_KEY}>کل شهر</option>
              {neighborhoodsForCity.map((n) => (
                <option key={n.slug} value={n.slug}>{n.fa} ({n.slug})</option>
              ))}
            </select>
            {isEdit && (
              <p className="text-xs text-gray-400 mt-1">سطح محله در ویرایش قابل تغییر نیست.</p>
            )}
          </div>
        </div>
      </Section>

      {/* SEO */}
      <Section title="سئو">
        <Input label="عنوان صفحه (متا تایتل — حداکثر ۶۰ کاراکتر)" value={content.metaTitle} onChange={(v) => updateContent('metaTitle', v)} />
        <Input label="توضیح صفحه (متا دسکریپشن — حداکثر ۱۵۵ کاراکتر)" value={content.metaDescription} onChange={(v) => updateContent('metaDescription', v)} textarea rows={2} />
      </Section>

      {/* Hero */}
      <Section title="هدر (Hero)">
        <Input label="نوار فوری (Urgency Bar)" value={content.urgencyText} onChange={(v) => updateContent('urgencyText', v)} />
        <Input label="تیتر اصلی (H1)" value={content.h1} onChange={(v) => updateContent('h1', v)} />
        <Input label="زیرتیتر هیرو" value={content.heroSubtitle} onChange={(v) => updateContent('heroSubtitle', v)} textarea rows={2} />
      </Section>

      {/* Stats */}
      <Section title="آمار">
        <div className="grid grid-cols-3 gap-3">
          <Input label="تعداد پروژه‌ها" value={content.stats.projects} onChange={(v) => updateContent('stats.projects', v)} />
          <Input label="رضایت مشتریان" value={content.stats.satisfaction} onChange={(v) => updateContent('stats.satisfaction', v)} />
          <Input label="امتیاز" value={content.stats.rating} onChange={(v) => updateContent('stats.rating', v)} />
        </div>
      </Section>

      {/* Benefits */}
      <Section title="مزایا (۴ کارت)">
        {content.benefits.map((b, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
            <Input label={`عنوان ${i + 1}`} value={b.title} onChange={(v) => updateContent(`benefits.${i}.title`, v)} />
            <Input label={`توضیح ${i + 1}`} value={b.desc} onChange={(v) => updateContent(`benefits.${i}.desc`, v)} />
          </div>
        ))}
      </Section>

      {/* Process */}
      <Section title="مراحل کار (۴ مرحله)">
        {content.processSteps.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
            <Input label={`عنوان مرحله ${i + 1}`} value={s.title} onChange={(v) => updateContent(`processSteps.${i}.title`, v)} />
            <Input label="توضیح" value={s.desc} onChange={(v) => updateContent(`processSteps.${i}.desc`, v)} />
            <Input label="زمان‌بندی" value={s.timing} onChange={(v) => updateContent(`processSteps.${i}.timing`, v)} />
          </div>
        ))}
      </Section>

      {/* Testimonials */}
      <Section title="نظر مشتریان (۲ کارت)">
        {content.testimonials.map((t, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="col-span-2">
              <Input label={`متن نظر ${i + 1}`} value={t.text} onChange={(v) => updateContent(`testimonials.${i}.text`, v)} textarea rows={2} />
            </div>
            <Input label="نام" value={t.name} onChange={(v) => updateContent(`testimonials.${i}.name`, v)} />
            <Input label="حروف اول (avatar)" value={t.initials} onChange={(v) => updateContent(`testimonials.${i}.initials`, v)} />
            <div className="col-span-2">
              <Input label="کسب‌وکار" value={t.business} onChange={(v) => updateContent(`testimonials.${i}.business`, v)} />
            </div>
          </div>
        ))}
      </Section>

      {/* FAQ */}
      <Section title="سوالات متداول (۴ آیتم)">
        {content.faq.map((f, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg space-y-2">
            <Input label={`سوال ${i + 1}`} value={f.q} onChange={(v) => updateContent(`faq.${i}.q`, v)} />
            <Input label="جواب" value={f.a} onChange={(v) => updateContent(`faq.${i}.a`, v)} textarea rows={2} />
          </div>
        ))}
      </Section>

      {/* CTA */}
      <Section title="دکمه‌های تبدیل (CTA)">
        <Input label="تیتر CTA پایین صفحه" value={content.ctaHeading} onChange={(v) => updateContent('ctaHeading', v)} />
        <Input label="زیرتیتر CTA" value={content.ctaSubtext} onChange={(v) => updateContent('ctaSubtext', v)} textarea rows={2} />
        <Input label="متن پیش‌فرض واتس‌اپ" value={content.whatsappText} onChange={(v) => updateContent('whatsappText', v)} />
      </Section>

      <div className="flex gap-3 pb-8">
        <button
          onClick={handleSave}
          disabled={saving || generating}
          className="bg-brand text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره...' : '💾 ذخیره صفحه'}
        </button>
        <button
          onClick={() => router.push('/admin/pages')}
          className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          انصراف
        </button>
      </div>
    </div>
  )
}
