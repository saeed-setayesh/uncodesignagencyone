import { randomUUID } from 'node:crypto'
import { getServerSession } from 'next-auth'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { db, job as jobTable } from '@/lib/db'
import { isReservedSlug } from '@/lib/reserved-slugs'
import { meetsMinServiceSeoWords, MIN_SERVICE_SEO_WORDS } from '@/lib/service-seo'
import { jobSlugConflictsWithService } from '@/lib/slug-conflicts'
import { PricingPlansSchema } from '@/types/pricing'

const postSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fa: z.string().min(1),
  seoBody: z.string(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  pricingPlans: z.unknown().optional().nullable(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const jobs = await db
    .select()
    .from(jobTable)
    .orderBy(asc(jobTable.sortOrder), asc(jobTable.fa))
  return NextResponse.json({ jobs })
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

    if (isReservedSlug(body.slug)) {
      return NextResponse.json({ error: 'این اسلاگ رزرو شده است' }, { status: 400 })
    }

    if (await jobSlugConflictsWithService(body.slug)) {
      return NextResponse.json({ error: 'این اسلاگ برای یک سرویس ثبت شده است' }, { status: 409 })
    }

    if (!meetsMinServiceSeoWords(body.seoBody)) {
      return NextResponse.json(
        { error: `متن سئو باید حداقل ${MIN_SERVICE_SEO_WORDS} واژه باشد` },
        { status: 400 }
      )
    }

    let plansJson: Record<string, unknown> | null | undefined
    if (body.pricingPlans != null) {
      const plansParsed = PricingPlansSchema.safeParse(body.pricingPlans)
      if (!plansParsed.success) {
        return NextResponse.json({ error: 'فرمت پلن‌های قیمت نامعتبر است' }, { status: 400 })
      }
      plansJson = plansParsed.data as Record<string, unknown>
    } else {
      plansJson = null
    }

    const [existing] = await db.select().from(jobTable).where(eq(jobTable.slug, body.slug)).limit(1)
    if (existing) {
      return NextResponse.json({ error: 'اسلاگ تکراری است' }, { status: 409 })
    }

    const now = new Date()
    const [created] = await db
      .insert(jobTable)
      .values({
        id: randomUUID(),
        slug: body.slug,
        fa: body.fa,
        seoBody: body.seoBody,
        metaTitle: body.metaTitle?.trim() || null,
        metaDescription: body.metaDescription?.trim() || null,
        pricingPlans: plansJson,
        active: body.active ?? true,
        sortOrder: body.sortOrder ?? 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
