import * as fs from 'fs'
import { randomUUID } from 'node:crypto'
import * as XLSX from 'xlsx'
import { notInArray } from 'drizzle-orm'
import { type AppDb, job, service } from '@/lib/db'
import { isReservedSlug } from '@/lib/reserved-slugs'
import { buildJobSeoBodyMarkdown, type JobSeoRowInput } from '@/lib/jobs-seo-body'

const MAIN_SHEET = 'Tech Jobs Keywords'
const SHEET_30 = '30 صفحه پولساز'

function slugifyEnglish(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function headerRowToMap(headers: (string | number | null | undefined)[]): string[] {
  return headers.map((h) => String(h ?? '').trim())
}

function getCell(
  row: (string | number | null | undefined)[] | undefined,
  colIndex: number
): string {
  if (!row) return ''
  return String(row[colIndex] ?? '').trim()
}

function parsePriority(raw: string, fallback: number): number {
  if (!raw) return fallback
  const p = parseInt(String(raw).replace(/[^\d-]/g, ''), 10)
  if (Number.isNaN(p)) return fallback
  return p
}

function listSlugCandidates(base: string): string[] {
  const out: string[] = [base, `${base}-job`]
  for (let i = 2; i < 500; i++) {
    out.push(`${base}-${i}`)
  }
  return out
}

function extractSlugFromUrlPath(urlCell: string): string | null {
  const t = String(urlCell ?? '').trim()
  if (!t) return null
  const m = t.match(/\/jobs\/([a-z0-9-]+)/i)
  if (m?.[1]) return m[1].toLowerCase()
  return null
}

export type JobImportResult = { count: number; slugs: string[]; warnings: string[] }

/** حذف شغل‌هایی که در ایمپورت جدید نیستند. */
export async function deleteJobsNotInList(client: AppDb, keepSlugs: string[]): Promise<number> {
  if (keepSlugs.length === 0) return 0
  const res = await client.delete(job).where(notInArray(job.slug, keepSlugs))
  return res.rowCount ?? 0
}

type RowData = {
  fa: string
  en: string
  category: string
  searchVolume: string
  competition: string
  longTail: string
  /** «توضیح SEO (متا دیسکریپشن)» از اکسل */
  metaDescription: string
  /** اگر در اکسل ستون «عنوان متا» / Meta Title اضافه شود */
  metaTitleFromSheet: string
  priority: number
  extraFrom30?: string
}

function rowArrayToData(
  headers: string[],
  row: (string | number | null | undefined)[],
  rowIndex: number
): RowData | null {
  const idx = (name: string) => headers.findIndex((h) => h === name)
  const faI = idx('عنوان شغلی (فارسی)')
  const enI = idx('Job Title (English)')
  if (faI < 0 || enI < 0) {
    return null
  }
  const fa = getCell(row, faI)
  const en = getCell(row, enI)
  if (!fa || !en) return null

  const catI = idx('دسته‌بندی')
  const volI = idx('حجم جستجو (تخمینی)')
  const compI = idx('رقابت')
  const longI = idx('نمونه long-tail keywords')
  const metaI = idx('توضیح SEO (متا دیسکریپشن)')
  const priI = idx('اولویت')
  const titleMetaI = ['عنوان متا', 'Meta Title', 'Title (SEO)', 'meta title', 'متا تایتل'].map((c) => idx(c)).find((i) => i >= 0) ?? -1
  const metaTitleFromSheet = titleMetaI >= 0 ? getCell(row, titleMetaI) : ''

  return {
    fa,
    en,
    category: catI >= 0 ? getCell(row, catI) : '',
    searchVolume: volI >= 0 ? getCell(row, volI) : '',
    competition: compI >= 0 ? getCell(row, compI) : '',
    longTail: longI >= 0 ? getCell(row, longI) : '',
    metaDescription: metaI >= 0 ? getCell(row, metaI) : '',
    metaTitleFromSheet,
    priority: parsePriority(priI >= 0 ? getCell(row, priI) : '', 1000 + rowIndex),
  }
}

function makeUniqueJobSlug(
  serviceSlugs: Set<string>,
  base: string,
  used: Set<string>
): string {
  for (const c of listSlugCandidates(base)) {
    if (used.has(c)) continue
    if (isReservedSlug(c) || serviceSlugs.has(c)) continue
    used.add(c)
    return c
  }
  throw new Error(`Could not allocate a unique job slug for base: ${base}`)
}

function buildSeoInput(data: RowData): JobSeoRowInput {
  return {
    fa: data.fa,
    en: data.en,
    category: data.category,
    longTail: data.longTail,
    metaDescription: data.metaDescription,
    competition: data.competition,
    searchVolume: data.searchVolume,
    extraNote: data.extraFrom30,
  }
}

type Options = { merge30Sheet: boolean }

/**
 * «۳۰ صفحه پولساز» — ستون «چرا اولویت دارد» به ردیف اصلی فقط وقتی اسلاگ با عنوان انگلیسی یکی است ادغام می‌شود.
 */
function readSheet30(
  filePath: string
): { bySlug: Map<string, { keyword: string; why: string; slug: string }> } {
  const wb = XLSX.readFile(filePath)
  const ws = wb.Sheets[SHEET_30]
  if (!ws) {
    return { bySlug: new Map() }
  }
  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
    header: 1,
    defval: null,
    raw: false,
  }) as (string | number | null)[][]
  if (rows.length < 2) {
    return { bySlug: new Map() }
  }
  const headers = headerRowToMap(rows[0] as (string | number | null)[])
  const urlI = headers.findIndex((h) => h === 'URL پیشنهادی' || h.includes('URL'))
  const kwI = headers.findIndex((h) => h === 'کلمه کلیدی اصلی' || h.includes('کلیدی'))
  const whyI = headers.findIndex((h) => h.includes('چرا') && h.includes('اولویت'))

  const bySlug = new Map<string, { keyword: string; why: string; slug: string }>()
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as (string | number | null)[] | undefined
    if (!row) continue
    const urlCell = urlI >= 0 ? getCell(row, urlI) : ''
    const slug = extractSlugFromUrlPath(urlCell)
    if (!slug) continue
    const keyword = kwI >= 0 ? getCell(row, kwI) : ''
    const why = whyI >= 0 ? getCell(row, whyI) : ''
    bySlug.set(slug, { keyword, why, slug })
  }
  return { bySlug }
}

