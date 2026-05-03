import { asc, eq } from 'drizzle-orm'
import { db, service as serviceTable } from '@/lib/db'
import NewBlogPostForm from './NewBlogPostForm'

export default async function NewBlogPostPage() {
  const services = await db
    .select({ slug: serviceTable.slug, fa: serviceTable.fa })
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder))
  const serviceOptions = services.map((s) => ({ value: s.slug, label: s.fa }))
  return <NewBlogPostForm serviceOptions={serviceOptions} />
}
