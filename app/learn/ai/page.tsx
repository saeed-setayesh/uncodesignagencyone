import Link from 'next/link'
import { asc, and, eq, like } from 'drizzle-orm'
import { db, job } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AI_LEARNING_SLUG_PREFIX } from '@/lib/learning-jobs'
import { GraduationCap, Sparkles, Brain } from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()
const AI_DESC =
  'بیش از ۱۰۰ دورهٔ خصوصی هوش مصنوعی — Prompt Engineering، Machine Learning، تولید محتوا، Agent، RAG و کاربرد در کسب‌وکار. کلاس یک‌به‌یک با منتور.'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'آموزش خصوصی هوش مصنوعی — دوره‌های AI یک‌به‌یک | آنکو دیزاین',
  description: AI_DESC,
  alternates: { canonical: `${SITE}/learn/ai` },
  openGraph: {
    title: 'آموزش خصوصی هوش مصنوعی — آنکو دیزاین',
    description: AI_DESC,
    url: `${SITE}/learn/ai`,
    locale: 'fa_IR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function LearnAiHubPage() {
  const courses = await db
    .select({
      slug: job.slug,
      fa: job.fa,
      metaDescription: job.metaDescription,
    })
    .from(job)
    .where(and(eq(job.active, true), like(job.slug, `${AI_LEARNING_SLUG_PREFIX}%`)))
    .orderBy(asc(job.sortOrder), asc(job.fa))

  const active = courses.filter((c) => c.slug)

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-slate-50" />
          <div className="max-w-4xl mx-auto px-4 py-14 md:py-20 text-center" dir="rtl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-4 py-1.5 text-sm text-violet-800 mb-5 shadow-sm">
              <Brain className="w-4 h-4" />
              {active.length.toLocaleString('fa-IR')} دورهٔ تخصصی AI
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              آموزش خصوصی هوش مصنوعی
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
              {AI_DESC}
            </p>
            <Link
              href="/learn"
              className="text-sm text-brand font-medium hover:underline"
            >
              ← همه آموزش‌های فناوری
            </Link>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" aria-label="دوره‌های AI">
          <div className="max-w-6xl mx-auto px-4" dir="rtl">
            {active.length === 0 ? (
              <p className="text-center text-slate-500">دوره‌های AI در حال بارگذاری هستند.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/learn/${c.slug}`}
                      className="group block h-full rounded-2xl border border-slate-200 bg-slate-50/40 p-5 hover:border-violet-400 hover:bg-white hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 text-violet-700">
                          <Sparkles className="w-5 h-5" />
                        </span>
                        <span className="text-xs text-violet-700 font-medium opacity-0 group-hover:opacity-100 transition">
                          جزئیات ←
                        </span>
                      </div>
                      <h2 className="font-bold text-gray-900 mb-1 text-sm md:text-base group-hover:text-violet-800 transition-colors leading-snug">
                        {c.fa}
                      </h2>
                      {c.metaDescription?.trim() ? (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {c.metaDescription.trim()}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="py-14 bg-violet-900 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-3">دورهٔ مناسب خود را پیدا نکردید؟</h2>
            <p className="text-white/85 mb-8">مسیر شخصی‌سازی‌شده برای هدف شما طراحی می‌کنیم.</p>
            <Link
              href="/contact?learn=ai-consult"
              className="inline-flex bg-white text-violet-900 px-8 py-3.5 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              مشاورهٔ رایگان AI
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
