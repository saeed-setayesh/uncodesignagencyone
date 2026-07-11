import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, asc, eq, like, ne, notLike } from 'drizzle-orm'
import {
  BadgeCheck,
  BookOpenCheck,
  CalendarCheck,
  Check,
  GraduationCap,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { db, job as jobTable } from '@/lib/db'
import { buildLearningPageContent } from '@/lib/learning-content'
import { isAiLearningJob } from '@/lib/learning-jobs'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FaqSection from '@/components/page-sections/FaqSection'
import { getSiteOrigin } from '@/lib/site-url'
import type { Metadata } from 'next'

const SITE_URL = getSiteOrigin()

interface Props {
  jobSlug: string
}

export async function generateLearningMetadata(jobSlug: string): Promise<Metadata> {
  const [row] = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.slug, jobSlug), eq(jobTable.active, true)))
    .limit(1)
  if (!row) return {}
  const content = buildLearningPageContent(row)
  const url = `${SITE_URL}/learn/${jobSlug}`
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
    twitter: { card: 'summary_large_image', title: content.metaTitle, description: content.metaDescription },
    robots: { index: true, follow: true },
  }
}

export default async function LearningLandingPage({ jobSlug }: Props) {
  const [row] = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.slug, jobSlug), eq(jobTable.active, true)))
    .limit(1)
  if (!row) notFound()

  const content = buildLearningPageContent(row)
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'
  const contactHref = `/contact?learn=${encodeURIComponent(jobSlug)}`
  const pageUrl = `${SITE_URL}/learn/${jobSlug}`

  const isAi = isAiLearningJob(jobSlug)
  const otherJobs = await db
    .select({ slug: jobTable.slug, fa: jobTable.fa })
    .from(jobTable)
    .where(
      and(
        eq(jobTable.active, true),
        ne(jobTable.slug, jobSlug),
        isAi ? like(jobTable.slug, 'ai-%') : notLike(jobTable.slug, 'ai-%')
      )
    )
    .orderBy(asc(jobTable.sortOrder), asc(jobTable.fa))
    .limit(isAi ? 12 : 8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `آموزش خصوصی ${content.topicFa}`,
    description: content.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'آنکو دیزاین',
      sameAs: SITE_URL,
    },
    inLanguage: 'fa-IR',
    educationalCredentialAwarded: 'گواهی پایان دورهٔ خصوصی',
    url: pageUrl,
    hasCourseInstance: content.plans.map((plan) => ({
      '@type': 'CourseInstance',
      name: plan.name,
      courseMode: 'online',
      inLanguage: 'fa-IR',
      duration: plan.duration,
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/60 via-white to-slate-50" />
          <div className="bg-brand text-white text-center py-2 px-4 text-sm font-medium">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mx-2 align-middle" />
            {content.urgencyText}
          </div>
          <div className="max-w-5xl mx-auto px-4 py-14 md:py-20 text-center" dir="rtl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-4 py-1.5 text-sm text-brand-dark mb-5 shadow-sm">
              <GraduationCap className="w-4 h-4" />
              آموزش خصوصی یک‌به‌یک
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
                جلسهٔ آشنایی رایگان
              </Link>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 hover:border-brand hover:text-brand transition"
              >
                <Phone className="w-5 h-5" aria-hidden />
                {phone}
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-5">
              بدون پیش‌پرداخت برای جلسهٔ آشنایی — رضایت دانشجو شرط ادامهٔ کار است.
            </p>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {content.marketStats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/90 border border-slate-200 py-4 px-2 shadow-sm">
                  <div className="text-2xl md:text-3xl font-black text-brand">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why learn */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-100" aria-label="چرا این مهارت">
          <div className="max-w-6xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                چرا یادگیری {content.topicFa} الان مهم است؟
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                نه فقط آموزش — مسیری واقعی برای کسب درآمد از این مهارت
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {content.whyLearn.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-5 hover:border-brand/30 hover:shadow-sm transition"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="py-16 bg-slate-50 border-b border-slate-100" aria-label="مخاطبان">
          <div className="max-w-6xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">این دوره برای کیست؟</h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                هر سطحی که باشید، مسیر شخصی برای شما طراحی می‌کنیم
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.audience.map((a) => (
                <div key={a.title} className="rounded-2xl bg-white border border-slate-200 p-5">
                  <Users className="w-6 h-6 text-brand mb-3" aria-hidden />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{a.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-100" aria-label="سرفصل دوره">
          <div className="max-w-5xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark mb-3">
                <BookOpenCheck className="w-4 h-4" />
                سرفصل دوره
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                مسیر یادگیری {content.topicFa} — هفته‌به‌هفته
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                هر هفته یک خروجی واقعی روی گیت‌هاب؛ بازخورد روی کد، نه فقط ویدئوی پسیو
              </p>
            </div>

            <ol className="space-y-4">
              {content.curriculum.map((module, idx) => (
                <li
                  key={module.title}
                  className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white font-black text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{module.description}</p>
                      <ul className="grid sm:grid-cols-3 gap-2">
                        {module.outcomes.map((o) => (
                          <li key={o} className="flex items-center gap-2 text-xs text-slate-700">
                            <Check className="w-4 h-4 text-brand shrink-0" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Format */}
        <section className="py-16 bg-slate-50 border-b border-slate-100" aria-label="فرمت دوره">
          <div className="max-w-5xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">چطور برگزار می‌شود؟</h2>
              <p className="text-gray-600">انعطاف کامل — انتخاب با شماست</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.format.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white border border-slate-200 p-5">
                  <CalendarCheck className="w-6 h-6 text-brand mb-3" aria-hidden />
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-100" aria-label="پلن‌های دوره">
          <div className="max-w-6xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                پلن‌های آموزش خصوصی {content.topicFa}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                سه سطح متناسب با هدف شما؛ پرداخت مرحله‌ای، با امکان ارتقا در میانهٔ راه
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {content.plans.map((plan) => (
                <div
                  key={plan.tier}
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
                    <div className="text-xs text-slate-500 mt-1">
                      {plan.duration} · {plan.sessionsPerWeek}
                    </div>
                  </div>

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
                    ثبت‌نام در این پکیج
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
              قیمت‌ها تخمینی‌اند و پس از جلسهٔ آشنایی و تعیین سطح، نهایی می‌شوند.
            </p>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-slate-50 border-b border-slate-100" aria-label="فرآیند">
          <div className="max-w-4xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">مسیر شروع — ساده و شفاف</h2>
            </div>
            <ol className="space-y-4">
              {content.processSteps.map((step, idx) => (
                <li key={step.title} className="flex items-start gap-4 rounded-xl bg-white border border-slate-200 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <span className="text-[10px] font-bold rounded-full bg-brand/10 text-brand-dark px-2 py-0.5">
                        {step.timing}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white border-b border-slate-100" aria-label="نظرات">
          <div className="max-w-5xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">دانشجویان قبلی چه می‌گویند</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.testimonials.map((t) => (
                <blockquote key={t.name} className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <div className="flex items-center gap-1 mb-3" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">«{t.text}»</p>
                  <footer>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection faq={content.faq} />

        {/* مقدمهٔ کوتاه — متن طولانی متن سئو (jobs-seo-body) عمداً حذف شد چون تکراری بود */}
        {row.metaDescription?.trim() ? (
          <section className="py-12 bg-slate-50 border-y border-slate-200" dir="rtl">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-brand" />
                دربارهٔ {content.topicFa} و بازار کار
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-7">{row.metaDescription.trim()}</p>
              <p className="text-slate-500 text-xs md:text-sm mt-3">
                هدف این صفحه آموزش خصوصی این مهارت است؛ برای فرصت‌های همکاری کارفرمایی به{' '}
                <Link href={`/${row.slug ?? ''}`} className="text-brand hover:underline">
                  صفحهٔ این تخصص
                </Link>{' '}
                مراجعه کنید.
              </p>
            </div>
          </section>
        ) : null}

        {/* Final CTA */}
        <section className="py-16 bg-brand-dark text-white">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{content.ctaHeading}</h2>
            <p className="text-white/85 mb-8 leading-relaxed">{content.ctaSubtext}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark px-8 py-3.5 rounded-xl font-bold hover:bg-brand-light transition"
              >
                <MessageCircle className="w-5 h-5" />
                درخواست جلسهٔ آشنایی رایگان
              </Link>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                <Phone className="w-5 h-5" />
                {phone}
              </a>
            </div>
            <p className="text-white/60 text-xs mt-6">پاسخگویی ۷ روز هفته، ۹ صبح تا ۱۰ شب</p>
          </div>
        </section>

        {/* Other learning topics */}
        {otherJobs.length > 0 && (
          <section className="py-12 bg-white border-t border-slate-100" aria-label="آموزش‌های دیگر">
            <div className="max-w-5xl mx-auto px-4" dir="rtl">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">آموزش‌های دیگر</h2>
              <p className="text-center text-slate-500 text-sm mb-6">
                به مهارت دیگری علاقه دارید؟ صفحهٔ همان مهارت را باز کنید.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {otherJobs.slice(0, 24).map((j) => (
                  <Link
                    key={j.slug}
                    href={`/learn/${j.slug}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-slate-700 hover:border-brand hover:text-brand transition"
                  >
                    {j.fa}
                  </Link>
                ))}
              </div>
              <p className="text-center mt-6">
                <Link href="/learn" className="text-brand text-sm font-medium hover:underline">
                  فهرست همهٔ آموزش‌ها ←
                </Link>
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
