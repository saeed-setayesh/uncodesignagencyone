import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-api-auth'
import { db, studentUser } from '@/lib/db'
import { generateStudentPassword } from '@/lib/student-password'

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id: studentId } = await context.params
  const [student] = await db.select().from(studentUser).where(eq(studentUser.id, studentId)).limit(1)
  if (!student) return NextResponse.json({ error: 'یافت نشد' }, { status: 404 })

  const plainPassword = generateStudentPassword()
  const hashed = await bcrypt.hash(plainPassword, 10)
  await db
    .update(studentUser)
    .set({ password: hashed, updatedAt: new Date() })
    .where(eq(studentUser.id, studentId))

  return NextResponse.json({ ok: true, generatedPassword: plainPassword })
}
