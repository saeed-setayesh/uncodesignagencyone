import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { city as cityT, db, job as jobT } from '@/lib/db'
import { getJobCityPageContent } from '@/lib/content'
import { buildJobCityFallbackContent } from '@/lib/job-page-fallback'
import { parseJobPricingPlans } from '@/lib/parse-job-pricing-plans'
import { SITE_URGENCY_BAR } from '@/lib/site-urgency'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/page-sections/HeroSection'
import StatsBar from '@/components/page-sections/StatsBar'
import BenefitsSection from '@/components/page-sections/BenefitsSection'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import FaqSection from '@/components/page-sections/FaqSection'
import BottomCta from '@/components/page-sections/BottomCta'
import JobPricingSection from '@/components/JobPricingSection'
import ProcessSection from '@/components/page-sections/ProcessSection'
import type { Metadata } from 'next'
import type { PageContent } from '@/types/content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'

interface Props {
  jobSlug: string
  citySlug: string
}

export async function generateJobCityMetadata(jobSlug: string, citySlug: string): Promise<Metadata> {
  const [job] = await db
    .select()
    .from(jobT)
    .where(and(eq(jobT.slug, jobSlug), eq(jobT.active, true)))
    .limit(1)
  const [city] = await db
    .select()
    .from(cityT)
    .where(and(eq(cityT.slug, citySlug), eq(cityT.active, true)))
    .limit(1)
  if (!job || !city) return {}

  let content = await getJobCityPageContent(jobSlug, citySlug)
  if (!content) content = buildJobCityFallbackContent(job.fa, city.fa)

  const url = `${SITE_URL}/${jobSlug}/${citySlug}`
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

export default async function JobCityLandingPage({ jobSlug, citySlug }: Props) {
  const [job] = await db
    .select()
    .from(jobT)
    .where(and(eq(jobT.slug, jobSlug), eq(jobT.active, true)))
    .limit(1)
  const [city] = await db
    .select()
    .from(cityT)
    .where(and(eq(cityT.slug, citySlug), eq(cityT.active, true)))
    .limit(1)
  if (!job || !city) notFound()

  let content: PageContent | null = await getJobCityPageContent(jobSlug, citySlug)
  if (!content) content = buildJobCityFallbackContent(job.fa, city.fa)

  const pageContent: PageContent = { ...content, urgencyText: SITE_URGENCY_BAR }
  const plans = parseJobPricingPlans(job.pricingPlans)

  const pageUrl = `${SITE_URL}/${jobSlug}/${citySlug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.h1,
    description: content.metaDescription,
    url: pageUrl,
    inLanguage: 'fa-IR',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <HeroSection content={pageContent} />
        <StatsBar stats={pageContent.stats} />
        <BenefitsSection benefits={pageContent.benefits} />
        <JobPricingSection jobFa={job.fa} jobSlug={jobSlug} plans={plans} />
        <ProcessSection
          steps={pageContent.processSteps}
          subheading="مراحل همکاری در این موقعیت"
          pale
        />
        <TestimonialsSection />
        <FaqSection faq={pageContent.faq} />
        <BottomCta heading={pageContent.ctaHeading} subtext={pageContent.ctaSubtext} />
      </main>
      <Footer />
    </>
  )
}
