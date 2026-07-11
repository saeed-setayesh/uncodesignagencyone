'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { renderStudentContract } from '@/lib/student-course-contract'
import {
  formatToman,
  formatInstallmentLabel,
  formatMidCoursePaymentHint,
  getInstallmentCount,
  getMidCourseSessionNumber,
  getPaymentProgress,
  hasPartialPayment,
} from '@/lib/student-payment'
import { formatPerSessionLine } from '@/lib/student-pricing'
import { StudentPaymentDetails } from '@/components/student/StudentPaymentDetails'

type Enrollment = {
  id: string
  courseTitle: string
  courseDescription: string
  sessionCount: number
  priceToman: number
  paymentPlan: string | null
  teacherName: string
  teacherPhone: string
  paymentCardNumber: string
  paymentShaba: string
  paymentCardHolder: string
  paymentBankName: string
  status: string
  jobSlug: string | null
}

type Payment = {
  id: string
  sequence: number
  amountToman: number
  status: string
}

type Props = {
  enrollment: Enrollment
  payments: Payment[]
  midCourseDate: string | null
  amountDue: { sequence: number; amountToman: number } | null
  showPaymentDetails: boolean
}

export function StudentPortalActions({
  enrollment,
  payments,
  midCourseDate,
  amountDue,
  showPaymentDetails,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)

  async function post(path: string, body?: object) {
    setError('')
    setLoading(true)
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'خطا رخ داد')
      return false
    }
    router.refresh()
    return true
  }

  const contractText = renderStudentContract({
    courseTitle: enrollment.courseTitle,
    sessionCount: enrollment.sessionCount,
    priceToman: enrollment.priceToman,
    teacherName: enrollment.teacherName,
  })

  const half = Math.floor(enrollment.priceToman / 2)
  const secondHalf = enrollment.priceToman - half
  const progress = getPaymentProgress(payments)
  const installmentTotal = getInstallmentCount(enrollment.paymentPlan, payments.length)
  const courseStarted = payments.some((p) => p.status === 'confirmed')
  const partiallyPaid = hasPartialPayment(payments)
  const fullyPaid = progress.phase === 'done'
  const inReview = progress.phase === 'review'
  const canPayNow = Boolean(amountDue && showPaymentDetails && !inReview)
  const midCourseHint =
    amountDue && midCourseDate
      ? formatMidCoursePaymentHint({
          sequence: amountDue.sequence,
          installmentTotal,
          midCourseDate: new Date(midCourseDate),
          sessionCount: enrollment.sessionCount,
        })
      : null
  const midSession = getMidCourseSessionNumber(enrollment.sessionCount)

  if (enrollment.status === 'pending_contract') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">قرارداد دوره</h3>
        <div className="text-sm text-gray-700 whitespace-pre-wrap font-vazir leading-relaxed mb-4 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
          {contractText}
        </div>
        <p className="text-xs text-gray-500 mb-4 font-vazir">
          {formatPerSessionLine(enrollment.priceToman, enrollment.sessionCount)}
        </p>
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          متن قرارداد را مطالعه کردم و می‌پذیرم
        </label>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button
          type="button"
          disabled={!accepted || loading}
          onClick={() => post('/api/student/enrollment/accept-contract', { accepted: true })}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {loading ? '...' : 'تأیید قرارداد'}
        </button>
      </div>
    )
  }

  if (enrollment.status === 'pending_payment_plan') {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">انتخاب روش پرداخت</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => post('/api/student/enrollment/payment-plan', { plan: 'full' })}
            className="bg-white border-2 border-gray-200 hover:border-brand rounded-xl p-5 text-right transition-colors"
          >
            <div className="font-bold text-gray-900 mb-1">پرداخت کامل</div>
            <p className="text-sm text-gray-600">{formatToman(enrollment.priceToman)} تومان یک‌جا</p>
            <p className="text-xs text-gray-400 mt-2 font-vazir">
              {formatPerSessionLine(enrollment.priceToman, enrollment.sessionCount)}
            </p>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => post('/api/student/enrollment/payment-plan', { plan: 'split' })}
            className="bg-white border-2 border-gray-200 hover:border-brand rounded-xl p-5 text-right transition-colors"
          >
            <div className="font-bold text-gray-900 mb-1">دو قسط ۵۰٪</div>
            <p className="text-sm text-gray-600">
              {formatToman(half)} ابتدا + {formatToman(secondHalf)} از میانه دوره
            </p>
            <p className="text-xs text-gray-400 mt-2 font-vazir">
              {formatPerSessionLine(enrollment.priceToman, enrollment.sessionCount)}
            </p>
            {midCourseDate ? (
              <p className="text-xs text-gray-400 mt-2">
                میانه (جلسه {midSession.toLocaleString('fa-IR')}):{' '}
                {new Date(midCourseDate).toLocaleDateString('fa-IR')}
              </p>
            ) : null}
            <p className="text-xs text-brand/80 mt-2">
              قسط دوم را هر زمان بخواهید می‌توانید بپردازید — منتظر میانه دوره نمانید.
            </p>
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  const paymentSection =
    inReview ? (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-900">
        پرداخت شما ثبت شد و در انتظار تأیید مدیریت است.
        {courseStarted ? ' دوره هم‌اکنون فعال است.' : ' پس از تأیید، دوره فعال می‌شود.'}
      </div>
    ) : canPayNow ? (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">
          {formatInstallmentLabel(amountDue!.sequence, installmentTotal)}
        </h3>
        <StudentPaymentDetails
          teacherName={enrollment.teacherName}
          teacherPhone={enrollment.teacherPhone}
          paymentBankName={enrollment.paymentBankName}
          paymentCardNumber={enrollment.paymentCardNumber}
          paymentShaba={enrollment.paymentShaba}
          paymentCardHolder={enrollment.paymentCardHolder}
          priceToman={enrollment.priceToman}
          sessionCount={enrollment.sessionCount}
          amountDue={amountDue}
        />
        {midCourseHint ? (
          <p className="text-xs text-brand bg-brand/5 border border-brand/15 rounded-lg px-3 py-2 leading-relaxed">
            {midCourseHint}
          </p>
        ) : null}
        <p className="text-xs text-gray-500">پس از واریز، دکمه زیر را بزنید تا ادمین تأیید کند.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            post('/api/student/enrollment/report-payment', {
              sequence: amountDue!.sequence,
            })
          }
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          {loading ? '...' : 'پرداخت را انجام دادم'}
        </button>
      </div>
    ) : null

  if (courseStarted || enrollment.status === 'active' || enrollment.status === 'completed') {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-sm text-green-900 space-y-2">
          {enrollment.status === 'completed' ? (
            <>
              <p className="font-semibold">دوره با موفقیت تکمیل شد.</p>
              <a href="/student/certificate" className="inline-block text-brand font-medium hover:underline">
                مشاهده و دانلود گواهی ←
              </a>
            </>
          ) : (
            <>
              <p className="font-semibold">دوره شما فعال است.</p>
              <p>جلسات را از بخش تقویم مشاهده کنید.</p>
              {partiallyPaid && (
                <p className="text-xs text-green-800/80 pt-1">
                  {installmentTotal === 2 && midCourseDate ? (
                    <>
                      قسط دوم معمولاً از جلسه {midSession.toLocaleString('fa-IR')} (
                      {new Date(midCourseDate).toLocaleDateString('fa-IR')}) است — هر زمان بخواهید
                      می‌توانید زودتر پرداخت کنید.
                    </>
                  ) : (
                    <>
                      هنوز{' '}
                      {Math.max(
                        0,
                        installmentTotal - payments.filter((p) => p.status === 'confirmed').length
                      ).toLocaleString('fa-IR')}{' '}
                      قسط باقی مانده — هر زمان بخواهید می‌توانید پرداخت کنید.
                    </>
                  )}
                </p>
              )}
            </>
          )}
          {enrollment.jobSlug && (
            <a href={`/learn/${enrollment.jobSlug}`} className="block text-brand font-medium hover:underline">
              صفحه معرفی دوره در سایت
            </a>
          )}
        </div>
        {paymentSection}
      </div>
    )
  }

  if (fullyPaid) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-sm text-green-900">
        <p className="font-semibold">پرداخت دوره تکمیل شد.</p>
      </div>
    )
  }

  return paymentSection
}
