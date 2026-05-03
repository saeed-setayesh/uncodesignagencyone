import { randomUUID } from 'node:crypto'
import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { city, db } from '@/lib/db'
import { countWords } from '@/lib/utils'
import { MAX_CITY_SEO_WORDS } from '@/lib/cities-seo'

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { slug, fa, province, active } = body
    const seoDescription = typeof body.seoDescription === 'string' ? body.seoDescription : ''

    if (!slug || !fa || !province) {
      return NextResponse.json({ error: 'اسلاگ، نام فارسی و استان الزامی هستند' }, { status: 400 })
    }

    if (countWords(seoDescription) > MAX_CITY_SEO_WORDS) {
      return NextResponse.json(
        { error: `توضیح سئو حداکثر ${MAX_CITY_SEO_WORDS} واژه مجاز است` },
        { status: 400 }
      )
    }

    const [existing] = await db.select().from(city).where(eq(city.slug, slug)).limit(1)
    if (existing) {
      return NextResponse.json({ error: 'این اسلاگ قبلاً استفاده شده است' }, { status: 409 })
    }

    const now = new Date()
    const [created] = await db
      .insert(city)
      .values({
        id: randomUUID(),
        slug,
        fa,
        province,
        active: active ?? true,
        seoDescription,
        createdAt: now,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
