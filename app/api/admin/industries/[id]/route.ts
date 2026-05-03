import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { normalizeSuggestedServiceSlugs } from '@/lib/admin-suggested-services'
import { db, industry as industryTable } from '@/lib/db'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [row] = await db.select().from(industryTable).where(eq(industryTable.id, id)).limit(1)
  if (!row) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  return NextResponse.json(row)
}

export async function PUT(req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { slug, fa, desc, active } = body
    const data: {
      slug: string
      fa: string
      desc: string
      active: boolean
      suggestedServices?: string[]
    } = { slug, fa, desc, active }
    if ('suggestedServices' in body) {
      data.suggestedServices = await normalizeSuggestedServiceSlugs(body.suggestedServices)
    }
    const [updated] = await db
      .update(industryTable)
      .set(data)
      .where(eq(industryTable.id, id))
      .returning()
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  const { id } = await params
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await db.delete(industryTable).where(eq(industryTable.id, id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
