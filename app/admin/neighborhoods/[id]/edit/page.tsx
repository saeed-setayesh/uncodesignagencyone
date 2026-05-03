import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { city, db, neighborhood } from '@/lib/db'
import NeighborhoodForm from '../../NeighborhoodForm'

export default async function EditNeighborhoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [row, cities] = await Promise.all([
    db.select().from(neighborhood).where(eq(neighborhood.id, id)).limit(1),
    db
      .select({ id: city.id, fa: city.fa, province: city.province })
      .from(city)
      .where(eq(city.active, true))
      .orderBy(asc(city.fa)),
  ])
  const n = row[0]
  if (!n) notFound()

  return (
    <NeighborhoodForm
      cities={cities}
      initial={{
        id: n.id,
        cityId: n.cityId,
        slug: n.slug,
        fa: n.fa,
        seoDescription: n.seoDescription,
        active: n.active,
      }}
    />
  )
}
