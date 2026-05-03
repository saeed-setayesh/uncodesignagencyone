import { getServerSession } from 'next-auth'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { city, db, industry, service as serviceTable } from '@/lib/db'
import { generateContentWithAI, getPageContent, savePageContent } from '@/lib/content'
import { whereIndustryOffersService } from '@/lib/industry-service-queries'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'

/** حداکثر تعداد صفحات تولیدشده در یک درخواست (برای جلوگیری از تایم‌اوت). */
const MAX_CREATE_PER_REQUEST = 15

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 })
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
  let budget = MAX_CREATE_PER_REQUEST

  outer: for (const serviceRow of services) {
    const industries = await db
      .select()
      .from(industry)
      .where(whereIndustryOffersService(serviceRow.slug))
    for (const ind of industries) {
      for (const c of cities) {
        if (budget <= 0) break outer
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
          budget--
        } catch (e) {
          errors++
          console.error(`generate batch: ${serviceRow.slug}/${ind.slug}/${c.slug}`, e)
        }
      }
    }
  }

  return NextResponse.json({
    created,
    skipped,
    errors,
    cappedAt: MAX_CREATE_PER_REQUEST,
    note: 'برای تولید انبوه از اسکریپت scripts/generate-content.ts استفاده کنید',
  })
}
