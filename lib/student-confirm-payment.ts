import { eq } from 'drizzle-orm'
import { db, studentEnrollment, studentPayment } from '@/lib/db'
import { issueCertificateIfNeeded } from '@/lib/student-certificate'
import {
  getPaymentProgress,
} from '@/lib/student-payment'
import { syncEnrollmentStatusFromPayments } from '@/lib/student-payment-sync'

export async function confirmStudentPayment(
  enrollmentId: string,
  paymentId: string,
  adminId: string,
  options?: { allowDirectConfirm?: boolean }
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const [payment] = await db
    .select()
    .from(studentPayment)
    .where(eq(studentPayment.id, paymentId))
    .limit(1)

  if (!payment || payment.enrollmentId !== enrollmentId) {
    return { ok: false, error: 'قسط یافت نشد', status: 404 }
  }

  const allowedStatuses = options?.allowDirectConfirm
    ? ['reported', 'pending']
    : ['reported']

  if (!allowedStatuses.includes(payment.status)) {
    return { ok: false, error: 'این قسط قابل تأیید نیست', status: 400 }
  }

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return { ok: false, error: 'ثبت‌نام یافت نشد', status: 404 }

  const now = new Date()
  await db
    .update(studentPayment)
    .set({
      status: 'confirmed',
      confirmedAt: now,
      confirmedByAdminId: adminId,
      reportedAt: payment.reportedAt ?? now,
    })
    .where(eq(studentPayment.id, paymentId))

  await syncEnrollmentStatusFromPayments(enrollmentId)
  return { ok: true }
}

export async function markStudentPaymentUnpaid(
  enrollmentId: string,
  paymentId: string
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const [payment] = await db
    .select()
    .from(studentPayment)
    .where(eq(studentPayment.id, paymentId))
    .limit(1)

  if (!payment || payment.enrollmentId !== enrollmentId) {
    return { ok: false, error: 'قسط یافت نشد', status: 404 }
  }
  if (payment.status === 'pending') {
    return { ok: false, error: 'این قسط از قبل پرداخت‌نشده است', status: 400 }
  }

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return { ok: false, error: 'ثبت‌نام یافت نشد', status: 404 }

  const now = new Date()
  await db
    .update(studentPayment)
    .set({
      status: 'pending',
      reportedAt: null,
      confirmedAt: null,
      confirmedByAdminId: null,
    })
    .where(eq(studentPayment.id, paymentId))

  if (payment.sequence > 1) {
    await db
      .update(studentEnrollment)
      .set({ secondPaymentUnlocked: false, updatedAt: now })
      .where(eq(studentEnrollment.id, enrollmentId))
  }

  await syncEnrollmentStatusFromPayments(enrollmentId)
  return { ok: true }
}

export async function triggerSecondPayment(
  enrollmentId: string
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  return unlockNextInstallment(enrollmentId)
}

export async function unlockNextInstallment(
  enrollmentId: string
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return { ok: false, error: 'ثبت‌نام یافت نشد', status: 404 }

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
  if (progress.phase === 'done') {
    return { ok: false, error: 'همه اقساط پرداخت شده‌اند', status: 400 }
  }
  if (progress.sequence <= 1) {
    return { ok: false, error: 'ابتدا قسط اول باید تأیید شود', status: 400 }
  }

  const previous = payments.filter((p) => p.sequence < progress.sequence)
  if (previous.some((p) => p.status !== 'confirmed')) {
    return { ok: false, error: 'اقساط قبلی باید تأیید شده باشند', status: 400 }
  }

  const target = payments.find((p) => p.sequence === progress.sequence)
  if (!target || target.status === 'confirmed') {
    return { ok: false, error: 'قسط بعدی یافت نشد یا قبلاً پرداخت شده', status: 400 }
  }

  const now = new Date()
  await db
    .update(studentEnrollment)
    .set({
      secondPaymentUnlocked: true,
      updatedAt: now,
    })
    .where(eq(studentEnrollment.id, enrollmentId))

  await syncEnrollmentStatusFromPayments(enrollmentId)
  return { ok: true }
}

export async function markEnrollmentCompleted(
  enrollmentId: string
): Promise<{ ok: true } | { ok: false; error: string; status?: number }> {
  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return { ok: false, error: 'ثبت‌نام یافت نشد', status: 404 }

  const now = new Date()
  await db
    .update(studentEnrollment)
    .set({
      status: 'completed',
      sessionsCompletedCount: enrollment.sessionCount,
      updatedAt: now,
    })
    .where(eq(studentEnrollment.id, enrollmentId))

  await issueCertificateIfNeeded(enrollmentId)
  return { ok: true }
}
