import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/admin-api-auth'
import {
  db,
  studentEnrollment,
  studentUser,
} from '@/lib/db'
import { normalizeStudentPhone } from '@/lib/student-phone'
import {
  canAdminEditEnrollment,
  getEnrollmentBundle,
  enrollmentToJson,
  replaceEnrollmentSessions,
  type SessionInput,
} from '@/lib/student-admin-save'
import { applyAdminPaymentSchedule } from '@/lib/student-admin-payments'
import { maybeCompleteEnrollment } from '@/lib/student-certificate'
import { markEnrollmentCompleted } from '@/lib/student-confirm-payment'
const sessionSchema = z.object({
  sessionNumber: z.number().int().positive(),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  note: z.string().optional(),
})

const putSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  active: z.boolean().optional(),
  courseTitle: z.string().min(1).optional(),
  courseDescription: z.string().optional(),
  priceToman: z.number().int().positive().optional(),
  jobSlug: z.string().nullable().optional(),
  teacherName: z.string().optional(),
  teacherPhone: z.string().optional(),
  paymentCardNumber: z.string().optional(),
  paymentShaba: z.string().optional(),
  paymentCardHolder: z.string().optional(),
  paymentBankName: z.string().optional(),
  adminNotes: z.string().optional(),
  status: z.string().optional(),
  sessionsCompletedCount: z.number().int().min(0).optional(),
  sessions: z.array(sessionSchema).optional(),
  installments: z
    .array(
      z.object({
        sequence: z.number().int().positive(),
        amountToman: z.number().int().positive(),
      })
    )
    .optional(),
})

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id: studentId } = await context.params
  const [student] = await db.select().from(studentUser).where(eq(studentUser.id, studentId)).limit(1)
  if (!student) return NextResponse.json({ error: 'یافت نشد' }, { status: 404 })

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.studentId, studentId))
    .limit(1)

  if (!enrollment) {
    return NextResponse.json({ student, enrollment: null, sessions: [], payments: [] })
  }

  const bundle = await getEnrollmentBundle(enrollment.id)
  if (!bundle) return NextResponse.json({ error: 'یافت نشد' }, { status: 404 })

  return NextResponse.json(enrollmentToJson(bundle, student))
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id: studentId } = await context.params
  const parsed = putSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'ورودی نامعتبر', details: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data

  const [student] = await db.select().from(studentUser).where(eq(studentUser.id, studentId)).limit(1)
  if (!student) return NextResponse.json({ error: 'یافت نشد' }, { status: 404 })

  const now = new Date()
  const userPatch: Partial<typeof studentUser.$inferInsert> = { updatedAt: now }
  if (body.name != null) userPatch.name = body.name
  if (body.active != null) userPatch.active = body.active
  if (body.phone != null) {
    const phone = normalizeStudentPhone(body.phone)
    if (!phone) return NextResponse.json({ error: 'شماره موبایل نامعتبر' }, { status: 400 })
    if (phone !== student.phone) {
      const [dup] = await db.select().from(studentUser).where(eq(studentUser.phone, phone)).limit(1)
      if (dup) return NextResponse.json({ error: 'شماره تکراری' }, { status: 409 })
    }
    userPatch.phone = phone
  }

  await db.update(studentUser).set(userPatch).where(eq(studentUser.id, studentId))

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.studentId, studentId))
    .limit(1)

  if (enrollment) {
    const enrollPatch: Partial<typeof studentEnrollment.$inferInsert> = { updatedAt: now }
    if (body.courseTitle != null) enrollPatch.courseTitle = body.courseTitle
    if (body.courseDescription != null) enrollPatch.courseDescription = body.courseDescription
    if (body.priceToman != null) enrollPatch.priceToman = body.priceToman
    if (body.jobSlug !== undefined) enrollPatch.jobSlug = body.jobSlug
    if (body.teacherName != null) enrollPatch.teacherName = body.teacherName
    if (body.teacherPhone != null) enrollPatch.teacherPhone = body.teacherPhone
    if (body.paymentCardNumber != null) enrollPatch.paymentCardNumber = body.paymentCardNumber
    if (body.paymentShaba != null) enrollPatch.paymentShaba = body.paymentShaba
    if (body.paymentCardHolder != null) enrollPatch.paymentCardHolder = body.paymentCardHolder
    if (body.paymentBankName != null) enrollPatch.paymentBankName = body.paymentBankName
    if (body.adminNotes != null) enrollPatch.adminNotes = body.adminNotes
    if (body.status != null) enrollPatch.status = body.status
    if (body.sessionsCompletedCount != null) {
      const max = body.sessions?.length ?? enrollment.sessionCount
      enrollPatch.sessionsCompletedCount = Math.min(body.sessionsCompletedCount, max)
    }

    await db.update(studentEnrollment).set(enrollPatch).where(eq(studentEnrollment.id, enrollment.id))

    if (body.sessions && body.sessions.length > 0) {
      if (!canAdminEditEnrollment(enrollment) && enrollment.status !== 'active') {
        // allow session edits for draft/pending_contract only; also allow when active for reschedule? Plan says admin manages - allow unless payment review
        const locked = ['payment_1_review', 'payment_2_review'].includes(enrollment.status)
        if (locked) {
          return NextResponse.json({ error: 'در انتظار تأیید پرداخت؛ ویرایش جلسات مجاز نیست' }, { status: 400 })
        }
      }
      await replaceEnrollmentSessions(enrollment.id, body.sessions as SessionInput[])
    }

    if (body.installments && body.installments.length > 0) {
      const paymentResult = await applyAdminPaymentSchedule(enrollment.id, body.installments)
      if (!paymentResult.ok) {
        return NextResponse.json({ error: paymentResult.error }, { status: 400 })
      }
    }

    const [freshEnrollment] = await db
      .select()
      .from(studentEnrollment)
      .where(eq(studentEnrollment.id, enrollment.id))
      .limit(1)
    if (freshEnrollment) {
      if (body.status === 'completed') {
        await markEnrollmentCompleted(freshEnrollment.id)
      } else if (
        freshEnrollment.sessionCount > 0 &&
        freshEnrollment.sessionsCompletedCount >= freshEnrollment.sessionCount
      ) {
        await maybeCompleteEnrollment(
          freshEnrollment.id,
          freshEnrollment.sessionsCompletedCount,
          freshEnrollment.sessionCount
        )
      }
    }
  }

  const [updatedStudent] = await db.select().from(studentUser).where(eq(studentUser.id, studentId)).limit(1)
  const [updatedEnrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.studentId, studentId))
    .limit(1)

  if (!updatedEnrollment) {
    return NextResponse.json({ student: updatedStudent, enrollment: null, sessions: [], payments: [] })
  }

  const bundle = await getEnrollmentBundle(updatedEnrollment.id)
  return NextResponse.json(enrollmentToJson(bundle!, updatedStudent!))
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id: studentId } = await context.params
  await db.delete(studentUser).where(eq(studentUser.id, studentId))
  return NextResponse.json({ ok: true })
}
