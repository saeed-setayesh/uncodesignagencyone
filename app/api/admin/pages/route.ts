import { getServerSession } from 'next-auth'
import { and, desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { savePageContent } from '@/lib/content'
import { city, db, generatedPage, industry, neighborhood as neighborhoodTable, service as serviceTable } from '@/lib/db'
import { whereIndustryOffersService } from '@/lib/industry-service-queries'
import { PageContentSchema } from '@/types/content'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db
    .select({
      id: generatedPage.id,
      service: generatedPage.service,
      neighborhoodKey: generatedPage.neighborhoodKey,
      cacheVersion: generatedPage.cacheVersion,
      createdAt: generatedPage.createdAt,
      updatedAt: generatedPage.updatedAt,
      industryFa: industry.fa,
      industrySlug: industry.slug,
      cityFa: city.fa,
      citySlug: city.slug,
    })
    .from(generatedPage)
    .innerJoin(industry, eq(generatedPage.industryId, industry.id))
    .innerJoin(city, eq(generatedPage.cityId, city.id))
    .orderBy(desc(generatedPage.updatedAt))

  const pages = rows.map((r) => ({
    id: r.id,
    service: r.service,
    neighborhoodKey: r.neighborhoodKey,
    cacheVersion: r.cacheVersion,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    industry: { fa: r.industryFa, slug: r.industrySlug },
    city: { fa: r.cityFa, slug: r.citySlug },
  }))

  return NextResponse.json({ pages })
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { industryId, cityId, service: svcName, content } = body
  const neighborhoodKey =
    typeof body.neighborhoodKey === 'string' && body.neighborhoodKey.length > 0
      ? body.neighborhoodKey
      : CITY_LEVEL_NEIGHBORHOOD_KEY

  if (!industryId || !cityId || !svcName || !content) {
    return NextResponse.json({ error: 'industryId, cityId, service and content are required' }, { status: 400 })
  }

  const parsed = PageContentSchema.safeParse(content)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid content shape', details: parsed.error.flatten() }, { status: 422 })
  }

  const svc = String(svcName)
  const [serviceRow] = await db
    .select()
    .from(serviceTable)
    .where(and(eq(serviceTable.slug, svc), eq(serviceTable.active, true)))
    .limit(1)
  if (!serviceRow) {
    return NextResponse.json({ error: 'سرویس نامعتبر یا غیرفعال است' }, { status: 400 })
  }

  if (neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) {
    const [n] = await db
      .select()
      .from(neighborhoodTable)
      .where(
        and(
          eq(neighborhoodTable.cityId, cityId),
          eq(neighborhoodTable.slug, neighborhoodKey),
          eq(neighborhoodTable.active, true)
        )
      )
      .limit(1)
    if (!n) {
      return NextResponse.json({ error: 'محله برای این شهر نامعتبر است' }, { status: 400 })
    }
  }

  const [industryOk] = await db
    .select()
    .from(industry)
    .where(and(eq(industry.id, industryId), whereIndustryOffersService(svc)))
    .limit(1)
  if (!industryOk) {
    return NextResponse.json(
      { error: 'این صنف برای این سرویس در فهرست (سرویس‌های پیشنهادی) تعریف نشده است' },
      { status: 400 }
    )
  }

  await savePageContent(industryId, cityId, svc, parsed.data, neighborhoodKey)

  return NextResponse.json({ ok: true })
}
