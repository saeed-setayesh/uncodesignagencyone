import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { city, db } from '@/lib/db'
import { NATIONAL_HUB_CITY_SLUG } from '@/lib/content'
import { countWords } from '@/lib/utils'
import { MAX_CITY_SEO_WORDS } from '@/lib/cities-seo'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [row] = await db.select().from(city).where(eq(city.id, id)).limit(1)
  if (!row) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  return NextResponse.json(row)
}

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { slug, fa, province, active } = body
    const seoDescription = typeof body.seoDescription === 'string' ? body.seoDescription : ''

    const [pre] = await db.select().from(city).where(eq(city.id, id)).limit(1)
    if (pre?.slug === NATIONAL_HUB_CITY_SLUG && active === false) {
      return NextResponse.json(
        { error: 'شهر «سراسر ایران» نمی‌تواند غیرفعال شود' },
        { status: 400 }
      )
    }

    if (countWords(seoDescription) > MAX_CITY_SEO_WORDS) {
      return NextResponse.json(
        { error: `توضیح سئو حداکثر ${MAX_CITY_SEO_WORDS} واژه مجاز است` },
        { status: 400 }
      )
    }

    const [updated] = await db
      .update(city)
      .set({ slug, fa, province, active, seoDescription })
      .where(eq(city.id, id))
      .returning()
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json() as { active?: boolean }
    if (typeof body.active !== 'boolean') {
      return NextResponse.json({ error: 'مقدار active الزامی است' }, { status: 400 })
    }
    const [existing] = await db.select().from(city).where(eq(city.id, id)).limit(1)
    if (!existing) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
    if (existing.slug === NATIONAL_HUB_CITY_SLUG && body.active === false) {
      return NextResponse.json(
        { error: 'شهر «سراسر ایران» نمی‌تواند غیرفعال شود' },
        { status: 400 }
      )
    }
    const [updated] = await db
      .update(city)
      .set({ active: body.active })
      .where(eq(city.id, id))
      .returning()
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [existing] = await db.select().from(city).where(eq(city.id, id)).limit(1)
    if (existing?.slug === NATIONAL_HUB_CITY_SLUG) {
      return NextResponse.json({ error: 'شهر «سراسر ایران» قابل حذف نیست' }, { status: 400 })
    }
    await db.delete(city).where(eq(city.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
