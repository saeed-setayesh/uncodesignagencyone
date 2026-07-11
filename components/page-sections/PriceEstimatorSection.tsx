'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Calculator, Phone, Sparkles } from 'lucide-react'
import {
  ESTIMATOR_ADDONS,
  RUSH_MULTIPLIERS,
  SCALE_MULTIPLIERS,
  SERVICE_BASES,
  estimatePrice,
  formatToman,
  type ProjectScale,
  type RushLevel,
} from '@/lib/price-estimator-data'

type Props = {
  /** اسلاگ سرویس صفحهٔ فعلی برای پیش‌انتخاب */
  defaultServiceSlug?: string
}

export default function PriceEstimatorSection({ defaultServiceSlug = 'web-design' }: Props) {
  const validDefault = SERVICE_BASES.some((s) => s.slug === defaultServiceSlug)
    ? defaultServiceSlug
    : 'web-design'

  const [serviceSlug, setServiceSlug] = useState(validDefault)
  const [scale, setScale] = useState<ProjectScale>('medium')
  const [addonIds, setAddonIds] = useState<string[]>([])
  const [rush, setRush] = useState<RushLevel>('normal')

  const addonsForService = useMemo(
    () => ESTIMATOR_ADDONS.filter((a) => a.appliesTo.includes(serviceSlug)),
    [serviceSlug]
  )

  const result = useMemo(
    () => estimatePrice({ serviceSlug, scale, addonIds, rush }),
    [serviceSlug, scale, addonIds, rush]
  )

  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'

  const contactHref = result
    ? `/contact?service=${encodeURIComponent(serviceSlug)}&estimate=${result.lowToman}-${result.highToman}&scale=${scale}`
    : '/contact'

  function toggleAddon(id: string) {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <section id="price-estimator" className="py-16 md:py-20 bg-white border-y border-slate-100" aria-label="برآورد قیمت">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark mb-3">
            <Calculator className="w-4 h-4" aria-hidden />
            برآورد تعاملی
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">حدود بودجهٔ پروژه را همین الان ببینید</h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            گزینه‌ها را انتخاب کنید؛ بازهٔ قیمت <strong>تخمینی</strong> به‌روز می‌شود. قیمت نهایی پس از مشاوره و
            بررسی دقیق نیاز شما اعلام می‌شود.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_minmax(340px,400px)] gap-8 lg:gap-10 items-start">
          <div className="space-y-8" dir="rtl">
            <fieldset>
              <legend className="text-sm font-bold text-slate-900 mb-3">۱. نوع خدمت</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICE_BASES.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      setServiceSlug(s.slug)
                      setAddonIds([])
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition border ${
                      serviceSlug === s.slug
                        ? 'border-brand bg-brand text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand/40'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">{SERVICE_BASES.find((s) => s.slug === serviceSlug)?.copy}</p>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-slate-900 mb-3">۲. مقیاس پروژه</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(SCALE_MULTIPLIERS) as ProjectScale[]).map((key) => {
                  const item = SCALE_MULTIPLIERS[key]
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setScale(key)}
                      className={`rounded-xl border p-3 text-right transition ${
                        scale === key
                          ? 'border-brand bg-brand-light/80 ring-2 ring-brand/30'
                          : 'border-slate-200 hover:border-brand/30'
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{item.hint}</div>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {addonsForService.length > 0 && (
              <fieldset>
                <legend className="text-sm font-bold text-slate-900 mb-3">۳. افزونه‌ها (اختیاری)</legend>
                <ul className="space-y-2">
                  {addonsForService.map((a) => (
                    <li key={a.id}>
                      <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 has-[:checked]:border-brand has-[:checked]:bg-brand-light/40">
                        <input
                          type="checkbox"
                          className="mt-1 accent-brand"
                          checked={addonIds.includes(a.id)}
                          onChange={() => toggleAddon(a.id)}
                        />
                        <span className="flex-1 text-sm text-slate-800">{a.label}</span>
                        <span className="text-xs font-semibold text-brand shrink-0">
                          +{formatToman(a.priceToman)}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}

            <fieldset>
              <legend className="text-sm font-bold text-slate-900 mb-3">۴. زمان‌بندی</legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(RUSH_MULTIPLIERS) as RushLevel[]).map((key) => {
                  const item = RUSH_MULTIPLIERS[key]
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 cursor-pointer text-sm font-medium transition ${
                        rush === key ? 'border-brand bg-brand-light/70' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rush"
                        className="accent-brand"
                        checked={rush === key}
                        onChange={() => setRush(key)}
                      />
                      {item.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          <aside
            dir="rtl"
            className="lg:sticky lg:top-24 overflow-hidden rounded-2xl border-2 border-brand/20 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl"
          >
            {result ? (
              <div className="p-5 md:p-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 text-amber-200 px-2.5 py-1 text-[10px] font-bold mb-4">
                  <Sparkles className="w-3 h-3" aria-hidden />
                  تخمینی — قیمت دقیق پس از مشاوره
                </span>
                <p className="text-white/70 text-xs mb-3">بازهٔ برآورد ({result.serviceLabel})</p>

                <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 mb-5">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-white/60 shrink-0">از</span>
                    <span className="text-xl md:text-2xl font-black tabular-nums break-words leading-none">
                      {formatToman(result.lowToman)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap mt-2">
                    <span className="text-[11px] font-semibold text-white/60 shrink-0">تا</span>
                    <span className="text-xl md:text-2xl font-black tabular-nums break-words leading-none">
                      {formatToman(result.highToman)}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/55 mt-3">تومان (بدون مالیات احتمالی)</p>
                </div>

                <ul className="space-y-1.5 text-xs text-white/80 border-t border-white/10 pt-3 mb-5 max-h-40 overflow-y-auto pr-1">
                  {result.breakdown.map((line) => (
                    <li key={line.label} className="flex justify-between items-start gap-2 min-w-0">
                      <span className="min-w-0 break-words leading-snug">{line.label}</span>
                      <span className="shrink-0 tabular-nums font-semibold text-white/95">
                        {formatToman(line.amountToman)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={contactHref}
                  className="block w-full text-center rounded-xl bg-brand py-3 px-3 text-xs md:text-sm font-bold text-white hover:bg-brand-dark transition mb-2"
                >
                  گرفتن قیمت دقیق و مشاوره رایگان
                </Link>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/30 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
                >
                  <Phone className="w-4 h-4" aria-hidden />
                  تماس فوری
                </a>
              </div>
            ) : (
              <p className="text-white/80 text-sm p-6">لطفاً یک خدمت انتخاب کنید.</p>
            )}
          </aside>
        </div>

        <div
          className="mt-12 rounded-2xl border border-brand/15 bg-brand-light/40 p-6 md:p-8 text-right"
          dir="rtl"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">چرا تماس بگیرید؟</h3>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
            این ابزار فقط برای تصمیم‌گیری اولیه است. وقتی با ما تماس بگیرید، نیاز واقعی، رقبا و اولویت‌های شما را
            می‌شنویم؛ سپس پیشنهاد دقیق با فازبندی، زمان تحویل و امکان <strong>شروع بدون پیش‌پرداخت</strong> (پس از
            دیدن نسخهٔ اول) می‌دهیم. مشاوره رایگان است و تعهدی برای شما ایجاد نمی‌کند.
          </p>
          <Link
            href={contactHref}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark transition"
          >
            همین الان درخواست مشاوره بدهید — تیم فروش پاسخ می‌دهد
          </Link>
        </div>
      </div>
    </section>
  )
}
