import { asc, eq } from 'drizzle-orm'
import { db, service as serviceTable } from '@/lib/db'
import EditBlogPostForm from './EditBlogPostForm'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const services = await db
    .select({ slug: serviceTable.slug, fa: serviceTable.fa })
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder))
  const serviceOptions = services.map((s) => ({ value: s.slug, label: s.fa }))
  return <EditBlogPostForm id={id} serviceOptions={serviceOptions} />
}
