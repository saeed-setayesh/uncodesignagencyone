import { notFound } from 'next/navigation'
import LearningLandingPage, { generateLearningMetadata } from '@/components/LearningLandingPage'
import { and, eq } from 'drizzle-orm'
import { db, job as jobT } from '@/lib/db'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return generateLearningMetadata(slug)
}

export default async function LearnTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [row] = await db
    .select({ id: jobT.id })
    .from(jobT)
    .where(and(eq(jobT.slug, slug), eq(jobT.active, true)))
    .limit(1)
  if (!row) notFound()
  return <LearningLandingPage jobSlug={slug} />
}
