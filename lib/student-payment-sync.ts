import { eq } from 'drizzle-orm'
import { db, studentEnrollment, studentPayment } from '@/lib/db'
import {
  enrollmentStatusForProgress,
  getPaymentProgress,
} from '@/lib/student-payment'

export async function syncEnrollmentStatusFromPayments(enrollmentId: string): Promise<void> {
  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return

  const skip = new Set(['draft', 'pending_contract', 'pending_payment_plan', 'completed'])
  if (skip.has(enrollment.status)) return

  const payments = await db
    .select({
      sequence: studentPayment.sequence,
      amountToman: studentPayment.amountToman,
      status: studentPayment.status,
    })
    .from(studentPayment)
    .where(eq(studentPayment.enrollmentId, enrollmentId))
    .orderBy(studentPayment.sequence)

  const progress = getPaymentProgress(payments)
  if (progress.total === 0) return

  const nextStatus = enrollmentStatusForProgress(progress, payments)
  if (nextStatus === enrollment.status) return

  await db
    .update(studentEnrollment)
    .set({
      status: nextStatus,
      updatedAt: new Date(),
      ...(progress.phase === 'done' ? { secondPaymentUnlocked: false } : {}),
    })
    .where(eq(studentEnrollment.id, enrollmentId))
}
