import { randomUUID } from 'node:crypto'
import { asc, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { city, db, neighborhood as neighborhoodTable } from '@/lib/db'

const postSchema = z.object({
  cityId: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fa: z.string().min(1),
  seoDescription: z.string().optional(),
  active: z.boolean().optional(),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const cityIdParam = searchParams.get('cityId')

  const sel = {
    id: neighborhoodTable.id,
    slug: neighborhoodTable.slug,
    fa: neighborhoodTable.fa,
    cityId: neighborhoodTable.cityId,
    seoDescription: neighborhoodTable.seoDescription,
    active: neighborhoodTable.active,
    createdAt: neighborhoodTable.createdAt,
    city: { fa: city.fa, slug: city.slug },
  }
  const rows = cityIdParam
    ? await db
        .select(sel)
        .from(neighborhoodTable)
        .innerJoin(city, eq(neighborhoodTable.cityId, city.id))
        .where(eq(neighborhoodTable.cityId, cityIdParam))
        .orderBy(asc(neighborhoodTable.fa))
    : await db
        .select(sel)
        .from(neighborhoodTable)
        .innerJoin(city, eq(neighborhoodTable.cityId, city.id))
        .orderBy(asc(neighborhoodTable.fa))

  return NextResponse.json({ neighborhoods: rows })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const parsed = postSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'ورودی نامعتبر', details: parsed.error.flatten() }, { status: 400 })
    }
    const body = parsed.data

    const [cityRow] = await db.select().from(city).where(eq(city.id, body.cityId)).limit(1)
    if (!cityRow) {
      return NextResponse.json({ error: 'شهر پیدا نشد' }, { status: 400 })
    }

    const now = new Date()
    const [row] = await db
      .insert(neighborhoodTable)
      .values({
        id: randomUUID(),
        cityId: body.cityId,
        slug: body.slug,
        fa: body.fa,
        seoDescription: body.seoDescription ?? '',
        active: body.active ?? true,
        createdAt: now,
      })
      .returning()

    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'اسلاگ در این شهر تکراری است یا خطای سرور' }, { status: 409 })
  }
}
