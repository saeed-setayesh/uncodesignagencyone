import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { customerUser, db } from '@/lib/db'

export async function POST(req: Request) {
  let body: { email?: string; password?: string; name?: string; phone?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const name = String(body.name ?? '').trim()
  const phone = String(body.phone ?? '').trim()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'ایمیل معتبر وارد کنید' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'رمز باید حداقل ۸ کاراکتر باشد' }, { status: 400 })
  }
  if (!name) {
    return NextResponse.json({ error: 'نام الزامی است' }, { status: 400 })
  }

  const [existing] = await db.select({ id: customerUser.id }).from(customerUser).where(eq(customerUser.email, email)).limit(1)
  if (existing) {
    return NextResponse.json({ error: 'این ایمیل قبلاً ثبت شده است' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  await db.insert(customerUser).values({
    id: randomUUID(),
    email,
    password: hashed,
    name,
    phone,
  })

  return NextResponse.json({ ok: true })
}
