import Link from 'next/link'
import { asc, and, eq, like } from 'drizzle-orm'
import { db, service } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SOFTWARE_SLUG_PREFIX } from '@/lib/software-products'
import { Code2, MessageCircle, Rocket, Shield, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()
const DESC =
  'سفارش طراحی و توسعه نرم‌افزار اختصاصی — CRM، ERP، پنل admin، فروشگاه، AI و اتوماسیون. مشاوره رایگان، قیمت شفاف، تحویل مرحله‌ای.'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'سفارش نرم‌افزار اختصاصی — طراحی و توسعه | آنکو دیزاین',
  description: DESC,
  alternates: { canonical: `${SITE}/software` },
  openGraph: {
    title: 'نرم‌افزار اختصاصی — آنکو دیزاین',
    description: DESC,
    url: `${SITE}/software`,
    locale: 'fa_IR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function SoftwareHubPage() {
  const products = await db
    .select({
      slug: service.slug,
      fa: service.fa,
      metaDescription: service.metaDescription,
    })
    .from(service)
    .where(and(eq(service.active, true), like(service.slug, `${SOFTWARE_SLUG_PREFIX}%`)))
    .orderBy(asc(service.sortOrder), asc(service.fa))

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/60 via-white to-slate-50" />
          <div className="bg-brand text-white text-center py-2 px-4 text-sm font-medium">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mx-2 align-middle" />
            مشاوره و برآورد اولیه رایگان — ظرفیت پروژه محدود
          </div>
          <div className="max-w-4xl mx-auto px-4 py-14 md:py-20 text-center" dir="rtl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-4 py-1.5 text-sm text-brand-dark mb-5 shadow-sm">
              <Code2 className="w-4 h-4" />
              {products.length.toLocaleString('fa-IR')} محصول نرم‌افزاری
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              نرم‌افزار اختصاصی برای کسب‌وکار شما
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              {DESC}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/contact?software=custom"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark transition"
              >
                <MessageCircle className="w-5 h-5" aria-hidden />
                مشاوره رایگان
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <Rocket className="w-4 h-4 text-brand" /> MVP در ۴–۶ هفته
              </span>
              <span className="inline-flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand" /> کد و داده مال شما
              </span>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100" dir="rtl">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">محصولات و راه‌حل‌ها</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                روی هر مورد کلیک کنید — جزئیات، پکیج قیمت و فرآیند سفارش.
              </p>
            </div>

            {products.length === 0 ? (
              <p className="text-center text-gray-500">محصولی ثبت نشده است.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => {
                  const publicSlug = p.slug.replace(/^software-/, '')
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/software/${publicSlug}`}
                        className="group block h-full rounded-2xl border border-slate-200/90 bg-white p-5 hover:border-brand hover:shadow-md hover:shadow-brand/10 transition"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand/10 text-brand">
                            <Sparkles className="w-5 h-5" />
                          </span>
                          <span className="text-xs text-brand font-semibold opacity-70 group-hover:opacity-100 transition">
                            جزئیات بیشتر ←
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base group-hover:text-brand-dark transition-colors leading-snug">
                          {p.fa}
                        </h3>
                        {p.metaDescription?.trim() ? (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {p.metaDescription.trim()}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="py-16 bg-brand-dark text-white">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <h2 className="text-2xl font-bold mb-3">پروژهٔ اختصاصی دارید؟</h2>
            <p className="text-white/85 mb-8">
              حتی اگر در لیست نبود — scope شما را تحلیل می‌کنیم و مسیر و قیمت شفاف پیشنهاد می‌دهیم.
            </p>
            <Link
              href="/contact?software=custom"
              className="inline-flex items-center gap-2 bg-white text-brand-dark px-8 py-3.5 rounded-xl font-bold hover:bg-brand-light transition"
            >
              <MessageCircle className="w-5 h-5" />
              مشاوره رایگان
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
