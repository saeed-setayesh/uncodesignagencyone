import { asc, eq } from 'drizzle-orm'
import { db, service as serviceTable } from '@/lib/db'
import IndustryForm from '../IndustryForm'

export default async function NewIndustryPage() {
  const services = await db
    .select({ slug: serviceTable.slug, fa: serviceTable.fa })
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder))
  return <IndustryForm services={services} />
}