export async function importJobsFromXlsx(
  client: AppDb,
  filePath: string,
  options: Options = { merge30Sheet: true }
): Promise<JobImportResult> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const serviceSlugs = new Set(
    (await client.select({ slug: service.slug }).from(service)).map((s) => s.slug)
  )

  const sheet30 = options.merge30Sheet ? readSheet30(filePath) : { bySlug: new Map() }

  const wb = XLSX.readFile(filePath)
  const ws = wb.Sheets[MAIN_SHEET]
  if (!ws) {
    throw new Error(`Sheet "${MAIN_SHEET}" not found. Available: ${wb.SheetNames.join(', ')}`)
  }

  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
    header: 1,
    defval: null,
    raw: false,
  }) as (string | number | null)[][]

  if (rows.length < 2) {
    return { count: 0, slugs: [], warnings: ['No data rows in main sheet.'] }
  }

  const headers = headerRowToMap(rows[0] as (string | number | null)[])

  const usedSlugs = new Set<string>()
  const toUpsert: { slug: string; data: RowData }[] = []
  const warnings: string[] = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as (string | number | null)[] | undefined
    const d = rowArrayToData(headers, row ?? [], i)
    if (!d) continue

    let baseSlug = slugifyEnglish(d.en)
    if (!baseSlug) {
      baseSlug = slugifyEnglish(d.fa) || `job-${i}`
    }

    const s30 = sheet30.bySlug.get(baseSlug)
    if (s30?.why) {
      d.extraFrom30 = s30.why
    }

    const slug = makeUniqueJobSlug(serviceSlugs, baseSlug, usedSlugs)
    if (slug !== baseSlug) {
      warnings.push(`Slug: "${baseSlug}" → "${slug}" (row ${i + 1}, ${d.fa})`)
    }
    toUpsert.push({ slug, data: d })
  }

  const slugs: string[] = []
  const now = new Date()
  for (const { slug, data } of toUpsert) {
    const seoBody = buildJobSeoBodyMarkdown(buildSeoInput(data))
    const metaTitle =
      data.metaTitleFromSheet?.trim() ||
      `${data.fa} — استخدام و فرصت شغلی`
    const metaDescription = data.metaDescription || undefined

    await client
      .insert(job)
      .values({
        id: randomUUID(),
        slug,
        fa: data.fa,
        seoBody,
        metaTitle,
        metaDescription: metaDescription ?? data.fa,
        sortOrder: data.priority,
        active: true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: job.slug,
        set: {
          fa: data.fa,
          seoBody,
          metaTitle,
          metaDescription: metaDescription ?? data.fa,
          sortOrder: data.priority,
          active: true,
          updatedAt: new Date(),
        },
      })
    slugs.push(slug)
  }

  return { count: slugs.length, slugs, warnings }
}
