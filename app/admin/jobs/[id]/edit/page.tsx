import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db, job } from '@/lib/db'
import JobAdminForm from '../../JobAdminForm'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await db.select().from(job).where(eq(job.id, id)).limit(1)
  const row = rows[0]
  if (!row) notFound()

  return (
    <JobAdminForm
      initial={{
        id: row.id,
        slug: row.slug,
        fa: row.fa,
        seoBody: row.seoBody,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        pricingPlans: row.pricingPlans,
        active: row.active,
        sortOrder: row.sortOrder,
      }}
    />
  )
}
