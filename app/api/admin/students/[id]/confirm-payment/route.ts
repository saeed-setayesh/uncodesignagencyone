import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { requireAdminSession } from '@/lib/admin-api-auth'
import { authOptions } from '@/lib/auth'
import { db, studentEnrollment } from '@/lib/db'
import { confirmStudentPayment } from '@/lib/student-confirm-payment'

const bodySchema = z.object({
  paymentId: z.string().min(1),
  enrollmentId: z.string().min(1).optional(),
})

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const session = await getServerSession(authOptions)
  const adminId = session?.user?.id
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: studentId } = await context.params
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'ورودی نامعتبر' }, { status: 400 })
  }

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.studentId, studentId))
    .limit(1)

  if (!enrollment) return NextResponse.json({ error: 'ثبت‌نام یافت نشد' }, { status: 404 })

  const enrollmentId = parsed.data.enrollmentId ?? enrollment.id
  if (enrollmentId !== enrollment.id) {
    return NextResponse.json({ error: 'ثبت‌نام نامعتبر' }, { status: 400 })
  }

  const result = await confirmStudentPayment(enrollmentId, parsed.data.paymentId, adminId, {
    allowDirectConfirm: true,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }

  return NextResponse.json({ ok: true })
}
