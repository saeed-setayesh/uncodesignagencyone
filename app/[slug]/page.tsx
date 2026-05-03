import { notFound } from 'next/navigation'
import ServiceRootLandingPage from '@/components/ServiceRootLandingPage'
import JobRootLandingPage, { generateJobRootMetadata } from '@/components/JobRootLandingPage'
import { isReservedSlug } from '@/lib/reserved-slugs'
import { and, eq } from 'drizzle-orm'
import { db, job as jobT, service as serviceT } from '@/lib/db'
import { getServiceRootPageContent } from '@/lib/service-root-content'
import { buildServiceRootMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (isReservedSlug(slug)) return {}

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, slug), eq(serviceT.active, true)))
    .limit(1)
  if (svc) {
    let c = getServiceRootPageContent(slug, svc.fa)
    if (svc.metaTitle?.trim()) c = { ...c, metaTitle: svc.metaTitle.trim().slice(0, 70) }
    if (svc.metaDescription?.trim()) {
      c = { ...c, metaDescription: svc.metaDescription.trim().slice(0, 165) }
    }
    return buildServiceRootMetadata(c, slug)
  }

  const [j] = await db
    .select()
    .from(jobT)
    .where(and(eq(jobT.slug, slug), eq(jobT.active, true)))
    .limit(1)
  if (j) return generateJobRootMetadata(slug)

  return {}
}

export default async function DynamicRootPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (isReservedSlug(slug)) notFound()

  const [svc] = await db
    .select()
    .from(serviceT)
    .where(and(eq(serviceT.slug, slug), eq(serviceT.active, true)))
    .limit(1)
  if (svc) return <ServiceRootLandingPage serviceSlug={slug} />

  const [j] = await db
    .select()
    .from(jobT)
    .where(and(eq(jobT.slug, slug), eq(jobT.active, true)))
    .limit(1)
  if (j) return <JobRootLandingPage jobSlug={slug} />

  notFound()
}
