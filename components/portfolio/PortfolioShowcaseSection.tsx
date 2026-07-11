'use client'

import Link from 'next/link'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import {
  PORTFOLIO_SHOWCASE_PROJECTS,
  getPortfolioIndustries,
  type PortfolioShowcaseProject,
} from '@/lib/portfolio-data'
import { PortfolioShowcaseCard } from '@/components/portfolio/PortfolioShowcaseCard'

const KPIS = [
  { value: '+۱۸۰', label: 'پروژهٔ تحویل‌شده' },
  { value: '۲۰+', label: 'صنف و حوزه' },
  { value: '۹۷٪', label: 'رضایت مشتری' },
]

export default function PortfolioShowcaseSection() {
  const industries = useMemo(() => getPortfolioIndustries(), [])
  const [activeIndustry, setActiveIndustry] = useState('همه')
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const filtered = useMemo(() => {
    if (activeIndustry === 'همه') return PORTFOLIO_SHOWCASE_PROJECTS
    return PORTFOLIO_SHOWCASE_PROJECTS.filter((p) => p.industry === activeIndustry)
  }, [activeIndustry])

  const setCardRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el
  }, [])

  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden border-y border-brand/10"
      aria-label="نمونه کارها"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/50 via-white to-slate-50" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-4 py-1.5 text-sm text-brand-dark mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand" aria-hidden />
            نمونه‌های واقعی، نه نمونهٔ فرضی
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3">
            قبل از قرارداد، کیفیت اجرا را ببینید
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            پروژه‌های تحویل‌شده در CRM، فروشگاه، فین‌تک، سینما و آموزش — همان سطحی که برای شما اجرا می‌کنیم.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
          {KPIS.map((k) => (
            <div
              key={k.label}
              className="rounded-xl bg-white/90 border border-slate-200/80 py-4 px-2 text-center shadow-sm"
            >
              <div className="text-xl md:text-2xl font-black text-brand">{k.value}</div>
              <div className="text-[10px] md:text-xs text-slate-500 mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8" role="tablist" aria-label="فیلتر صنعت">
          {industries.map((ind) => (
            <button
              key={ind}
              type="button"
              role="tab"
              aria-selected={activeIndustry === ind}
              onClick={() => setActiveIndustry(ind)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                activeIndustry === ind
                  ? 'bg-brand text-white shadow-md shadow-brand/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand/40'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* موبایل: کاروسل افقی */}
        <div
          className="md:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          dir="ltr"
        >
          {filtered.map((p) => (
            <div key={p.id} ref={setCardRef(p.id)} className="snap-center shrink-0 w-[82vw] max-w-sm">
              <PortfolioShowcaseCard project={p} />
            </div>
          ))}
        </div>

        {/* دسکتاپ: گرید سه‌ستونه */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((p) => (
            <div key={p.id} ref={setCardRef(p.id)}>
              <PortfolioShowcaseCard project={p} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-8">در این صنف نمونه‌ای ثبت نشده است.</p>
        )}

        {activeIndustry !== 'همه' && filtered.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-4">
            {filtered.length} پروژه در «{activeIndustry}»
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-brand hover:text-brand transition"
          >
            همهٔ نمونه کارها
            <ArrowLeft className="w-4 h-4" aria-hidden />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark transition"
          >
            پروژهٔ مشابه شما را بسازیم
          </Link>
        </div>
      </div>
    </section>
  )
}

/** برای اسکرول از فیلتر — در صورت نیاز export */
export type { PortfolioShowcaseProject }
