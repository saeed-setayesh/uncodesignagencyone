import { asc, eq } from 'drizzle-orm'
import { db, job, service } from '@/lib/db'
import NavbarClient from '@/components/layout/NavbarClient'

export default async function Navbar() {
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'

  const [services, jobs] = await Promise.all([
    db
      .select({ slug: service.slug, fa: service.fa })
      .from(service)
      .where(eq(service.active, true))
      .orderBy(asc(service.sortOrder)),
    db
      .select({ slug: job.slug, fa: job.fa })
      .from(job)
      .where(eq(job.active, true))
      .orderBy(asc(job.sortOrder), asc(job.fa)),
  ])

  return <NavbarClient services={services} jobs={jobs} phone={phone} />
}
