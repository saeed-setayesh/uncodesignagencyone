/**
 * تولید محتوای AI برای ترکیب سرویس × صنف × شهر (سطح شهر، بدون محله).
 * نیاز: ANTHROPIC_API_KEY و DATABASE_URL
 *
 * اجرا: npx tsx scripts/generate-content.ts
 */
import { asc, eq } from 'drizzle-orm'
import { city, db, industry, pool, service as serviceTable } from '../lib/db'
import { generateContentWithAI, getPageContent, savePageContent } from '../lib/content'
import { whereIndustryOffersService } from '../lib/industry-service-queries'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '../lib/neighborhood'

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set')
    process.exit(1)
  }

  const services = await db
    .select()
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder))
  const cities = await db.select().from(city).where(eq(city.active, true))

  let created = 0
  let skipped = 0
  let errors = 0

  for (const serviceRow of services) {
    const industries = await db
      .select()
      .from(industry)
      .where(whereIndustryOffersService(serviceRow.slug))

    for (const ind of industries) {
      for (const c of cities) {
        const key = `${serviceRow.slug}/${ind.slug}/${c.slug}`
        try {
          const existing = await getPageContent(
            ind.slug,
            c.slug,
            serviceRow.slug,
            CITY_LEVEL_NEIGHBORHOOD_KEY
          )
          if (existing) {
            skipped++
            continue
          }
          const content = await generateContentWithAI(ind.slug, c.slug, serviceRow.slug)
          await savePageContent(ind.id, c.id, serviceRow.slug, content, CITY_LEVEL_NEIGHBORHOOD_KEY)
          created++
          console.log(`✓ ${key}`)
        } catch (e) {
          errors++
          console.error(`✗ ${key}`, (e as Error).message)
        }
      }
    }
  }

  console.log(`\nDone. Created: ${created}, skipped (existing): ${skipped}, errors: ${errors}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
