import * as fs from 'fs'
import { randomUUID } from 'node:crypto'
import * as XLSX from 'xlsx'
import { notInArray } from 'drizzle-orm'
import { industry, type AppDb } from '@/lib/db'
import { getExcelCodeToSlugMap, parseSuggestedCodesWithMap } from './service-offerings'

const SHEET_NAME = '200 صنعت برتر'

function slugifyEnglish(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type ImportIndustriesResult = { count: number; slugs: string[] }

/** Remove industries whose slug is not in the Excel import (e.g. old seed rows). Cascades GeneratedPage. */
export async function deleteIndustriesNotInList(client: AppDb, keepSlugs: string[]): Promise<number> {
  if (keepSlugs.length === 0) return 0
  const res = await client.delete(industry).where(notInArray(industry.slug, keepSlugs))
  return res.rowCount ?? 0
}

/** Upsert all industries from the Excel workbook. Returns counts and every slug from the sheet. */
export async function importIndustriesFromXlsx(client: AppDb, filePath: string): Promise<ImportIndustriesResult> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const wb = XLSX.readFile(filePath)
  const ws = wb.Sheets[SHEET_NAME]
  if (!ws) {
    throw new Error(`Sheet "${SHEET_NAME}" not found. Available: ${wb.SheetNames.join(', ')}`)
  }

  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
    header: 1,
    defval: null,
    raw: false,
  }) as (string | number | null)[][]

  const excelMap = await getExcelCodeToSlugMap(client)

  let n = 0
  const slugs: string[] = []
  const now = new Date()
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.length < 7) continue

    const fa = String(row[1] ?? '').trim()
    const en = String(row[2] ?? '').trim()
    const category = String(row[3] ?? '').trim()
    const demandRaw = row[4]
    const competition = String(row[5] ?? '').trim()
    const codesRaw = String(row[6] ?? '').trim()

    if (!fa || !en) continue

    const slug = slugifyEnglish(en)
    if (!slug) continue

    let searchDemand: number | null = null
    if (demandRaw !== null && demandRaw !== undefined && demandRaw !== '') {
      const p = parseInt(String(demandRaw), 10)
      if (!Number.isNaN(p)) searchDemand = Math.min(3, Math.max(1, p))
    }

    const suggestedServices = parseSuggestedCodesWithMap(codesRaw, excelMap)
    const desc = `${en} — ${category || 'industry vertical'} in Iran market (web agency targeting)`

    await client
      .insert(industry)
      .values({
        id: randomUUID(),
        slug,
        fa,
        desc,
        category: category || null,
        searchDemand,
        competition: competition || null,
        suggestedCodes: codesRaw || null,
        suggestedServices,
        active: true,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: industry.slug,
        set: {
          fa,
          desc,
          category: category || null,
          searchDemand,
          competition: competition || null,
          suggestedCodes: codesRaw || null,
          suggestedServices,
          active: true,
        },
      })
    slugs.push(slug)
    n++
  }

  return { count: n, slugs }
}
