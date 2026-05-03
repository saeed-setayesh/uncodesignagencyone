import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { db, industry } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

const SITE = getSiteOrigin()

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'صنف‌ها — فهرست تخصص‌ها',
  description: 'فهرست صنف‌هایی که برای آن‌ها صفحه اختصاصی خدمات داریم — ورود سریع به هر صنف.',
  alternates: { canonical: `${SITE}/industries` },
  openGraph: { title: 'صنف‌ها', url: `${SITE}/industries`, locale: 'fa_IR', type: 'website' },
  robots: { index: true, follow: true },
}

export default async function IndustriesIndexPage() {
  const rows = await db
    .select({ id: industry.id, slug: industry.slug, fa: industry.fa })
    .from(industry)
    .where(eq(industry.active, true))
    .orderBy(asc(industry.fa))

  return (
    <>
      <Navbar />
      <main className="min-h-[50vh]">
        <section className="py-10 md:py-14 bg-slate-50 border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">صنف‌ها</h1>
            <p className="text-slate-600 mt-2 text-sm md:text-base">
              برای هر صنف، صفحهٔ اختصاصی با سرویس‌های شما. صنف را انتخاب کنید.
            </p>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {rows.map((i) => (
              <Link
                key={i.id}
                href={`/industries/${i.slug}`}
                className="text-center py-2.5 px-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 hover:border-brand hover:text-brand"
              >
                {i.fa}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
