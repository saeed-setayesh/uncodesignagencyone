import { formatToman } from '@/lib/student-payment'
import { formatPerSessionLine } from '@/lib/student-pricing'
import {
  STUDENT_PLATFORM_CUT_PERCENT,
  calcStudentPlatformCut,
} from '@/lib/student-platform-fee'

type Props = {
  teacherName: string
  teacherPhone: string
  paymentBankName: string
  paymentCardNumber: string
  paymentShaba: string
  paymentCardHolder: string
  priceToman: number
  sessionCount: number
  amountDue?: { sequence: number; amountToman: number } | null
}

export function StudentPaymentDetails({
  teacherName,
  teacherPhone,
  paymentBankName,
  paymentCardNumber,
  paymentShaba,
  paymentCardHolder,
  priceToman,
  sessionCount,
  amountDue,
}: Props) {
  const shabaDisplay = paymentShaba.trim()
    ? paymentShaba.trim().startsWith('IR')
      ? paymentShaba.trim()
      : `IR${paymentShaba.replace(/\s/g, '')}`
    : ''

  return (
    <div className="space-y-4">
      {amountDue ? (
        <p className="text-2xl font-bold text-brand">
          {formatToman(amountDue.amountToman)} تومان
          <span className="block text-sm font-normal text-gray-500 mt-1">
            مبلغ قسط {amountDue.sequence === 1 ? 'اول' : 'دوم'}
          </span>
          <span className="block text-xs font-normal text-gray-500 mt-2 leading-relaxed">
            {STUDENT_PLATFORM_CUT_PERCENT.toLocaleString('fa-IR')}٪ سهم پلتفرم (
            {formatToman(calcStudentPlatformCut(amountDue.amountToman))} تومان) ·{' '}
            {formatToman(amountDue.amountToman - calcStudentPlatformCut(amountDue.amountToman))} تومان
            سهم مربی
          </span>
        </p>
      ) : null}

      <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-800 space-y-3 font-vazir">
        <p>
          <span className="text-gray-500">مربی: </span>
          {teacherName || '—'}
          {teacherPhone ? (
            <span className="text-gray-600" dir="ltr">
              {' '}
              — {teacherPhone}
            </span>
          ) : null}
        </p>
        <p>
          <span className="text-gray-500">بانک: </span>
          {paymentBankName || '—'}
        </p>
        <p>
          <span className="text-gray-500">به نام: </span>
          {paymentCardHolder || '—'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200">
          <div className="min-w-0">
            <div className="text-gray-500 text-xs mb-1">شماره کارت</div>
            <div dir="ltr" className="font-vazir text-base tracking-wide break-all text-left">
              {paymentCardNumber || '—'}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-gray-500 text-xs mb-1">شبا</div>
            <div dir="ltr" className="font-vazir text-base tracking-wide break-all text-left">
              {shabaDisplay || '—'}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        مبلغ کل دوره: {formatToman(priceToman)} تومان
        <br />
        {formatPerSessionLine(priceToman, sessionCount)}
        <br />
        {STUDENT_PLATFORM_CUT_PERCENT.toLocaleString('fa-IR')}٪ از هر پرداخت سهم پلتفرم آنکو
        دیزاین است؛ مابقی به مربی دوره تعلق دارد.
      </p>
    </div>
  )
}
