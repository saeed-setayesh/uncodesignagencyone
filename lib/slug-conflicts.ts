import { eq } from 'drizzle-orm'
import { db, service, job } from '@/lib/db'

/** برخورد اسلاگ سطح اول: سرویس و شغل نباید اسلاگ یکسان داشته باشند. */
export async function jobSlugConflictsWithService(slug: string): Promise<boolean> {
  const [s] = await db.select().from(service).where(eq(service.slug, slug)).limit(1)
  return !!s
}

export async function serviceSlugConflictsWithJob(slug: string): Promise<boolean> {
  const [j] = await db.select().from(job).where(eq(job.slug, slug)).limit(1)
  return !!j
}
