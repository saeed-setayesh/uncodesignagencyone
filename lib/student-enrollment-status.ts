export const STUDENT_ENROLLMENT_STATUSES = [
  'draft',
  'pending_contract',
  'pending_payment_plan',
  'pending_payment_1',
  'payment_1_review',
  'pending_payment_2',
  'payment_2_review',
  'active',
  'completed',
] as const

export type StudentEnrollmentStatus = (typeof STUDENT_ENROLLMENT_STATUSES)[number]

export const STUDENT_STATUS_LABELS: Record<StudentEnrollmentStatus, string> = {
  draft: 'پیش‌نویس',
  pending_contract: 'در انتظار قرارداد',
  pending_payment_plan: 'انتخاب روش پرداخت',
  pending_payment_1: 'پرداخت قسط اول',
  payment_1_review: 'بررسی پرداخت اول',
  pending_payment_2: 'پرداخت قسط دوم',
  payment_2_review: 'بررسی پرداخت دوم',
  active: 'دوره فعال',
  completed: 'تکمیل شده',
}

export function isPaymentReviewStatus(status: string): boolean {
  return status === 'payment_1_review' || status === 'payment_2_review'
}
