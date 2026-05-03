import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { city, db } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'شهرها — پوشش سراسری',
  description: 'فهرست شهرهایی که صفحه اختصاصی خدمات و موقعیت شغلی برای آن‌ها داریم.',
  alternates: { canonical: `${SITE}/cities` },
  openGraph: { title: 'شهرها', url: `${SITE}/cities`, locale: 'fa_IR', type: 'website' },
  robots: { index: true, follow: true },
}

export default async function CitiesIndexPage() {
  const rows = await db
    .select({ id: city.id, slug: city.slug, fa: city.fa, province: city.province })
    .from(city)
    .where(eq(city.active, true))
    .orderBy(asc(city.fa))

  return (
    <>
      <Navbar />
      <main className="min-h-[50vh]">
        <section className="py-10 md:py-14 bg-slate-50 border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">شهرها</h1>
            <p className="text-slate-600 mt-2 text-sm md:text-base">
              صفحه اختصاصی هر شهر برای خدمات و فرصت‌های شغلی. شهر را انتخاب کنید.
            </p>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {rows.map((c) => (
              <Link
                key={c.id}
                href={`/cities/${c.slug}`}
                className="text-center py-2.5 px-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 hover:border-brand hover:text-brand"
              >
                {c.fa}
                {c.province ? <span className="block text-xs text-slate-400 font-normal mt-0.5">{c.province}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
