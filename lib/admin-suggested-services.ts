import { eq } from 'drizzle-orm'
import { db, service } from '@/lib/db'

/** فقط اسلاگ سرویس‌های فعال در دیتابیس نگه داشته می‌شود. */
export async function normalizeSuggestedServiceSlugs(raw: unknown): Promise<string[]> {
  if (!Array.isArray(raw)) return []
  const active = await db.select({ slug: service.slug }).from(service).where(eq(service.active, true))
  const allowed = new Set(active.map((s) => s.slug))
  const out: string[] = []
  for (const x of raw) {
    if (typeof x === 'string' && allowed.has(x) && !out.includes(x)) out.push(x)
  }
  return out
}
