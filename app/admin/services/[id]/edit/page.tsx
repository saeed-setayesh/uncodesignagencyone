import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db, service as serviceTable } from '@/lib/db'
import ServiceAdminForm from '../../ServiceAdminForm'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await db.select().from(serviceTable).where(eq(serviceTable.id, id)).limit(1)
  const row = rows[0]
  if (!row) notFound()

  return (
    <ServiceAdminForm
      initial={{
        id: row.id,
        slug: row.slug,
        fa: row.fa,
        seoBody: row.seoBody,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        pricingPlans: row.pricingPlans,
        excelCode: row.excelCode,
        priceTier: row.priceTier,
        active: row.active,
        sortOrder: row.sortOrder,
        deliverables: row.deliverables,
      }}
    />
  )
}
