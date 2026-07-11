import SoftwareLandingPage, { generateSoftwareMetadata } from '@/components/SoftwareLandingPage'
import { and, eq } from 'drizzle-orm'
import { db, service } from '@/lib/db'
import { softwareDbSlug } from '@/lib/software-products'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return generateSoftwareMetadata(slug)
}

export default async function SoftwareProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dbSlug = softwareDbSlug(slug)
  const [row] = await db
    .select({ id: service.id })
    .from(service)
    .where(and(eq(service.slug, dbSlug), eq(service.active, true)))
    .limit(1)
  if (!row) notFound()
  return <SoftwareLandingPage productSlug={slug} />
}
