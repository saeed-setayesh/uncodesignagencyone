import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/admin-api-auth'
import { db, studentEnrollment } from '@/lib/db'
import {
  confirmStudentPayment,
  markEnrollmentCompleted,
  markStudentPaymentUnpaid,
  triggerSecondPayment,
} from '@/lib/student-confirm-payment'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const bodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('confirm'), paymentId: z.string().min(1) }),
  z.object({ action: z.literal('mark_unpaid'), paymentId: z.string().min(1) }),
  z.object({ action: z.literal('trigger_second_payment') }),
  z.object({ action: z.literal('mark_course_completed') }),
])

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

  const body = parsed.data

  if (body.action === 'confirm') {
    const result = await confirmStudentPayment(enrollment.id, body.paymentId, adminId, {
      allowDirectConfirm: true,
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'mark_unpaid') {
    const result = await markStudentPaymentUnpaid(enrollment.id, body.paymentId)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'trigger_second_payment') {
    const result = await triggerSecondPayment(enrollment.id)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
    return NextResponse.json({ ok: true })
  }

  const result = await markEnrollmentCompleted(enrollment.id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  return NextResponse.json({ ok: true })
}
