import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { eq } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { contactMessage, db } from '@/lib/db'

export async function PATCH(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params
  await db
    .update(contactMessage)
    .set({ read: true })
    .where(eq(contactMessage.id, id))
  return NextResponse.json({ ok: true })
}
