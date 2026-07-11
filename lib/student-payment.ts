import type { StudentSession } from '@/lib/db'

export type PaymentPlan = 'full' | 'split'

export function paymentPlanFromInstallmentCount(count: number): string {
  if (count <= 1) return 'full'
  if (count === 2) return 'split'
  return String(count)
}

export function getInstallmentCount(paymentPlan: string | null, paymentCount: number): number {
  if (paymentCount > 0) return paymentCount
  if (paymentPlan === 'full') return 1
  if (paymentPlan === 'split') return 2
  if (paymentPlan && /^\d+$/.test(paymentPlan)) return Math.max(1, parseInt(paymentPlan, 10))
  return 0
}

export function getInstallments(priceToman: number, plan: PaymentPlan): { sequence: number; amountToman: number }[] {
  return buildEvenInstallments(priceToman, plan === 'full' ? 1 : 2)
}

export function buildEvenInstallments(
  priceToman: number,
  count: number
): { sequence: number; amountToman: number }[] {
  const n = Math.max(1, Math.min(12, count))
  const base = Math.floor(priceToman / n)
  const rows: { sequence: number; amountToman: number }[] = []
  let allocated = 0
  for (let i = 1; i <= n; i++) {
    const amount = i === n ? priceToman - allocated : base
    rows.push({ sequence: i, amountToman: amount })
    allocated += amount
  }
  return rows
}

/** Middle session start (ceil(n/2)) for split second installment unlock */
export function getMidCourseDate(
  sessions: Pick<StudentSession, 'sessionNumber' | 'startsAt'>[]
): Date | null {
  if (sessions.length === 0) return null
  const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber)
  const midIndex = Math.ceil(sorted.length / 2) - 1
  const mid = sorted[midIndex]
  return mid ? new Date(mid.startsAt) : null
}

/** Session number (1-based) where the mid-course installment typically applies */
export function getMidCourseSessionNumber(sessionCount: number): number {
  if (sessionCount <= 0) return 1
  return Math.ceil(sessionCount / 2)
}

export function formatMidCoursePaymentHint(options: {
  sequence: number
  installmentTotal: number
  midCourseDate: Date | null
  sessionCount?: number
}): string | null {
  const { sequence, installmentTotal, midCourseDate, sessionCount = 0 } = options
  if (sequence !== 2 || installmentTotal < 2 || !midCourseDate) return null

  const dateStr = midCourseDate.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (sessionCount > 0) {
    const midSession = getMidCourseSessionNumber(sessionCount)
    return `قسط دوم معمولاً از جلسه ${midSession.toLocaleString('fa-IR')} (${dateStr}) است؛ هر زمان بخواهید می‌توانید زودتر هم پرداخت کنید.`
  }

  return `قسط دوم معمولاً از میانه دوره (${dateStr}) است؛ هر زمان بخواهید می‌توانید زودتر هم پرداخت کنید.`
}

export function formatToman(amount: number): string {
  return amount.toLocaleString('fa-IR')
}

export type PaymentRow = {
  sequence: number
  amountToman: number
  status: string
}

export type EnrollmentForDue = {
  status: string
  paymentPlan: string | null
  priceToman: number
  secondPaymentUnlocked?: boolean
}

export type PaymentProgress = {
  total: number
  sequence: number
  phase: 'due' | 'review' | 'waiting' | 'done'
}

export function getPaymentProgress(payments: PaymentRow[]): PaymentProgress {
  const sorted = [...payments].sort((a, b) => a.sequence - b.sequence)
  const total = sorted.length
  if (total === 0) return { total: 0, sequence: 0, phase: 'done' }

  const reported = sorted.find((p) => p.status === 'reported')
  if (reported) return { total, sequence: reported.sequence, phase: 'review' }

  const nextPending = sorted.find((p) => p.status === 'pending')
  if (!nextPending) return { total, sequence: sorted[total - 1]!.sequence, phase: 'done' }

  const previous = sorted.filter((p) => p.sequence < nextPending.sequence)
  if (previous.some((p) => p.status !== 'confirmed')) {
    return { total, sequence: nextPending.sequence, phase: 'waiting' }
  }

  return { total, sequence: nextPending.sequence, phase: 'due' }
}

export function canPayInstallment(
  enrollment: EnrollmentForDue,
  payments: PaymentRow[],
  sequence: number,
  _midCourseDate?: Date | null
): boolean {
  const payment = payments.find((p) => p.sequence === sequence)
  if (!payment || payment.status !== 'pending') return false

  const previous = payments.filter((p) => p.sequence < sequence)
  return !previous.some((p) => p.status !== 'confirmed')
}

/** @deprecated use canPayInstallment */
export function canReportSecondInstallment(
  enrollment: EnrollmentForDue,
  payments: PaymentRow[],
  midCourseDate: Date | null
): boolean {
  return canPayInstallment(enrollment, payments, 2, midCourseDate)
}

export function getAmountDue(
  enrollment: EnrollmentForDue,
  payments: PaymentRow[],
  midCourseDate: Date | null
): { sequence: number; amountToman: number } | null {
  const progress = getPaymentProgress(payments)
  if (progress.phase !== 'due') return null

  if (!canPayInstallment(enrollment, payments, progress.sequence, midCourseDate)) {
    return null
  }

  const payment = payments.find((p) => p.sequence === progress.sequence)
  if (!payment) return null
  return { sequence: payment.sequence, amountToman: payment.amountToman }
}

export function isPaymentReviewPhase(enrollment: EnrollmentForDue, payments: PaymentRow[]): boolean {
  return getPaymentProgress(payments).phase === 'review'
}

export function isPaymentFlowStatus(status: string): boolean {
  return (
    status === 'pending_payment_1' ||
    status === 'pending_payment_2' ||
    status === 'payment_1_review' ||
    status === 'payment_2_review'
  )
}

export function enrollmentStatusForProgress(
  progress: PaymentProgress,
  payments: PaymentRow[]
): string {
  if (progress.phase === 'review') {
    return progress.sequence === 1 ? 'payment_1_review' : 'payment_2_review'
  }
  if (progress.phase === 'done') return 'active'

  const hasConfirmed = payments.some((p) => p.status === 'confirmed')
  if (hasConfirmed) return 'active'

  return progress.sequence === 1 ? 'pending_payment_1' : 'pending_payment_2'
}

export function hasPartialPayment(payments: PaymentRow[]): boolean {
  const progress = getPaymentProgress(payments)
  return payments.some((p) => p.status === 'confirmed') && progress.phase !== 'done'
}

export function formatInstallmentLabel(sequence: number, total: number): string {
  if (total <= 1) return 'پرداخت دوره'
  return `قسط ${sequence.toLocaleString('fa-IR')} از ${total.toLocaleString('fa-IR')}`
}

export function computeCourseDates(
  sessions: Pick<StudentSession, 'startsAt' | 'endsAt'>[]
): { courseStartsAt: Date | null; courseEndsAt: Date | null } {
  if (sessions.length === 0) return { courseStartsAt: null, courseEndsAt: null }
  let min = new Date(sessions[0]!.startsAt).getTime()
  let max = new Date(sessions[0]!.endsAt).getTime()
  for (const s of sessions) {
    const st = new Date(s.startsAt).getTime()
    const en = new Date(s.endsAt).getTime()
    if (st < min) min = st
    if (en > max) max = en
  }
  return { courseStartsAt: new Date(min), courseEndsAt: new Date(max) }
}
