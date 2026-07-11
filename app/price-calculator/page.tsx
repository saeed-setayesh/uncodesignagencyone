import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PriceEstimatorSection from '@/components/page-sections/PriceEstimatorSection'
import { Calculator } from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()
const DESC =
  'برآورد تعاملی هزینهٔ طراحی سایت، سئو، فروشگاه، اپ و خدمات دیجیتال — بازهٔ تخمینی فوری؛ قیمت نهایی پس از مشاوره رایگان.'

export const metadata: Metadata = {
  title: 'ماشین‌حساب قیمت پروژه — برآورد آنلاین | آنکو دیزاین',
  description: DESC,
  alternates: { canonical: `${SITE}/price-calculator` },
  openGraph: {
    title: 'ماشین‌حساب قیمت — آنکو دیزاین',
    description: DESC,
    url: `${SITE}/price-calculator`,
    locale: 'fa_IR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function PriceCalculatorPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/60 via-white to-slate-50" />
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center" dir="rtl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-4 py-1.5 text-sm text-brand-dark mb-5 shadow-sm">
              <Calculator className="w-4 h-4" />
              برآورد آنلاین
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              ماشین‌حساب قیمت پروژه
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {DESC}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/contact" className="text-brand font-semibold hover:underline">
                مشاوره رایگان
              </Link>
              {' · '}
              <Link href="/" className="text-brand font-semibold hover:underline">
                بازگشت به خانه
              </Link>
            </p>
          </div>
        </section>

        <PriceEstimatorSection defaultServiceSlug="web-design" />
      </main>
      <Footer />
    </>
  )
}
