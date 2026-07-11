import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireStudentSession } from '@/lib/student-api-auth'
import { db, studentPayment, studentSession } from '@/lib/db'
import { getLatestEnrollmentForStudent } from '@/lib/student-enrollment-query'
import { getMidCourseDate, getAmountDue } from '@/lib/student-payment'
import { STUDENT_STATUS_LABELS, type StudentEnrollmentStatus } from '@/lib/student-enrollment-status'

export async function GET() {
  const auth = await requireStudentSession()
  if (!auth.ok) return auth.response

  const enrollment = await getLatestEnrollmentForStudent(auth.studentId)
  if (!enrollment) {
    return NextResponse.json({ enrollment: null, sessions: [], payments: [] })
  }

  const sessions = await db
    .select()
    .from(studentSession)
    .where(eq(studentSession.enrollmentId, enrollment.id))
    .orderBy(studentSession.sessionNumber)

  const payments = await db
    .select()
    .from(studentPayment)
    .where(eq(studentPayment.enrollmentId, enrollment.id))
    .orderBy(studentPayment.sequence)

  const midCourseDate = getMidCourseDate(sessions)
  const amountDue = getAmountDue(enrollment, payments, midCourseDate)
  const showPaymentDetails =
    enrollment.status !== 'pending_contract' &&
    enrollment.status !== 'pending_payment_plan' &&
    enrollment.status !== 'draft'

  return NextResponse.json({
    enrollment: {
      ...enrollment,
      statusLabel:
        STUDENT_STATUS_LABELS[enrollment.status as StudentEnrollmentStatus] ?? enrollment.status,
    },
    sessions,
    payments,
    midCourseDate: midCourseDate?.toISOString() ?? null,
    amountDue,
    showPaymentDetails,
  })
}
