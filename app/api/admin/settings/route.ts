import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db, siteSetting } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(siteSetting)
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return NextResponse.json({ settings })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { settings } = await req.json() as { settings: Record<string, string> }
  const now = new Date()

  for (const [key, value] of Object.entries(settings)) {
    await db
      .insert(siteSetting)
      .values({ key, value: String(value), updatedAt: now })
      .onConflictDoUpdate({
        target: siteSetting.key,
        set: { value: String(value), updatedAt: now },
      })
  }

  revalidatePath('/contact')
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true })
}
