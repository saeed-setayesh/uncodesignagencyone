import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireStudentSession } from '@/lib/student-api-auth'
import { db, studentEnrollment, studentPayment, studentSession } from '@/lib/db'
import { getLatestEnrollmentForStudent } from '@/lib/student-enrollment-query'
import {
  canPayInstallment,
  enrollmentStatusForProgress,
  getMidCourseDate,
  getPaymentProgress,
} from '@/lib/student-payment'

const bodySchema = z.object({
  sequence: z.number().int().positive(),
})

export async function POST(req: Request) {
  const auth = await requireStudentSession()
  if (!auth.ok) return auth.response

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'ورودی نامعتبر' }, { status: 400 })
  }

  const enrollment = await getLatestEnrollmentForStudent(auth.studentId)
  if (!enrollment) {
    return NextResponse.json({ error: 'دوره‌ای یافت نشد' }, { status: 404 })
  }

  const sequence = parsed.data.sequence
  const payments = await db
    .select()
    .from(studentPayment)
    .where(eq(studentPayment.enrollmentId, enrollment.id))

  const payment = payments.find((p) => p.sequence === sequence)
  if (!payment || payment.status !== 'pending') {
    return NextResponse.json({ error: 'قسطی برای گزارش یافت نشد' }, { status: 400 })
  }

  const progress = getPaymentProgress(payments)
  if (progress.phase !== 'due' || progress.sequence !== sequence) {
    return NextResponse.json({ error: 'در این مرحله امکان گزارش این قسط نیست' }, { status: 400 })
  }

  const sessions = await db
    .select()
    .from(studentSession)
    .where(eq(studentSession.enrollmentId, enrollment.id))
  const mid = getMidCourseDate(sessions)

  if (!canPayInstallment(enrollment, payments, sequence, mid)) {
    return NextResponse.json({ error: 'ابتدا قسط قبلی باید تأیید شود' }, { status: 400 })
  }

  const now = new Date()
  await db
    .update(studentPayment)
    .set({ status: 'reported', reportedAt: now })
    .where(eq(studentPayment.id, payment.id))

  const updatedPayments = payments.map((p) =>
    p.id === payment.id ? { ...p, status: 'reported' } : p
  )
  const reviewProgress = getPaymentProgress(
    updatedPayments.map((p) => ({
      sequence: p.sequence,
      amountToman: p.amountToman,
      status: p.status,
    }))
  )
  const newStatus = enrollmentStatusForProgress(reviewProgress, updatedPayments)
  await db
    .update(studentEnrollment)
    .set({ status: newStatus, updatedAt: now })
    .where(eq(studentEnrollment.id, enrollment.id))

  return NextResponse.json({ ok: true, status: newStatus })
}
