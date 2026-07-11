/**
 * Deactivate legacy duplicate services and migrate GeneratedPage.service to canonical slugs.
 * Run: npm run db:dedupe-services
 */
import { and, eq, inArray } from 'drizzle-orm'
import { db, generatedPage, pool, service } from '../lib/db'
import {
  LEGACY_SERVICE_SLUG_REDIRECTS,
  resolveCanonicalServiceSlug,
} from '../lib/service-slug-canonical'

async function migrateGeneratedPages() {
  for (const [legacy, canonical] of Object.entries(LEGACY_SERVICE_SLUG_REDIRECTS)) {
    const legacyRows = await db.select().from(generatedPage).where(eq(generatedPage.service, legacy))
    if (legacyRows.length === 0) continue

    let updated = 0
    let removed = 0

    for (const row of legacyRows) {
      const [existing] = await db
        .select({ id: generatedPage.id })
        .from(generatedPage)
        .where(
          and(
            eq(generatedPage.service, canonical),
            eq(generatedPage.industryId, row.industryId),
            eq(generatedPage.cityId, row.cityId),
            eq(generatedPage.neighborhoodKey, row.neighborhoodKey),
            eq(generatedPage.cacheVersion, row.cacheVersion)
          )
        )
        .limit(1)

      if (existing) {
        await db.delete(generatedPage).where(eq(generatedPage.id, row.id))
        removed++
      } else {
        await db.update(generatedPage).set({ service: canonical }).where(eq(generatedPage.id, row.id))
        updated++
      }
    }

    console.log(`  ${legacy} → ${canonical}: updated ${updated}, removed ${removed} duplicate page(s)`)
  }
}

async function deactivateLegacyServices() {
  const legacySlugs = Object.keys(LEGACY_SERVICE_SLUG_REDIRECTS)
  const rows = await db
    .select({ slug: service.slug, fa: service.fa, active: service.active })
    .from(service)
    .where(inArray(service.slug, legacySlugs))

  for (const row of rows) {
    if (!row.active) {
      console.log(`  already inactive: ${row.slug} (${row.fa})`)
      continue
    }
    await db
      .update(service)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(service.slug, row.slug))
    console.log(`  deactivated: ${row.slug} (${row.fa}) → /${resolveCanonicalServiceSlug(row.slug)}`)
  }

  for (const legacy of legacySlugs) {
    if (!rows.some((r) => r.slug === legacy)) {
      console.log(`  (not in DB): ${legacy}`)
    }
  }
}

async function main() {
  console.log('Migrating GeneratedPage.service to canonical slugs...')
  await migrateGeneratedPages()

  console.log('\nDeactivating legacy duplicate services...')
  await deactivateLegacyServices()

  console.log('\n✓ Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
