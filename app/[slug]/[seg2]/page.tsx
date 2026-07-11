import { notFound, redirect } from 'next/navigation'
import ServiceLandingPage, { generateServiceMetadata } from '@/components/ServiceLandingPage'
import JobCityLandingPage, { generateJobCityMetadata } from '@/components/JobCityLandingPage'
import { isReservedSlug } from '@/lib/reserved-slugs'
import { getLegacyServiceRedirect } from '@/lib/service-slug-canonical'
import { isAiLearningJob } from '@/lib/learning-jobs'
import { and, eq } from 'drizzle-orm'
import { db, job as jobT, service as serviceT } from '@/lib/db'
import { NATIONAL_HUB_CITY_SLUG } from '@/lib/content'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; seg2: string }>
}): Promise<Metadata> {
  const { slug, seg2 } = await params
  if (isReservedSlug(slug)) return {}
  const legacyRedirect = getLegacyServiceRedirect(slug, seg2)
  if (legacyRedirect) return {}

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, slug), eq(serviceT.active, true)))
    .limit(1)
  if (svc) {
    return generateServiceMetadata(seg2, NATIONAL_HUB_CITY_SLUG, slug, { pageMode: 'national' })
  }

  const [j] = await db
    .select()
    .from(jobT)
    .where(and(eq(jobT.slug, slug), eq(jobT.active, true)))
    .limit(1)
  if (j) {
    if (isAiLearningJob(slug)) redirect(`/learn/${slug}`)
    return generateJobCityMetadata(slug, seg2)
  }

  return {}
}

export default async function DynamicTwoSegmentPage({
  params,
}: {
  params: Promise<{ slug: string; seg2: string }>
}) {
  const { slug, seg2 } = await params
  if (isReservedSlug(slug)) notFound()
  const legacyRedirect = getLegacyServiceRedirect(slug, seg2)
  if (legacyRedirect) redirect(legacyRedirect)

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, slug), eq(serviceT.active, true)))
    .limit(1)
  if (svc) {
    return (
      <ServiceLandingPage
        industry={seg2}
        city={NATIONAL_HUB_CITY_SLUG}
        service={slug}
        pageMode="national"
      />
    )
  }

  const [j] = await db
    .select()
    .from(jobT)
    .where(and(eq(jobT.slug, slug), eq(jobT.active, true)))
    .limit(1)
  if (j) {
    if (isAiLearningJob(slug)) redirect(`/learn/${slug}`)
    return <JobCityLandingPage jobSlug={slug} citySlug={seg2} />
  }

  notFound()
}
