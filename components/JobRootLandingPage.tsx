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
import PortfolioShowcaseSection from '@/components/portfolio/PortfolioShowcaseSection'
import PriceCalculatorPromoSection from '@/components/page-sections/PriceCalculatorPromoSection'
import ExpandableLinkGrid from '@/components/ExpandableLinkGrid'
import type { Metadata } from 'next'

import { getSiteOrigin } from '@/lib/site-url'

const SITE_URL = getSiteOrigin()

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
  const title = j.metaTitle?.trim() || `${j.fa} — همکاری از تیم ما`
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
        <PortfolioShowcaseSection />
        <BenefitsSection
          benefits={sales.benefits}
          title={`چرا برای ${job.fa} با ما تماس بگیرید؟`}
          subheading="برای کسب‌وکارهایی که می‌خواهند این تخصص را از تیم ما روی پروژهٔ خود داشته باشند"
        />
        <PriceCalculatorPromoSection />
        {/* تعرفه‌های نقشی موقتاً غیرفعال — برآورد قیمت بالا کار را می‌کند.
        <JobPricingSection jobFa={job.fa} jobSlug={jobSlug} plans={plans} /> */}
        <ProcessSection
          steps={sales.processSteps}
          subheading="از تماس شما تا شروع همکاری روی پروژه"
          pale
        />
        <TestimonialsSection />
        <FaqSection faq={sales.faq} />
        <BottomCta heading={sales.ctaHeading} subtext={sales.ctaSubtext} />
        {otherJobs.length > 0 && (
          <section className="py-12 bg-slate-50/60 border-t border-slate-100" aria-label="سایر تخصص‌ها">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">سایر تخصص‌ها از تیم ما</h2>
              <p className="text-center text-slate-500 text-sm mb-6">
                به نقش دیگری هم نیاز دارید؟ صفحهٔ همان تخصص را باز کنید و تماس بگیرید.
              </p>
              <ExpandableLinkGrid
                items={otherJobs.map((j) => ({
                  id: j.id,
                  href: `/${j.slug}`,
                  label: j.fa,
                }))}
                gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-2"
                linkClassName="block text-center py-3 px-3 rounded-xl border border-slate-200/90 bg-white text-sm text-slate-800 hover:border-brand hover:text-brand transition-colors"
                collapsedMaxHeightClass="max-h-[220px]"
                fadeGradientClass="bg-gradient-to-t from-slate-50 to-transparent"
                minItemsToCollapse={7}
              />
              <p className="text-center mt-6">
                <Link href="/careers" className="text-brand text-sm font-medium hover:underline">
                  فهرست همهٔ تخصص‌ها ←
                </Link>
              </p>
            </div>
          </section>
        )}
        <section id="city-jobs" className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">همکاری در شهرهای مختلف</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              همین تخصص را برای هماهنگی محلی یا ذکر شهر در درخواست انتخاب کنید؛ روی شهر خود کلیک کنید.
            </p>
            <ExpandableLinkGrid
              items={cities.map((c) => ({
                id: c.id,
                href: `/${jobSlug}/${c.slug}`,
                label: c.fa,
              }))}
              gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
              linkClassName="block text-center py-2.5 px-2 rounded-lg border border-gray-200 bg-white text-sm hover:border-brand hover:text-brand"
              collapsedMaxHeightClass="max-h-[280px]"
              fadeGradientClass="bg-gradient-to-t from-white to-transparent"
              minItemsToCollapse={9}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
