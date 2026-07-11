import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, asc, eq, like, ne } from 'drizzle-orm'
import {
  Check,
  Code2,
  MessageCircle,
  Phone,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { db, service as serviceTable } from '@/lib/db'
import { buildSoftwarePageContent } from '@/lib/software-content'
import { buildSoftwarePricingPlans } from '@/lib/software-pricing-plans'
import { buildSoftwareSeoBodyMarkdown } from '@/lib/software-seo-body'
import { softwareDbSlug } from '@/lib/software-products'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FaqSection from '@/components/page-sections/FaqSection'
import ProcessSection from '@/components/page-sections/ProcessSection'
import { getSiteOrigin } from '@/lib/site-url'
import type { Metadata } from 'next'

const SITE_URL = getSiteOrigin()
const CONSULT_CTA = 'مشاوره رایگان'

interface Props {
  /** Public slug without `software-` prefix, e.g. `crm-smart` */
  productSlug: string
}

export async function generateSoftwareMetadata(productSlug: string): Promise<Metadata> {
  const dbSlug = softwareDbSlug(productSlug)
  const [row] = await db
    .select()
    .from(serviceTable)
    .where(and(eq(serviceTable.slug, dbSlug), eq(serviceTable.active, true)))
    .limit(1)
  if (!row) return {}
  const content = buildSoftwarePageContent(row)
  const url = `${SITE_URL}/software/${productSlug}`
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url,
      locale: 'fa_IR',
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default async function SoftwareLandingPage({ productSlug }: Props) {
  const dbSlug = softwareDbSlug(productSlug)
  const [row] = await db
    .select()
    .from(serviceTable)
    .where(and(eq(serviceTable.slug, dbSlug), eq(serviceTable.active, true)))
    .limit(1)
  if (!row) notFound()

  const content = buildSoftwarePageContent(row)
  const plans = buildSoftwarePricingPlans(row.fa)
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'
  const contactHref = `/contact?software=${encodeURIComponent(productSlug)}`
  const pageUrl = `${SITE_URL}/software/${productSlug}`
  const seoParagraph = buildSoftwareSeoBodyMarkdown({
    fa: row.fa,
    en: row.en ?? '',
    metaDescription: row.metaDescription ?? '',
  })

  const related = await db
    .select({ slug: serviceTable.slug, fa: serviceTable.fa })
    .from(serviceTable)
    .where(
      and(eq(serviceTable.active, true), ne(serviceTable.slug, dbSlug), like(serviceTable.slug, 'software-%'))
    )
    .orderBy(asc(serviceTable.sortOrder), asc(serviceTable.fa))
    .limit(8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: content.productFa,
    description: content.metaDescription,
    url: pageUrl,
    brand: { '@type': 'Organization', name: 'آنکو دیزاین', url: SITE_URL },
    offers: plans.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      description: p.description,
      priceCurrency: 'IRR',
      availability: 'https://schema.org/InStock',
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/60 via-white to-slate-50" />
          <div className="bg-brand text-white text-center py-2 px-4 text-sm font-medium">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mx-2 align-middle" />
            {content.urgencyText}
          </div>
          <div className="max-w-5xl mx-auto px-4 py-14 md:py-20 text-center" dir="rtl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-4 py-1.5 text-sm text-brand-dark mb-5 shadow-sm">
              <Code2 className="w-4 h-4" />
              توسعه نرم‌افزار اختصاصی
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              {content.h1}
            </h1>
            <p className="text-base md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark transition"
              >
                <MessageCircle className="w-5 h-5" aria-hidden />
                {CONSULT_CTA}
              </Link>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 hover:border-brand hover:text-brand transition"
              >
                <Phone className="w-5 h-5" aria-hidden />
                {phone}
              </a>
            </div>
          </div>
        </section>

        <section className="py-10 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center" dir="rtl">
            <div>
              <div className="text-2xl md:text-3xl font-black text-brand">{content.stats.projects}</div>
              <div className="text-xs text-gray-500 mt-1">پروژه تحویل‌شده</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-brand">{content.stats.satisfaction}</div>
              <div className="text-xs text-gray-500 mt-1">رضایت مشتری</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-brand">{content.stats.rating}</div>
              <div className="text-xs text-gray-500 mt-1">امتیاز مشتریان</div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4" dir="rtl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">چرا با ما بسازید؟</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 hover:border-brand/30 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4" dir="rtl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">تحویل‌ها</h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              هر پروژه شامل این خروجی‌های استاندارد است — قابل سفارشی‌سازی در قرارداد.
            </p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.deliverables.map((d) => (
                <li key={d.title} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{d.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{d.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ProcessSection steps={content.processSteps} subheading="شفاف و مرحله‌ای" pale />

        <section className="py-16 md:py-20 bg-white border-b border-slate-100" aria-label="پکیج‌های پیشنهادی">
          <div className="max-w-6xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">پکیج‌های پیشنهادی</h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                قیمت نهایی پس از جلسه مشاوره — بر اساس scope دقیق پروژه.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
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
                  <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{plan.priceLabel}</div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden />
                        <span>{f}</span>
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
                    {CONSULT_CTA}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqSection faq={content.faq} />

        <section className="py-12 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-4" dir="rtl">
            <p className="text-gray-600 leading-relaxed text-center">{seoParagraph}</p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-14 bg-white border-t border-slate-100">
            <div className="max-w-5xl mx-auto px-4" dir="rtl">
              <h2 className="text-lg font-bold text-gray-900 mb-6">سایر نرم‌افزارهای سفارشی</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/software/${r.slug.replace(/^software-/, '')}`}
                      className="block text-sm text-gray-700 hover:text-brand border border-slate-200 rounded-lg px-3 py-2.5 hover:border-brand/30 transition"
                    >
                      {r.fa}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/software" className="inline-block mt-6 text-sm text-brand font-medium hover:underline">
                مشاهده همه ←
              </Link>
            </div>
          </section>
        )}

        <section className="py-16 bg-brand-dark text-white text-center" dir="rtl">
          <Rocket className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{content.ctaHeading}</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">{content.ctaSubtext}</p>
          <Link
            href={contactHref}
            className="inline-flex items-center gap-2 bg-white text-brand-dark px-8 py-3.5 rounded-xl font-bold hover:bg-brand-light transition"
          >
            <Shield className="w-5 h-5" />
            {CONSULT_CTA}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
