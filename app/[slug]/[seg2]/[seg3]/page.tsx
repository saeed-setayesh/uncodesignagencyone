import { notFound } from 'next/navigation'
import ServiceLandingPage, { generateServiceMetadata } from '@/components/ServiceLandingPage'
import { isReservedSlug } from '@/lib/reserved-slugs'
import { and, eq } from 'drizzle-orm'
import { db, service as serviceT } from '@/lib/db'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; seg2: string; seg3: string }>
}): Promise<Metadata> {
  const { slug, seg2, seg3 } = await params
  if (isReservedSlug(slug)) return {}

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, slug), eq(serviceT.active, true)))
    .limit(1)
  if (!svc) return {}

  return generateServiceMetadata(seg2, seg3, slug)
}

export default async function DynamicThreeSegmentPage({
  params,
}: {
  params: Promise<{ slug: string; seg2: string; seg3: string }>
}) {
  const { slug, seg2, seg3 } = await params
  if (isReservedSlug(slug)) notFound()

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, slug), eq(serviceT.active, true)))
    .limit(1)
  if (!svc) notFound()

  return <ServiceLandingPage industry={seg2} city={seg3} service={slug} />
}
