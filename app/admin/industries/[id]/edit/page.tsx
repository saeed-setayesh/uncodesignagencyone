import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db, industry, service as serviceTable } from '@/lib/db'
import IndustryForm from '../../IndustryForm'

export default async function EditIndustryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [indRows, services] = await Promise.all([
    db.select().from(industry).where(eq(industry.id, id)).limit(1),
    db
      .select({ slug: serviceTable.slug, fa: serviceTable.fa })
      .from(serviceTable)
      .where(eq(serviceTable.active, true))
      .orderBy(asc(serviceTable.sortOrder)),
  ])
  const row = indRows[0]
  if (!row) notFound()

  return (
    <IndustryForm
      services={services}
      initial={{
        id: row.id,
        slug: row.slug,
        fa: row.fa,
        desc: row.desc,
        active: row.active,
        suggestedServices: row.suggestedServices ?? [],
      }}
    />
  )
}
