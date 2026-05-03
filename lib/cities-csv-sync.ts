import * as fs from 'fs'
import { randomUUID } from 'node:crypto'
import { eq, notInArray } from 'drizzle-orm'
import { type AppDb, city } from '@/lib/db'

/** باید با `NATIONAL_HUB_CITY_SLUG` در `lib/content.ts` یکی باشد. */
const NATIONAL_HUB_SLUG = 'iran'

/** همیشه نگه داشته می‌شود؛ در همگام‌سازی CSV حذف نمی‌شود. */
export const RESERVED_SEED_CITIES: { slug: string; fa: string; province: string }[] = [
  { slug: NATIONAL_HUB_SLUG, fa: 'سراسر ایران', province: 'Iran' },
]

function slugifyEnglishCityName(name: string): string {
  const base = name
    .replace(/\([^)]*\)/g, '')
    .trim()
    .toLowerCase()
  return base
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

function parseCsvLine(line: string): [string, string, string] | null {
  const parts = line.split(',').map((p) => p.trim())
  if (parts.length < 3) return null
  const province = parts.slice(2).join(',').trim()
  const english = parts[0]!
  const persian = parts[1]!
  return [english, persian, province]
}

export function parseCitiesFromCsv(csvPath: string): { slug: string; fa: string; province: string }[] {
  const raw = fs.readFileSync(csvPath, 'utf-8')
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) return []

  const out: { slug: string; fa: string; province: string }[] = []
  const seen = new Set<string>()

  for (let i = 1; i < lines.length; i++) {
    const parsed = parseCsvLine(lines[i]!)
    if (!parsed) continue
    const [english, persian, province] = parsed
    if (!english || !persian || persian === '-' || !province || province === '-') continue
    if (/already listed/i.test(english)) continue

    const slug = slugifyEnglishCityName(english)
    if (!slug) continue
    if (slug === NATIONAL_HUB_SLUG) continue
    if (seen.has(slug)) continue
    seen.add(slug)

    out.push({ slug, fa: persian, province })
  }

  return out
}

/**
 * شهرهایی که در CSV نیستند حذف می‌شوند (کسکید صفحات تولیدشده).
 * ردیف‌های رزرو (مثل iran) حفظ می‌شوند. فیلد seoDescription در به‌روزرسانی دست نمی‌خورد.
 */
export async function syncCitiesFromCsv(client: AppDb, csvPath: string): Promise<number> {
  const fromFile = parseCitiesFromCsv(csvPath)
  const all = [...RESERVED_SEED_CITIES, ...fromFile]
  const targetSlugs = all.map((c) => c.slug)
  const unique = new Set(targetSlugs)
  if (unique.size !== targetSlugs.length) {
    throw new Error('Duplicate city slugs after parsing CSV')
  }

  await client.delete(city).where(notInArray(city.slug, targetSlugs))

  const now = new Date()
  for (const row of all) {
    await client
      .insert(city)
      .values({
        id: randomUUID(),
        slug: row.slug,
        fa: row.fa,
        province: row.province,
        active: true,
        createdAt: now,
        seoDescription: '',
      })
      .onConflictDoUpdate({
        target: city.slug,
        set: { fa: row.fa, province: row.province },
      })
  }

  return all.length
}
