/**
 * Import/upsert Service rows from an Excel file (sheet "Services").
 * Usage: npx tsx scripts/import-services-from-xlsx.ts [path-to.xlsx]
 */
import { randomUUID } from 'node:crypto'
import { and, eq, ne } from 'drizzle-orm'
import * as XLSX from 'xlsx'
import { db, pool, service as serviceTable } from '../lib/db'
import { isReservedSlug } from '../lib/reserved-slugs'
import { meetsMinServiceSeoWords, MIN_SERVICE_SEO_WORDS } from '../lib/service-seo'
import { serviceSlugConflictsWithJob } from '../lib/slug-conflicts'
import { PricingPlansSchema } from '../types/pricing'
import { buildDefaultPricingPlans } from '../lib/default-pricing-plans'

type Row = Record<string, unknown>

function cell(row: Row, key: string): string {
  const v = row[key]
  if (v == null) return ''
  return String(v).trim()
}

function parseBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  if (typeof v === 'string') {
    const s = v.toLowerCase()
    if (s === 'true' || s === '1' || s === 'yes') return true
    if (s === 'false' || s === '0' || s === 'no') return false
  }
  return fallback
}

function parseIntSafe(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === 'number' ? v : parseInt(String(v), 10)
  if (Number.isNaN(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

async function main() {
  const filePath = process.argv[2] ?? '/Users/saeed/Downloads/services-api-payload.xlsx'
  const wb = XLSX.readFile(filePath)
  if (!wb.SheetNames.includes('Services')) {
    throw new Error(`Sheet "Services" not found. Found: ${wb.SheetNames.join(', ')}`)
  }
  const rows = XLSX.utils.sheet_to_json(wb.Sheets.Services) as Row[]
  if (rows.length === 0) {
    console.log('No rows in Services sheet.')
    return
  }

  const keySeo = 'seoBody (Persian, 800+ words)'
  const keyPlans = 'pricingPlans (JSON)'

  for (const row of rows) {
    const slug = cell(row, 'slug')
    const fa = cell(row, 'fa')
    const seoBody = cell(row, keySeo)
    const metaTitle = cell(row, 'metaTitle') || null
    const metaDescription = cell(row, 'metaDescription') || null
    const excelCodeRaw = cell(row, 'excelCode')
    const excelCode = excelCodeRaw || null
    const priceTier = parseIntSafe(row.priceTier, 2, 1, 3)
    const active = parseBool(row.active, true)
    const sortOrder = parseIntSafe(row.sortOrder, 0, -99999, 99999)

    if (!slug || !fa) {
      console.error('Skip row: missing slug or fa', { slug, fa })
      continue
    }

    if (isReservedSlug(slug)) {
      throw new Error(`Reserved slug: ${slug}`)
    }
    if (await serviceSlugConflictsWithJob(slug)) {
      throw new Error(`Slug "${slug}" is already used by a Job`)
    }
    if (!meetsMinServiceSeoWords(seoBody)) {
      throw new Error(
        `Service "${slug}": seoBody must be at least ${MIN_SERVICE_SEO_WORDS} words (got: ${seoBody.split(/\s+/).filter(Boolean).length})`
      )
    }

    const plansRaw = row[keyPlans]
    let plansJson: object
    if (typeof plansRaw === 'string' && plansRaw.trim()) {
      const parsed = JSON.parse(plansRaw) as unknown
      const v = PricingPlansSchema.safeParse(parsed)
      if (!v.success) {
        throw new Error(`Service "${slug}": invalid pricingPlans JSON: ${v.error.message}`)
      }
      plansJson = v.data
    } else {
      plansJson = buildDefaultPricingPlans(priceTier)
    }

    if (excelCode) {
      const other = await db
        .select()
        .from(serviceTable)
        .where(and(eq(serviceTable.excelCode, excelCode), ne(serviceTable.slug, slug)))
        .limit(1)
      if (other[0]) {
        throw new Error(`excelCode ${excelCode} already used by service ${other[0].slug}`)
      }
    }

    const now = new Date()
    const data = {
      fa,
      seoBody,
      metaTitle,
      metaDescription,
      pricingPlans: plansJson,
      excelCode,
      priceTier,
      active,
      sortOrder,
      updatedAt: now,
    }

    const existing = await db.select().from(serviceTable).where(eq(serviceTable.slug, slug)).limit(1)
    if (existing[0]) {
      await db.update(serviceTable).set(data).where(eq(serviceTable.slug, slug))
      console.log(`Updated service: ${slug}`)
    } else {
      await db.insert(serviceTable).values({
        id: randomUUID(),
        slug,
        ...data,
        createdAt: now,
      })
      console.log(`Created service: ${slug}`)
    }
  }

  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
