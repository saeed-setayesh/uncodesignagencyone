import { randomUUID } from 'node:crypto'
import { eq, inArray } from 'drizzle-orm'
import { db, studentEnrollment, studentPayment } from '@/lib/db'
import {
  getPaymentProgress,
  paymentPlanFromInstallmentCount,
  type PaymentRow,
} from '@/lib/student-payment'
import { syncEnrollmentStatusFromPayments } from '@/lib/student-payment-sync'

export type AdminInstallmentInput = {
  sequence: number
  amountToman: number
}

export async function applyAdminPaymentSchedule(
  enrollmentId: string,
  installments: AdminInstallmentInput[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (installments.length < 1 || installments.length > 12) {
    return { ok: false, error: 'تعداد اقساط باید بین ۱ تا ۱۲ باشد' }
  }

  const sorted = [...installments].sort((a, b) => a.sequence - b.sequence)
  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i]!
    if (row.sequence !== i + 1) {
      return { ok: false, error: 'شماره اقساط باید از ۱ به‌ترتیب باشد' }
    }
    if (!Number.isInteger(row.amountToman) || row.amountToman <= 0) {
      return { ok: false, error: `مبلغ قسط ${row.sequence} نامعتبر است` }
    }
  }

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return { ok: false, error: 'ثبت‌نام یافت نشد' }

  const existing = await db
    .select()
    .from(studentPayment)
    .where(eq(studentPayment.enrollmentId, enrollmentId))
    .orderBy(studentPayment.sequence)

  for (const row of existing) {
    if (row.status === 'confirmed') {
      const input = sorted.find((i) => i.sequence === row.sequence)
      if (!input) {
        return {
          ok: false,
          error: `قسط ${row.sequence} تأیید شده و قابل حذف نیست`,
        }
      }
      if (input.amountToman !== row.amountToman) {
        return {
          ok: false,
          error: `مبلغ قسط ${row.sequence} تأیید شده قابل تغییر نیست`,
        }
      }
    }

    if (row.status === 'reported') {
      const input = sorted.find((i) => i.sequence === row.sequence)
      if (!input) {
        return {
          ok: false,
          error: `قسط ${row.sequence} گزارش شده است؛ ابتدا گزارش را لغو کنید`,
        }
      }
    }
  }

  const now = new Date()
  const plan = paymentPlanFromInstallmentCount(sorted.length)

  const toDelete = existing.filter(
    (row) => row.status === 'pending' && !sorted.some((i) => i.sequence === row.sequence)
  )
  if (toDelete.length > 0) {
    await db.delete(studentPayment).where(
      inArray(
        studentPayment.id,
        toDelete.map((r) => r.id)
      )
    )
  }

  for (const input of sorted) {
    const current = existing.find((r) => r.sequence === input.sequence)
    if (!current) {
      await db.insert(studentPayment).values({
        id: randomUUID(),
        enrollmentId,
        sequence: input.sequence,
        amountToman: input.amountToman,
        status: 'pending',
        createdAt: now,
      })
      continue
    }

    if (current.status === 'pending' || current.status === 'reported') {
      if (current.amountToman !== input.amountToman) {
        await db
          .update(studentPayment)
          .set({ amountToman: input.amountToman })
          .where(eq(studentPayment.id, current.id))
      }
    }
  }

  const patch: Partial<typeof studentEnrollment.$inferInsert> = {
    paymentPlan: plan,
    updatedAt: now,
  }

  const skipStatus =
    enrollment.status === 'draft' ||
    enrollment.status === 'pending_contract' ||
    enrollment.status === 'completed'

  if (!skipStatus && enrollment.status !== 'pending_payment_plan') {
    await db.update(studentEnrollment).set(patch).where(eq(studentEnrollment.id, enrollmentId))
    await syncEnrollmentStatusFromPayments(enrollmentId)
    return { ok: true }
  }

  if (enrollment.status === 'pending_payment_plan') {
    patch.status = 'pending_payment_1'
  }

  await db.update(studentEnrollment).set(patch).where(eq(studentEnrollment.id, enrollmentId))
  return { ok: true }
}

export function installmentsFromPayments(
  payments: PaymentRow[]
): AdminInstallmentInput[] {
  return [...payments]
    .sort((a, b) => a.sequence - b.sequence)
    .map((p) => ({ sequence: p.sequence, amountToman: p.amountToman }))
}
