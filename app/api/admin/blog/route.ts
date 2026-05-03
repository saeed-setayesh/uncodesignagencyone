import { randomUUID } from 'node:crypto'
import { getServerSession } from 'next-auth'
import { and, desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { blogPostBodySchema, normalizeBlogMeta } from '@/lib/blog'
import { blogPost, db, service as serviceTable } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const published = searchParams.get('published')
  const where =
    published === 'true'
      ? eq(blogPost.published, true)
      : published === 'false'
        ? eq(blogPost.published, false)
        : undefined

  const posts = where
    ? await db
        .select()
        .from(blogPost)
        .where(where)
        .orderBy(desc(blogPost.updatedAt))
    : await db.select().from(blogPost).orderBy(desc(blogPost.updatedAt))

  return NextResponse.json({ posts })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const json = await req.json()
    const parsed = blogPostBodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'ورودی نامعتبر', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const data = normalizeBlogMeta(parsed.data)
    const [svc] = await db
      .select()
      .from(serviceTable)
      .where(and(eq(serviceTable.slug, data.serviceCategory), eq(serviceTable.active, true)))
      .limit(1)
    if (!svc) {
      return NextResponse.json({ error: 'دستهٔ سرویس نامعتبر است (اسلاگ در سیستم نیست)' }, { status: 400 })
    }

    const [existing] = await db.select().from(blogPost).where(eq(blogPost.slug, data.slug)).limit(1)
    if (existing) {
      return NextResponse.json({ error: 'این اسلاگ قبلاً استفاده شده است' }, { status: 409 })
    }

    const now = new Date()
    const [created] = await db
      .insert(blogPost)
      .values({
        id: randomUUID(),
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        serviceCategory: data.serviceCategory,
        published: data.published,
        publishedAt: data.published ? now : null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
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
