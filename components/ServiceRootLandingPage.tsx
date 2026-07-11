import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, asc, eq } from 'drizzle-orm'
import { db, industry, service } from '@/lib/db'
import { getServiceRootPageContent } from '@/lib/service-root-content'
import { SITE_URGENCY_BAR } from '@/lib/site-urgency'
import { SERVICE_ROOT_PRICING_INDUSTRY } from '@/lib/service-root-placeholder'
import { parseServicePricingPlans } from '@/lib/parse-pricing-plans'
import BlogMarkdown from '@/components/blog/BlogMarkdown'
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
import ExpandableLinkGrid from '@/components/ExpandableLinkGrid'
import PortfolioShowcaseSection from '@/components/portfolio/PortfolioShowcaseSection'
import WhatWeDoSection from '@/components/page-sections/WhatWeDoSection'
import PayAfterPreviewSection from '@/components/page-sections/PayAfterPreviewSection'
import { resolveServiceDeliverables } from '@/lib/service-deliverables-fallback'
import { getSiteOrigin } from '@/lib/site-url'

interface Props {
  serviceSlug: string
}

export default async function ServiceRootLandingPage({ serviceSlug }: Props) {
  const [row] = await db
    .select()
    .from(service)
    .where(and(eq(service.slug, serviceSlug), eq(service.active, true)))
    .limit(1)
  if (!row) notFound()

  const serviceFa = row.fa
  let content = getServiceRootPageContent(serviceSlug, serviceFa)
  content = { ...content, urgencyText: SITE_URGENCY_BAR }
  if (row.metaTitle?.trim()) content = { ...content, metaTitle: row.metaTitle.trim().slice(0, 70) }
  if (row.metaDescription?.trim()) {
    content = { ...content, metaDescription: row.metaDescription.trim().slice(0, 165) }
  }

  /** همهٔ صنف‌های فعال — مثل طراحی سایت و سئو (بدون محدودیت suggestedServices) */
  const industries = await db
    .select()
    .from(industry)
    .where(eq(industry.active, true))
    .orderBy(asc(industry.fa))

  const plans = parseServicePricingPlans(row.pricingPlans, row.priceTier)
  const deliverables = resolveServiceDeliverables(serviceSlug, serviceFa, row.deliverables)

  const siteUrl = getSiteOrigin()
  const pageUrl = `${siteUrl}/${serviceSlug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.h1,
    description: content.metaDescription,
    url: pageUrl,
    inLanguage: 'fa-IR',
    isPartOf: { '@type': 'WebSite', url: siteUrl },
    about: {
      '@type': 'Service',
      name: serviceFa,
      provider: { '@type': 'Organization', name: 'آژانس دیجیتال', url: siteUrl },
      areaServed: { '@type': 'Country', name: 'Iran' },
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
        <HeroSection content={content} />
        <StatsBar stats={content.stats} />
        <PortfolioShowcaseSection />
        <WhatWeDoSection serviceFa={serviceFa} deliverables={deliverables} />
        <BenefitsSection benefits={content.benefits} />
        <PricingSection
          industry={SERVICE_ROOT_PRICING_INDUSTRY}
          serviceFa={serviceFa}
          plans={plans}
          serviceRootPage
          serviceSlug={serviceSlug}
        />
        <PayAfterPreviewSection />
        <ProcessSection
          steps={content.processSteps}
          subheading="گام‌به‌گام و شفاف — بدون فرآیند مبهم"
          pale
        />
        <TestimonialsSection />
        <FaqSection faq={content.faq} />
        {row.seoBody?.trim() ? (
          <section className="py-14 bg-gray-50 border-t border-gray-100" dir="rtl">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">راهنمای {serviceFa}</h2>
              <BlogMarkdown source={row.seoBody.trim()} />
            </div>
          </section>
        ) : null}
        <BottomCta heading={content.ctaHeading} subtext={content.ctaSubtext} />

        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
              {serviceFa} برای صنف شما
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto text-sm md:text-base">
              صنف موردنظر را انتخاب کنید — همان الگوی سادهٔ فهرست شهرها.
            </p>
            {industries.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">
                هنوز صنفی برای این سرویس در فهرست ثبت نشده است.
              </p>
            ) : (
              <ExpandableLinkGrid
                items={industries.map((ind) => ({
                  id: ind.id,
                  href: `/${serviceSlug}/${ind.slug}`,
                  label: ind.fa,
                }))}
                gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                linkClassName="block text-center py-2.5 px-2 rounded-lg border border-gray-200 bg-white text-sm hover:border-brand hover:text-brand"
                collapsedMaxHeightClass="max-h-[280px]"
                fadeGradientClass="bg-gradient-to-t from-white to-transparent"
                minItemsToCollapse={9}
              />
            )}
            <p className="text-center mt-10">
              <Link href="/" className="text-brand text-sm hover:underline">
                ← بازگشت به خانه
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
