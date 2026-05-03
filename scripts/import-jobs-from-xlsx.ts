/**
 * Reads data/iran-tech-jobs-section.xlsx (or path from argv) — sheet «Tech Jobs Keywords».
 * Merges notes from «30 صفحه پولساز» when URL slug matches.
 * Run: npx tsx scripts/import-jobs-from-xlsx.ts
 *       npx tsx scripts/import-jobs-from-xlsx.ts /path/to/file.xlsx
 * Prune old jobs: npx tsx scripts/import-jobs-from-xlsx.ts --prune
 */
import * as path from 'path'
import { db, pool } from '../lib/db'
import { deleteJobsNotInList, importJobsFromXlsx } from '../lib/jobs-import'

const DEFAULT_DATA = path.join(process.cwd(), 'data', 'iran-tech-jobs-section.xlsx')

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--prune')
  const prune = process.argv.includes('--prune')
  const filePath = args[0] ? path.resolve(args[0]) : DEFAULT_DATA

  const { count, slugs, warnings } = await importJobsFromXlsx(db, filePath)
  if (warnings.length) {
    console.log('Remarks:')
    for (const w of warnings) console.log(`  - ${w}`)
  }
  let removed = 0
  if (prune) {
    removed = await deleteJobsNotInList(db, slugs)
  }
  console.log(
    `✓ Imported/updated ${count} jobs` +
      (prune ? `; removed ${removed} jobs not in Excel` : ' (re-run with --prune to delete jobs missing from the file)')
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
