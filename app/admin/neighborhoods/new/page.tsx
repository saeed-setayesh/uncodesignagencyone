import { asc, eq } from 'drizzle-orm'
import { city, db } from '@/lib/db'
import NeighborhoodForm from '../NeighborhoodForm'

export default async function NewNeighborhoodPage() {
  const cities = await db
    .select({ id: city.id, fa: city.fa, province: city.province })
    .from(city)
    .where(eq(city.active, true))
    .orderBy(asc(city.fa))
  return <NeighborhoodForm cities={cities} />
}
