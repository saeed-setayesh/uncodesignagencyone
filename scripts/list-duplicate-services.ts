import { asc, eq } from 'drizzle-orm'
import { db, pool, service } from '../lib/db'
import { isSoftwareProduct } from '../lib/software-products'

async function main() {
  const rows = await db
    .select({
      slug: service.slug,
      fa: service.fa,
      active: service.active,
      sortOrder: service.sortOrder,
      excelCode: service.excelCode,
    })
    .from(service)
    .where(eq(service.active, true))
    .orderBy(asc(service.sortOrder), asc(service.fa))

  const core = rows.filter((r) => !isSoftwareProduct(r.slug))
  console.log('Core active services:', core.length)
  for (const r of core) console.log(`${r.sortOrder}\t${r.slug}\t${r.fa}\t${r.excelCode ?? '-'}`)

  const dupFa = new Map<string, string[]>()
  for (const r of core) {
    const k = r.fa.trim()
    if (!dupFa.has(k)) dupFa.set(k, [])
    dupFa.get(k)!.push(r.slug)
  }
  console.log('\nDuplicate FA titles:')
  for (const [fa, slugs] of dupFa) {
    if (slugs.length > 1) console.log(`  ${fa} -> ${slugs.join(', ')}`)
  }
}

main()
  .catch(console.error)
  .finally(() => pool.end())
