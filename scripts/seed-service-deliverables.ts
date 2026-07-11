/**
 * پر کردن فیلد deliverables برای همهٔ سرویس‌های فعال
 * npx tsx scripts/seed-service-deliverables.ts
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { eq } from 'drizzle-orm'
import { db, service } from '@/lib/db'
import { DELIVERABLES_BY_SLUG } from '@/lib/service-deliverables-seed-data'

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadEnvFile()

async function main() {
  const rows = await db.select({ id: service.id, slug: service.slug }).from(service)

  let updated = 0
  let skipped = 0

  for (const row of rows) {
    const data = DELIVERABLES_BY_SLUG[row.slug]
    if (!data) {
      console.warn(`[skip] no seed for slug: ${row.slug}`)
      skipped++
      continue
    }
    await db
      .update(service)
      .set({ deliverables: data as Record<string, unknown>, updatedAt: new Date() })
      .where(eq(service.id, row.id))
    console.log(`[ok] ${row.slug}`)
    updated++
  }

  console.log(`Done. updated=${updated} skipped=${skipped}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
