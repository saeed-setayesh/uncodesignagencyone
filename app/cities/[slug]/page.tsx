import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, asc, eq } from 'drizzle-orm'
import {
  city as cityT,
  db,
  generatedPage,
  industry,
  job,
  service as serviceTable,
} from '@/lib/db'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()

export const revalidate = 3600

function buildPagePath(
  service: string,
  industrySlug: string,
  citySlug: string,
  neighborhoodKey: string
): string {
  const base = `/${service}/${industrySlug}/${citySlug}`
  if (neighborhoodKey && neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) {
    return `${base}/${neighborhoodKey}`
  }
  return base
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cityRows = await db
    .select()
    .from(cityT)
    .where(and(eq(cityT.slug, slug), eq(cityT.active, true)))
    .limit(1)
  const c = cityRows[0]
  if (!c) return {}
  const d = c.seoDescription?.trim() || `خدمات دیجیتال و صفحات اختصاصی در ${c.fa}.`
  const title = `${c.fa} — خدمات و لندینگ اختصاصی`.slice(0, 70)
  const description = d.slice(0, 160)
  const url = `${SITE}/cities/${c.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: 'fa_IR', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  }
}

export default async function CityHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cityRows = await db
    .select()
    .from(cityT)
    .where(and(eq(cityT.slug, slug), eq(cityT.active, true)))
    .limit(1)
  const city = cityRows[0]
  if (!city) notFound()

  const [pageRows, serviceRows, jobRows] = await Promise.all([
    db
      .select({
        service: generatedPage.service,
        industryId: generatedPage.industryId,
        neighborhoodKey: generatedPage.neighborhoodKey,
        industrySlug: industry.slug,
        industryFa: industry.fa,
      })
      .from(generatedPage)
      .innerJoin(industry, eq(generatedPage.industryId, industry.id))
      .where(eq(generatedPage.cityId, city.id))
      .orderBy(asc(generatedPage.service), asc(industry.fa)),
    db
      .select({ slug: serviceTable.slug, fa: serviceTable.fa })
      .from(serviceTable)
      .where(eq(serviceTable.active, true)),
    db
      .select({ slug: job.slug, fa: job.fa })
      .from(job)
      .where(eq(job.active, true))
      .orderBy(asc(job.fa)),
  ])
  const svcFa = Object.fromEntries(serviceRows.map((s) => [s.slug, s.fa]))

  const seen = new Set<string>()
  const uniqueLinks: { path: string; label: string }[] = []
  for (const p of pageRows) {
    const k = `${p.service}:${p.industryId}:${p.neighborhoodKey ?? ''}`
    if (seen.has(k)) continue
    seen.add(k)
    const path = buildPagePath(p.service, p.industrySlug, city.slug, p.neighborhoodKey)
    const hood =
      p.neighborhoodKey && p.neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY
        ? ` (${p.neighborhoodKey})`
        : ''
    uniqueLinks.push({
      path,
      label: `${svcFa[p.service] || p.service} — ${p.industryFa}${hood}`,
    })
  }

  const pageUrl = `${SITE}/cities/${city.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: city.fa,
    url: pageUrl,
    inLanguage: 'fa-IR',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="py-10 md:py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">{city.fa}</h1>
            {city.province ? <p className="text-slate-500 text-sm mt-1">{city.province}</p> : null}
            {city.seoDescription?.trim() ? (
              <div className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed text-right whitespace-pre-wrap">
                {city.seoDescription.trim()}
              </div>
            ) : (
              <p className="text-slate-600 mt-3 text-sm md:text-base">
                صفحات تولیدشده و خدمات اختصاصی برای {city.fa}.
              </p>
            )}
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
          {uniqueLinks.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-slate-900 mb-4">صفحات اختصاصی در این شهر</h2>
              <ul className="space-y-2 mb-10">
                {uniqueLinks.map((l, i) => (
                  <li key={`${l.path}-${i}`}>
                    <Link
                      href={l.path}
                      className="block py-2.5 px-3 rounded-lg border border-slate-200 hover:border-brand hover:text-brand text-sm"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {jobRows.length > 0 && (
            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">فرصت‌های شغلی در {city.fa}</h2>
              <ul className="space-y-2">
                {jobRows.map((j) => (
                  <li key={j.slug}>
                    <Link
                      href={`/${j.slug}/${city.slug}`}
                      className="block py-2.5 px-3 rounded-lg border border-slate-200 hover:border-brand hover:text-brand text-sm"
                    >
                      {j.fa} — {city.fa}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uniqueLinks.length === 0 && jobRows.length === 0 && (
            <p className="text-slate-500 text-sm text-center">
              هنوز صفحه تولیدشده‌ای در دیتابیس برای این شهر ثبت نشده. از{' '}
              <Link href="/" className="text-brand">
                خانه
              </Link>{' '}
              سرویس‌ها را ببینید.
            </p>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link href="/cities" className="text-brand hover:underline">
              ← فهرست همه شهرها
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
