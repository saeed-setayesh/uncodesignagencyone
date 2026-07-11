import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Pool } from 'pg'

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

const MIGRATION_FILES = [
  '0003_student_payment_shaba.sql',
  '0004_student_sessions_completed.sql',
  '0005_student_admin_certificate.sql',
]

async function main() {
  loadEnvFile()
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: url })
  const migrationsDir = join(process.cwd(), 'drizzle', 'migrations')

  try {
    for (const file of MIGRATION_FILES) {
      const sql = readFileSync(join(migrationsDir, file), 'utf8')
      console.log(`Applying ${file}...`)
      await pool.query(sql)
      console.log(`  ✓ ${file}`)
    }
    console.log('All student migrations applied.')
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
