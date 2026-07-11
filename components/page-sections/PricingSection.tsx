import Link from 'next/link'
import { Calculator } from 'lucide-react'
import type { Industry } from '@/lib/db'
import type { PricingPlan } from '@/types/pricing'

interface Props {
  industry: Industry
  serviceFa: string
  plans: PricingPlan[]
  /** صفحه ریشه سرویس: فقط «تعرفه [سرویس]» بدون نام صنف دمو */
  serviceRootPage?: boolean
  /** برای لینک تماس با context */
  serviceSlug?: string
}

export default function PricingSection({
  industry,
  serviceFa,
  plans,
  serviceRootPage,
  serviceSlug,
}: Props) {
  const gridCols = plans.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'
  const title = serviceRootPage ? `تعرفه ${serviceFa}` : `تعرفه ${serviceFa} ${industry.fa}`
  const contactHref = serviceSlug ? `/contact?service=${encodeURIComponent(serviceSlug)}` : '/contact'

  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-100" aria-label="تعرفه">
      <div className="max-w-6xl mx-auto px-4" dir="rtl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            قیمت شفاف برای شروع — جزئیات نهایی پس از مشاوره رایگان
          </p>
        </div>

        <div className={`grid grid-cols-1 gap-5 md:gap-6 ${gridCols}`}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.featured
                  ? 'border-2 border-brand bg-gradient-to-br from-brand-light/40 to-white shadow-xl shadow-brand/10'
                  : 'border border-slate-200 bg-white'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  پیشنهاد ویژه
                </div>
              )}

              <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="mb-5">
                {plan.originalPriceLabel && (
                  <div className="text-sm text-gray-400 line-through mb-1">{plan.originalPriceLabel}</div>
                )}
                <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{plan.priceLabel}</div>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-4 h-4 text-brand flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={contactHref}
                className={`block text-center rounded-xl py-3 px-3 text-sm font-bold transition ${
                  plan.featured
                    ? 'bg-brand text-white hover:bg-brand-dark'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                مشاوره رایگان
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center mt-8">
          <Link
            href="/price-calculator"
            className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline"
          >
            <Calculator className="w-4 h-4" aria-hidden />
            برآورد تعاملی بودجه — ماشین‌حساب قیمت
          </Link>
        </p>
      </div>
    </section>
  )
}
