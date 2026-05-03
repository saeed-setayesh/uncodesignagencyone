/**
 * Imports industries from data/200-industries-iran-web-agency.xlsx
 * Run: npx tsx scripts/import-industries-from-xlsx.ts
 */
import * as path from 'path'
import { db, pool } from '../lib/db'
import { deleteIndustriesNotInList, importIndustriesFromXlsx } from '../lib/industries-import'

const DATA_PATH = path.join(process.cwd(), 'data', '200-industries-iran-web-agency.xlsx')

async function main() {
  const { count, slugs } = await importIndustriesFromXlsx(db, DATA_PATH)
  const removed = await deleteIndustriesNotInList(db, slugs)
  console.log(`✓ Imported/updated ${count} industries; removed ${removed} rows not in Excel`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
