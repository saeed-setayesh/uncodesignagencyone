import { randomUUID } from 'node:crypto'
import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { normalizeSuggestedServiceSlugs } from '@/lib/admin-suggested-services'
import { db, industry as industryTable } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { slug, fa, desc, active } = body

    if (!slug || !fa || !desc) {
      return NextResponse.json({ error: 'اسلاگ، نام فارسی و توضیح الزامی هستند' }, { status: 400 })
    }

    const suggestedServices =
      'suggestedServices' in body
        ? await normalizeSuggestedServiceSlugs(body.suggestedServices)
        : []

    const [existing] = await db.select().from(industryTable).where(eq(industryTable.slug, slug)).limit(1)
    if (existing) {
      return NextResponse.json({ error: 'این اسلاگ قبلاً استفاده شده است' }, { status: 409 })
    }

    const now = new Date()
    const [created] = await db
      .insert(industryTable)
      .values({
        id: randomUUID(),
        slug,
        fa,
        desc,
        active: active ?? true,
        suggestedServices,
        createdAt: now,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
