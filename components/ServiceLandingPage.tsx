import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { city as cityT, db, industry as industryT, neighborhood as neighborhoodT, service as serviceT } from '@/lib/db'
import { getPageContentWithNationalFallback, NATIONAL_HUB_CITY_SLUG } from '@/lib/content'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'
import { buildMetadata } from '@/lib/seo'
import { parseServicePricingPlans } from '@/lib/parse-pricing-plans'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/page-sections/HeroSection'
import StatsBar from '@/components/page-sections/StatsBar'
import BenefitsSection from '@/components/page-sections/BenefitsSection'
import PricingSection from '@/components/page-sections/PricingSection'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import FaqSection from '@/components/page-sections/FaqSection'
import ProcessSection from '@/components/page-sections/ProcessSection'
import BottomCta from '@/components/page-sections/BottomCta'
import PortfolioShowcaseSection from '@/components/portfolio/PortfolioShowcaseSection'
import WhatWeDoSection from '@/components/page-sections/WhatWeDoSection'
import PayAfterPreviewSection from '@/components/page-sections/PayAfterPreviewSection'
import { resolveServiceDeliverables } from '@/lib/service-deliverables-fallback'
import IndustryHubCityNav from '@/components/IndustryHubCityNav'
import BlogMarkdown from '@/components/blog/BlogMarkdown'
import { SITE_URGENCY_BAR } from '@/lib/site-urgency'
import { getSiteOrigin } from '@/lib/site-url'
import type { Metadata } from 'next'
import type { PageContent } from '@/types/content'

interface Props {
  industry: string
  city: string
  service: string
  /** National marketing hub at /[service]/[industry] */
  pageMode?: 'city' | 'national'
  /** اسلاگ محله داخل شهر؛ اگر نباشد صفحهٔ سطح شهر است */
  neighborhoodSlug?: string
}

function isNationalPage(city: string, pageMode?: 'city' | 'national'): boolean {
  return pageMode === 'national' || city === NATIONAL_HUB_CITY_SLUG
}

export async function generateServiceMetadata(
  industry: string,
  city: string,
  service: string,
  metaOptions?: { pageMode?: 'city' | 'national'; neighborhoodSlug?: string }
): Promise<Metadata> {
  const nationalHub = isNationalPage(city, metaOptions?.pageMode)
  const nKey =
    metaOptions?.neighborhoodSlug && metaOptions.neighborhoodSlug !== CITY_LEVEL_NEIGHBORHOOD_KEY
      ? metaOptions.neighborhoodSlug
      : CITY_LEVEL_NEIGHBORHOOD_KEY

  const [ind] = await db
    .select()
    .from(industryT)
    .where(and(eq(industryT.slug, industry), eq(industryT.active, true)))
    .limit(1)
  const [cit] = await db
    .select()
    .from(cityT)
    .where(and(eq(cityT.slug, city), eq(cityT.active, true)))
    .limit(1)
  if (!ind || !cit) return {}

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, service), eq(serviceT.active, true)))
    .limit(1)
  const serviceFa = svc?.fa ?? service

  const content = await getPageContentWithNationalFallback(industry, city, service, nKey)
  if (!content) {
    if (nationalHub) {
      return {
        title: `${serviceFa} ${ind.fa} | سراسر ایران`,
        description: `خدمات ${serviceFa} حرفه‌ای برای ${ind.fa} در سراسر ایران — مشاوره، قیمت شفاف و تحویل سریع.`,
      }
    }
    return {
      title: `${serviceFa} ${ind.fa} در ${cit.fa}`,
      description: `خدمات ${serviceFa} حرفه‌ای برای ${ind.fa} در ${cit.fa}.`,
    }
  }
  return buildMetadata(content, {
    industry,
    city,
    service,
    nationalHub,
    neighborhood: metaOptions?.neighborhoodSlug,
  })
}

