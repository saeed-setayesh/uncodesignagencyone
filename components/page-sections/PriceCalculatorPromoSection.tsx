import Link from 'next/link'
import { Calculator } from 'lucide-react'

/** Compact promo linking to the dedicated price calculator page. */
export default function PriceCalculatorPromoSection() {
  return (
    <section className="py-12 md:py-14 bg-slate-50 border-y border-slate-100" aria-label="برآورد قیمت">
      <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
        <Calculator className="w-8 h-8 text-brand mx-auto mb-3" aria-hidden />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">برآورد بودجهٔ پروژه</h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
          گزینه‌ها را انتخاب کنید؛ بازهٔ قیمت تخمینی فوری به‌روز می‌شود. قیمت نهایی پس از مشاوره رایگان اعلام
          می‌شود.
        </p>
        <Link
          href="/price-calculator"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark transition"
        >
          ماشین‌حساب قیمت
        </Link>
      </div>
    </section>
  )
}
