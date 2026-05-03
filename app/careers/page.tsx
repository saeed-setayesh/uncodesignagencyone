import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { db, job } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'
const CAREERS_DESC =
  'مشاهده موقعیت‌های فعال همکاری و استخدام — صفحهٔ اختصاصی برای هر شهر و نقش.'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'فرصت‌های شغلی — آنکو دیزاین',
  description: CAREERS_DESC,
  alternates: { canonical: `${SITE}/careers` },
  openGraph: {
    title: 'فرصت‌های شغلی — آنکو دیزاین',
    description: CAREERS_DESC,
    url: `${SITE}/careers`,
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'فرصت‌های شغلی — آنکو دیزاین', description: CAREERS_DESC },
  robots: { index: true, follow: true },
}

export default async function CareersPage() {
  const jobs = await db
    .select({
      id: job.id,
      slug: job.slug,
      fa: job.fa,
      updatedAt: job.updatedAt,
      metaDescription: job.metaDescription,
    })
    .from(job)
    .where(eq(job.active, true))
    .orderBy(asc(job.sortOrder), asc(job.fa))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'فرصت‌های شغلی',
    description: CAREERS_DESC,
    url: `${SITE}/careers`,
    inLanguage: 'fa-IR',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 py-12 md:py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3">موقعیت‌های شغلی</h1>
            <p className="text-slate-600 leading-relaxed">
              برای هر نقش صفحهٔ اختصاصی و فهرست شهرها داریم. روی موقعیت موردنظر بزنید.
            </p>
          </div>
        </section>
        <section className="py-12 max-w-3xl mx-auto px-4" dir="rtl">
          {jobs.length === 0 ? (
            <p className="text-center text-slate-500">در حال حاضر موقعیت فعالی ثبت نشده.</p>
          ) : (
            <ul className="space-y-3">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/${j.slug}`}
                    className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand hover:shadow-sm transition-all"
                  >
                    <span className="font-bold text-slate-900 text-lg">{j.fa}</span>
                    {j.metaDescription?.trim() ? (
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">{j.metaDescription.trim()}</p>
                    ) : null}
                    <span className="text-brand text-sm font-medium mt-2 inline-block">مشاهدهٔ جزئیات و شهرها ←</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
