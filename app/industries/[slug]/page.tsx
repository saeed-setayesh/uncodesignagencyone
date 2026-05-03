import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, asc, eq } from 'drizzle-orm'
import { db, industry, service as serviceTable } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const rows = await db
    .select()
    .from(industry)
    .where(and(eq(industry.slug, slug), eq(industry.active, true)))
    .limit(1)
  const ind = rows[0]
  if (!ind) return {}
  const title = `${ind.fa} — خدمات دیجیتال و صفحه اختصاصی`
  const description =
    (ind.desc || '').trim().slice(0, 160) || `صفحه اختصاصی خدمات برای ${ind.fa} در همه سرویس‌ها و شهرها.`
  const url = `${SITE}/industries/${ind.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: 'fa_IR', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  }
}

export default async function IndustryHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const indRows = await db
    .select()
    .from(industry)
    .where(and(eq(industry.slug, slug), eq(industry.active, true)))
    .limit(1)
  const ind = indRows[0]
  if (!ind) notFound()

  const services = await db
    .select({ slug: serviceTable.slug, fa: serviceTable.fa })
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder))

  const pageUrl = `${SITE}/industries/${ind.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: ind.fa,
    url: pageUrl,
    inLanguage: 'fa-IR',
    about: { '@type': 'Thing', name: ind.fa },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="py-10 md:py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">{ind.fa}</h1>
            {ind.desc?.trim() ? (
              <p className="text-slate-600 mt-3 leading-relaxed text-sm md:text-base">{ind.desc.trim()}</p>
            ) : (
              <p className="text-slate-600 mt-3 text-sm md:text-base">
                خدمات دیجیتال و صفحات اختصاصی برای {ind.fa} — سرویس موردنظر را انتخاب کنید.
              </p>
            )}
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
          <h2 className="text-lg font-bold text-slate-900 mb-4">سرویس‌ها برای این صنف</h2>
          <p className="text-slate-500 text-sm mb-6">
            هر لینک به هاب سراسر ایران همان سرویس و صنف می‌رود — از آنجا شهرها را ببینید.
          </p>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${s.slug}/${ind.slug}`}
                  className="block py-3 px-4 rounded-xl border border-slate-200 hover:border-brand hover:text-brand font-medium"
                >
                  {s.fa} — {ind.fa}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/industries" className="text-brand hover:underline">
              ← فهرست همه صنف‌ها
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
