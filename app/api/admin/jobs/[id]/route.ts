import { getServerSession } from 'next-auth'
import { and, asc, eq, ne } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { db, job as jobTable } from '@/lib/db'
import { isReservedSlug } from '@/lib/reserved-slugs'
import { meetsMinServiceSeoWords, MIN_SERVICE_SEO_WORDS } from '@/lib/service-seo'
import { jobSlugConflictsWithService } from '@/lib/slug-conflicts'
import { PricingPlansSchema } from '@/types/pricing'

const putSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fa: z.string().min(1),
  seoBody: z.string(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  pricingPlans: z.unknown().optional().nullable(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [row] = await db.select().from(jobTable).where(eq(jobTable.id, id)).limit(1)
  if (!row) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  return NextResponse.json(row)
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

    const [current] = await db.select().from(jobTable).where(eq(jobTable.id, id)).limit(1)
    if (!current) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })

    if (isReservedSlug(body.slug)) {
      return NextResponse.json({ error: 'این اسلاگ رزرو شده است' }, { status: 400 })
    }

    if (body.slug !== current.slug && (await jobSlugConflictsWithService(body.slug))) {
      return NextResponse.json({ error: 'این اسلاگ برای یک سرویس ثبت شده است' }, { status: 409 })
    }

    if (!meetsMinServiceSeoWords(body.seoBody)) {
      return NextResponse.json(
        { error: `متن سئو باید حداقل ${MIN_SERVICE_SEO_WORDS} واژه باشد` },
        { status: 400 }
      )
    }

    let pricingPlansValue: Record<string, unknown> | null | undefined
    if (body.pricingPlans === null) {
      pricingPlansValue = null
    } else if (body.pricingPlans !== undefined) {
      const plansParsed = PricingPlansSchema.safeParse(body.pricingPlans)
      if (!plansParsed.success) {
        return NextResponse.json({ error: 'فرمت پلن‌های قیمت نامعتبر است' }, { status: 400 })
      }
      pricingPlansValue = plansParsed.data as Record<string, unknown>
    }

    const [slugClash] = await db
      .select()
      .from(jobTable)
      .where(and(eq(jobTable.slug, body.slug), ne(jobTable.id, id)))
      .limit(1)
    if (slugClash) {
      return NextResponse.json({ error: 'اسلاگ تکراری است' }, { status: 409 })
    }

    const [updated] = await db
      .update(jobTable)
      .set({
        slug: body.slug,
        fa: body.fa,
        seoBody: body.seoBody,
        metaTitle: body.metaTitle?.trim() || null,
        metaDescription: body.metaDescription?.trim() || null,
        ...(pricingPlansValue !== undefined ? { pricingPlans: pricingPlansValue } : {}),
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? current.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(jobTable.id, id))
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
    await db.delete(jobTable).where(eq(jobTable.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'حذف ممکن نیست (وابستگی در دیتابیس)' }, { status: 400 })
  }
}
