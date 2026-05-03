import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { city, db, neighborhood as neighborhoodTable } from '@/lib/db'

const putSchema = z.object({
  cityId: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fa: z.string().min(1),
  seoDescription: z.string().optional(),
  active: z.boolean().optional(),
})

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [n] = await db
    .select({
      id: neighborhoodTable.id,
      slug: neighborhoodTable.slug,
      fa: neighborhoodTable.fa,
      cityId: neighborhoodTable.cityId,
      seoDescription: neighborhoodTable.seoDescription,
      active: neighborhoodTable.active,
      createdAt: neighborhoodTable.createdAt,
      city: { fa: city.fa, slug: city.slug },
    })
    .from(neighborhoodTable)
    .innerJoin(city, eq(neighborhoodTable.cityId, city.id))
    .where(eq(neighborhoodTable.id, id))
    .limit(1)

  if (!n) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  return NextResponse.json(n)
}

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const parsed = putSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'ورودی نامعتبر', details: parsed.error.flatten() }, { status: 400 })
    }
    const body = parsed.data

    const [cityRow] = await db.select().from(city).where(eq(city.id, body.cityId)).limit(1)
    if (!cityRow) {
      return NextResponse.json({ error: 'شهر پیدا نشد' }, { status: 400 })
    }

    const [row] = await db
      .update(neighborhoodTable)
      .set({
        cityId: body.cityId,
        slug: body.slug,
        fa: body.fa,
        seoDescription: body.seoDescription ?? '',
        active: body.active ?? true,
      })
      .where(eq(neighborhoodTable.id, id))
      .returning()

    return NextResponse.json(row)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'به‌روزرسانی ممکن نیست (تکراری یا خطای سرور)' }, { status: 409 })
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await db.delete(neighborhoodTable).where(eq(neighborhoodTable.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
