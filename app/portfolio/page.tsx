import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import { PortfolioProjectCard } from '@/components/portfolio/PortfolioProjectCard'
import { PORTFOLIO_SHOWCASE_PROJECTS } from '@/lib/portfolio-data'
import { Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()
const PORTFOLIO_DESC =
  'نمونه پروژه‌های طراحی سایت، سئو، شبکه‌های اجتماعی، فروشگاه اینترنتی، اپلیکیشن، پشتیبانی، تولید محتوا و ربات برای کسب‌وکارهای ایرانی.'

export const metadata: Metadata = {
  title: 'نمونه کارها و پروژه‌ها — آنکو دیزاین',
  description: PORTFOLIO_DESC,
  alternates: {
    canonical: `${SITE}/portfolio`,
  },
  openGraph: {
    title: 'نمونه کارها — آنکو دیزاین',
    description: 'پروژه‌های منتخب در حوزه‌های مختلف دیجیتال مارکتینگ و توسعه وب.',
    locale: 'fa_IR',
    type: 'website',
  },
}

export const revalidate = 3600

export default function PortfolioPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'نمونه کارها و پروژه‌های آنکو دیزاین',
    description: PORTFOLIO_DESC,
    url: `${SITE}/portfolio`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-brand-light/40 to-gray-50 border-b border-brand/10">
          <div className="max-w-4xl mx-auto px-4 py-14 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-brand/20 rounded-full px-4 py-1.5 text-sm text-brand-dark mb-6">
              <Sparkles className="w-4 h-4" />
              پروژه‌های واقعی — حوزه‌های مختلف
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              نمونه کارها و تجربهٔ پروژه
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              در این صفحه بخشی از نمونه‌های بصری و پروژه‌های منتخب را می‌بینید؛ برای جزئیات بیشتر و خدمات اختصاصی،
              صفحهٔ تماس و سرویس‌های سایت را ببینید.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25"
              >
                مشاوره برای پروژهٔ مشابه
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center justify-center border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:border-brand hover:text-brand transition-colors"
              >
                تیم ما
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: 'پروژهٔ تحویل‌شده', value: '+۱۸۰' },
                { label: 'حوزهٔ صنعتی', value: '۲۰۰+' },
                { label: 'رضایت اعلام‌شده', value: '۹۷٪' },
                { label: 'میانگین امتیاز', value: '۴.۹' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-gray-50 py-5 px-3 border border-gray-100">
                  <div className="text-2xl md:text-3xl font-bold text-brand mb-1">{s.value}</div>
                  <div className="text-xs md:text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16 bg-gray-50/80 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">نمونه‌های تصویری وب‌سایت و محصول</h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                برای هر پروژه، چند اسکرین‌شات مرتبط در یک کارت است؛ اگر بیش از یک تصویر باشد با تامبنیل‌های زیر میان
                نماها جابه‌جا شوید.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {PORTFOLIO_SHOWCASE_PROJECTS.map((project) => (
                <li key={project.id}>
                  <PortfolioProjectCard title={project.title} description={project.description} images={project.images} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TestimonialsSection />

        <section className="py-16 bg-brand text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">پروژهٔ شما را هم اضافه کنیم؟</h2>
            <p className="text-white/90 mb-8 text-sm md:text-base">
              بگویید در چه صنعتی و با چه بودجه‌ای کار می‌کنید؛ مسیر پیشنهادی و نمونهٔ قرارداد را شفاف می‌گوییم.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex justify-center bg-white text-brand px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                تماس با ما
              </Link>
              <Link
                href="/team"
                className="inline-flex justify-center border-2 border-white/80 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                تیم ما
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
