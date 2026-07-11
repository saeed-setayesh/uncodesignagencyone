import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db, studentPayment, studentSession } from '@/lib/db'
import { getLatestEnrollmentForStudent } from '@/lib/student-enrollment-query'
import {
  getAmountDue,
  getMidCourseDate,
  getPaymentProgress,
  hasPartialPayment,
} from '@/lib/student-payment'
import { getCertificateByEnrollmentId } from '@/lib/student-certificate'
import { STUDENT_STATUS_LABELS, type StudentEnrollmentStatus } from '@/lib/student-enrollment-status'

export async function getStudentPortalData() {
  const session = await getServerSession(authOptions)
  const studentId = session!.user!.id

  const enrollment = await getLatestEnrollmentForStudent(studentId)
  if (!enrollment) {
    return {
      enrollment: null,
      sessions: [],
      payments: [],
      midCourseDate: null,
      amountDue: null,
      showPaymentDetails: false,
      certificate: null,
    }
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

  const certificate = await getCertificateByEnrollmentId(enrollment.id)

  const progress = getPaymentProgress(payments)
  let statusLabel =
    STUDENT_STATUS_LABELS[enrollment.status as StudentEnrollmentStatus] ?? enrollment.status
  if (enrollment.status === 'active' && hasPartialPayment(payments)) {
    statusLabel = 'دوره فعال — پرداخت ناقص'
  } else if (progress.phase === 'review') {
    statusLabel =
      progress.sequence === 1
        ? 'بررسی پرداخت اول'
        : `بررسی قسط ${progress.sequence.toLocaleString('fa-IR')}`
  }

  return {
    enrollment: {
      ...enrollment,
      statusLabel,
    },
    sessions,
    payments,
    midCourseDate: midCourseDate?.toISOString() ?? null,
    amountDue,
    showPaymentDetails,
    certificate,
  }
}
