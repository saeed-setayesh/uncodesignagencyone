import { getServerSession } from 'next-auth'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { blogPostBodySchema, normalizeBlogMeta } from '@/lib/blog'
import { blogPost, db, service as serviceTable } from '@/lib/db'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [post] = await db.select().from(blogPost).where(eq(blogPost.id, id)).limit(1)
  if (!post) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [existing] = await db.select().from(blogPost).where(eq(blogPost.id, id)).limit(1)
    if (!existing) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })

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
      return NextResponse.json({ error: 'دستهٔ سرویس نامعتبر است' }, { status: 400 })
    }

    if (data.slug !== existing.slug) {
      const [slugTaken] = await db.select().from(blogPost).where(eq(blogPost.slug, data.slug)).limit(1)
      if (slugTaken) {
        return NextResponse.json({ error: 'این اسلاگ قبلاً استفاده شده است' }, { status: 409 })
      }
    }

    let publishedAt = existing.publishedAt
    if (data.published && !publishedAt) {
      publishedAt = new Date()
    }

    const [post] = await db
      .update(blogPost)
      .set({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        serviceCategory: data.serviceCategory,
        published: data.published,
        publishedAt,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        updatedAt: new Date(),
      })
      .where(eq(blogPost.id, id))
      .returning()

    return NextResponse.json(post)
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
    await db.delete(blogPost).where(eq(blogPost.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
