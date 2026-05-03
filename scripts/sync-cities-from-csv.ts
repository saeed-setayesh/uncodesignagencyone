import { db, pool } from '../lib/db'
import { syncCitiesFromCsv } from '../lib/cities-csv-sync'

async function main() {
  const path = `${process.cwd()}/cites.csv`
  const n = await syncCitiesFromCsv(db, path)
  console.log(`Synced ${n} cities from cites.csv`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
