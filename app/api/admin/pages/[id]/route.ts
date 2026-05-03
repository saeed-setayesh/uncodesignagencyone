import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { city, db, generatedPage, industry } from '@/lib/db'
import { PageContentSchema } from '@/types/content'
import { savePageContent } from '@/lib/content'
import { revalidateGeneratedPagePaths } from '@/lib/revalidate-generated-page'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [row] = await db
    .select({
      id: generatedPage.id,
      industryId: generatedPage.industryId,
      cityId: generatedPage.cityId,
      service: generatedPage.service,
      neighborhoodKey: generatedPage.neighborhoodKey,
      cacheVersion: generatedPage.cacheVersion,
      content: generatedPage.content,
      createdAt: generatedPage.createdAt,
      updatedAt: generatedPage.updatedAt,
      industry: { fa: industry.fa, slug: industry.slug, id: industry.id },
      city: { fa: city.fa, slug: city.slug, id: city.id },
    })
    .from(generatedPage)
    .innerJoin(industry, eq(generatedPage.industryId, industry.id))
    .innerJoin(city, eq(generatedPage.cityId, city.id))
    .where(eq(generatedPage.id, id))
    .limit(1)

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ page: row })
}

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [page] = await db
    .select({
      industryId: generatedPage.industryId,
      cityId: generatedPage.cityId,
      service: generatedPage.service,
      neighborhoodKey: generatedPage.neighborhoodKey,
      industrySlug: industry.slug,
      citySlug: city.slug,
    })
    .from(generatedPage)
    .innerJoin(industry, eq(generatedPage.industryId, industry.id))
    .innerJoin(city, eq(generatedPage.cityId, city.id))
    .where(eq(generatedPage.id, id))
    .limit(1)

  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { content } = await req.json()
  const parsed = PageContentSchema.safeParse(content)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid content', details: parsed.error.flatten() }, { status: 422 })
  }

  await savePageContent(page.industryId, page.cityId, page.service, parsed.data, page.neighborhoodKey)

  revalidateGeneratedPagePaths({
    service: page.service,
    industrySlug: page.industrySlug,
    citySlug: page.citySlug,
    neighborhoodKey: page.neighborhoodKey,
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [page] = await db
    .select({
      service: generatedPage.service,
      neighborhoodKey: generatedPage.neighborhoodKey,
      industrySlug: industry.slug,
      citySlug: city.slug,
    })
    .from(generatedPage)
    .innerJoin(industry, eq(generatedPage.industryId, industry.id))
    .innerJoin(city, eq(generatedPage.cityId, city.id))
    .where(eq(generatedPage.id, id))
    .limit(1)

  if (!page) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })

  await db.delete(generatedPage).where(eq(generatedPage.id, id))
  revalidateGeneratedPagePaths({
    service: page.service,
    industrySlug: page.industrySlug,
    citySlug: page.citySlug,
    neighborhoodKey: page.neighborhoodKey,
  })

  return NextResponse.json({ success: true })
}
