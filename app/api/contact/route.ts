import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { contactMessage, db } from '@/lib/db'

const BodySchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(5).max(40),
  message: z.string().min(1).max(20_000),
})

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'ورودی نامعتبر' }, { status: 400 })
  }

  await db.insert(contactMessage).values({
    id: randomUUID(),
    name: parsed.data.name.trim(),
    phone: parsed.data.phone.trim(),
    message: parsed.data.message.trim(),
    createdAt: new Date(),
  })

  return NextResponse.json({ ok: true })
}