export default async function ServiceLandingPage({
  industry,
  city,
  service,
  pageMode,
  neighborhoodSlug,
}: Props) {
  const nationalHub = isNationalPage(city, pageMode)
  const neighborhoodKey =
    neighborhoodSlug && neighborhoodSlug !== CITY_LEVEL_NEIGHBORHOOD_KEY
      ? neighborhoodSlug
      : CITY_LEVEL_NEIGHBORHOOD_KEY

  const [ind, cit, svcRow] = await Promise.all([
    db
      .select()
      .from(industryT)
      .where(and(eq(industryT.slug, industry), eq(industryT.active, true)))
      .limit(1)
      .then((r) => r[0] ?? null),
    db
      .select()
      .from(cityT)
      .where(and(eq(cityT.slug, city), eq(cityT.active, true)))
      .limit(1)
      .then((r) => r[0] ?? null),
    db
      .select()
      .from(serviceT)
      .where(and(eq(serviceT.slug, service), eq(serviceT.active, true)))
      .limit(1)
      .then((r) => r[0] ?? null),
  ])

  if (!ind || !cit || !svcRow) notFound()

  let neighborhood = null
  if (neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) {
    const [n] = await db
      .select()
      .from(neighborhoodT)
      .where(
        and(
          eq(neighborhoodT.cityId, cit.id),
          eq(neighborhoodT.slug, neighborhoodKey),
          eq(neighborhoodT.active, true)
        )
      )
      .limit(1)
    neighborhood = n ?? null
    if (!neighborhood) notFound()
  }

  const content = await getPageContentWithNationalFallback(industry, city, service, neighborhoodKey)
  if (!content) notFound()

  const pageContent: PageContent = { ...content, urgencyText: SITE_URGENCY_BAR }

  const serviceFa = svcRow.fa
  const plans = parseServicePricingPlans(svcRow.pricingPlans, svcRow.priceTier)
  const deliverables = resolveServiceDeliverables(service, serviceFa, svcRow.deliverables)

  const siteUrl = getSiteOrigin()
  let pageUrl: string
  if (nationalHub) {
    pageUrl = `${siteUrl}/${service}/${industry}`
  } else if (neighborhood) {
    pageUrl = `${siteUrl}/${service}/${industry}/${city}/${neighborhood.slug}`
  } else {
    pageUrl = `${siteUrl}/${service}/${industry}/${city}`
  }

  const citySeoBlurb = cit.seoDescription?.trim() ?? ''
  const hoodBlurb = neighborhood?.seoDescription?.trim() ?? ''
  const localBlurb = [citySeoBlurb, hoodBlurb].filter(Boolean).join('\n\n')
  const localBusinessDescription = [content.metaDescription, localBlurb].filter(Boolean).join('\n\n')

  const localityLabel = neighborhood ? `${cit.fa}، ${neighborhood.fa}` : cit.fa

  const hasServiceBlurb = Boolean(svcRow.metaDescription?.trim() || svcRow.seoBody?.trim())

  const jsonLd = nationalHub
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: content.h1,
        description: content.metaDescription,
        url: pageUrl,
        inLanguage: 'fa-IR',
        isPartOf: { '@type': 'WebSite', url: siteUrl, name: 'آژانس دیجیتال' },
        about: {
          '@type': 'Service',
          name: `${serviceFa} برای ${ind.fa}`,
          areaServed: { '@type': 'Country', name: 'Iran' },
        },
        offers: {
          '@type': 'Offer',
          name: `${serviceFa} — ${ind.fa}`,
          description: content.metaDescription,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `${serviceFa} ${ind.fa} در ${localityLabel}`,
        description: localBusinessDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: localityLabel,
          addressRegion: cit.province,
          addressCountry: 'IR',
        },
        url: pageUrl,
        telephone: process.env.NEXT_PUBLIC_PHONE,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '140',
        },
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
        <HeroSection content={pageContent} />
        <StatsBar stats={pageContent.stats} />
        <PortfolioShowcaseSection />
        <WhatWeDoSection serviceFa={serviceFa} deliverables={deliverables} />
        <BenefitsSection benefits={pageContent.benefits} />
        <PricingSection industry={ind} serviceFa={serviceFa} plans={plans} serviceSlug={service} />
        <PayAfterPreviewSection />
        <ProcessSection
          steps={pageContent.processSteps}
          subheading="از تماس اول تا تحویل — مسیر شفاف"
          pale
        />
        <TestimonialsSection />
        <FaqSection faq={pageContent.faq} />
        {hasServiceBlurb ? (
          <section className="py-12 bg-gray-50 border-t border-gray-100" aria-label={`درباره ${serviceFa}`} dir="rtl">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">دربارهٔ {serviceFa}</h2>
              {svcRow.metaDescription?.trim() ? (
                <p className="text-gray-700 text-sm md:text-base leading-8 mb-4">{svcRow.metaDescription.trim()}</p>
              ) : null}
              {svcRow.seoBody?.trim() ? <BlogMarkdown source={svcRow.seoBody.trim()} /> : null}
            </div>
          </section>
        ) : null}
        {!nationalHub && localBlurb ? (
          <section className="py-12 bg-white border-t border-gray-100" aria-label={`شهر ${localityLabel}`}>
            <div className="max-w-3xl mx-auto px-4" dir="rtl">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                معرفی {localityLabel}
              </h2>
              <div className="text-gray-700 text-sm md:text-base leading-8 whitespace-pre-wrap">
                {localBlurb}
              </div>
            </div>
          </section>
        ) : null}
        <BottomCta heading={pageContent.ctaHeading} subtext={pageContent.ctaSubtext} />
        {nationalHub && <IndustryHubCityNav service={service} industrySlug={ind.slug} />}
      </main>
      <Footer />
    </>
  )
}
