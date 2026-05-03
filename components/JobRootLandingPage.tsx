import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, asc, eq } from 'drizzle-orm'
import { city as cityT, db, job as jobTable } from '@/lib/db'
import { buildJobSalesBlocks } from '@/lib/job-landing-content'
import { parseJobPricingPlans } from '@/lib/parse-job-pricing-plans'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JobHeroSection from '@/components/JobHeroSection'
import JobPricingSection from '@/components/JobPricingSection'
import StatsBar from '@/components/page-sections/StatsBar'
import BenefitsSection from '@/components/page-sections/BenefitsSection'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import FaqSection from '@/components/page-sections/FaqSection'
import ProcessSection from '@/components/page-sections/ProcessSection'
import BottomCta from '@/components/page-sections/BottomCta'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'

interface Props {
  jobSlug: string
}

export async function generateJobRootMetadata(jobSlug: string): Promise<Metadata> {
  const [j] = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.slug, jobSlug), eq(jobTable.active, true)))
    .limit(1)
  if (!j) return {}
  const title = j.metaTitle?.trim() || `${j.fa} — فرصت‌های شغلی`
  const desc = j.metaDescription?.trim() || j.seoBody.replace(/\s+/g, ' ').slice(0, 160)
  const url = `${SITE_URL}/${jobSlug}`
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, locale: 'fa_IR', type: 'website' },
    twitter: { card: 'summary_large_image', title, description: desc },
    robots: { index: true, follow: true },
  }
}

export default async function JobRootLandingPage({ jobSlug }: Props) {
  const [jobRow] = await db
    .select()
    .from(jobTable)
    .where(and(eq(jobTable.slug, jobSlug), eq(jobTable.active, true)))
    .limit(1)
  if (!jobRow) notFound()
  const job = jobRow

  const sales = buildJobSalesBlocks(job)
  const plans = parseJobPricingPlans(job.pricingPlans)
  const contactHref = `/contact?job=${encodeURIComponent(jobSlug)}`

  const [cities, allJobs] = await Promise.all([
    db
      .select()
      .from(cityT)
      .where(eq(cityT.active, true))
      .orderBy(asc(cityT.fa)),
    db
      .select({ id: jobTable.id, slug: jobTable.slug, fa: jobTable.fa })
      .from(jobTable)
      .where(eq(jobTable.active, true))
      .orderBy(asc(jobTable.sortOrder), asc(jobTable.fa)),
  ])
  const otherJobs = allJobs.filter((j) => j.slug !== jobSlug)

  const pageUrl = `${SITE_URL}/${jobSlug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: sales.h1,
    description: job.metaDescription || sales.heroSubtitle,
    url: pageUrl,
    inLanguage: 'fa-IR',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <JobHeroSection
          h1={sales.h1}
          subtitle={sales.heroSubtitle}
          urgencyText={sales.urgencyText}
          contactHref={contactHref}
        />
        <StatsBar stats={sales.stats} />
        <BenefitsSection
          benefits={sales.benefits}
          title={`چرا برای ${job.fa} با ما کار کنید؟`}
          subheading="شفافیت، تعرفه و مسیر از تماس تا شروع"
        />
        <JobPricingSection jobFa={job.fa} jobSlug={jobSlug} plans={plans} />
        <ProcessSection
          steps={sales.processSteps}
          subheading="از ارسال درخواست تا شروع همکاری"
          pale
        />
        <TestimonialsSection />
        <FaqSection faq={sales.faq} />
        <BottomCta heading={sales.ctaHeading} subtext={sales.ctaSubtext} />
        {otherJobs.length > 0 && (
          <section className="py-12 bg-slate-50/60 border-t border-slate-100" aria-label="سایر موقعیت‌ها">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">سایر فرصت‌های شغلی</h2>
              <p className="text-center text-slate-500 text-sm mb-6">همهٔ موقعیت‌های فعال — صفحهٔ اختصاصی هر نقش</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {otherJobs.map((j) => (
                  <Link
                    key={j.id}
                    href={`/${j.slug}`}
                    className="block text-center py-3 px-3 rounded-xl border border-slate-200/90 bg-white text-sm text-slate-800 hover:border-brand hover:text-brand transition-colors"
                  >
                    {j.fa}
                  </Link>
                ))}
              </div>
              <p className="text-center mt-6">
                <Link href="/careers" className="text-brand text-sm font-medium hover:underline">
                  مشاهدهٔ همه موقعیت‌ها ←
                </Link>
              </p>
            </div>
          </section>
        )}
        <section id="city-jobs" className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">موقعیت در شهرها</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              برای {job.fa} در هر شهر صفحهٔ اختصاصی داریم — روی شهر خود کلیک کنید.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {cities.map((c) => (
                <Link
                  key={c.id}
                  href={`/${jobSlug}/${c.slug}`}
                  className="block text-center py-2.5 px-2 rounded-lg border border-gray-200 text-sm hover:border-brand hover:text-brand"
                >
                  {c.fa}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
