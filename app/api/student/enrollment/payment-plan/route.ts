import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireStudentSession } from '@/lib/student-api-auth'
import { db, studentEnrollment, studentPayment } from '@/lib/db'
import { getLatestEnrollmentForStudent } from '@/lib/student-enrollment-query'
import { getInstallments, type PaymentPlan } from '@/lib/student-payment'

const bodySchema = z.object({
  plan: z.enum(['full', 'split']),
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
  if (enrollment.status !== 'pending_payment_plan') {
    return NextResponse.json({ error: 'در این مرحله امکان انتخاب پلن نیست' }, { status: 400 })
  }

  const plan = parsed.data.plan as PaymentPlan
  const installments = getInstallments(enrollment.priceToman, plan)

  await db.delete(studentPayment).where(eq(studentPayment.enrollmentId, enrollment.id))

  const now = new Date()
  await db.insert(studentPayment).values(
    installments.map((inst) => ({
      id: randomUUID(),
      enrollmentId: enrollment.id,
      sequence: inst.sequence,
      amountToman: inst.amountToman,
      status: 'pending',
      createdAt: now,
    }))
  )

  await db
    .update(studentEnrollment)
    .set({
      paymentPlan: plan,
      status: 'pending_payment_1',
      updatedAt: now,
    })
    .where(eq(studentEnrollment.id, enrollment.id))

  return NextResponse.json({ ok: true, plan, installments })
}
