import { StudentPortalActions } from '@/components/student/StudentPortalActions'
import { formatToman } from '@/lib/student-payment'
import { getStudentPortalData } from '@/lib/student-portal-data'

export default async function StudentPaymentPage() {
  const data = await getStudentPortalData()

  if (!data.enrollment) {
    return (
      <div dir="rtl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">پرداخت</h2>
        <p className="text-sm text-gray-500">دوره‌ای ثبت نشده است.</p>
      </div>
    )
  }

  return (
    <div dir="rtl" className="max-w-xl space-y-6">
      <h2 className="text-xl font-bold text-gray-900">پرداخت</h2>

      {data.payments.length > 0 && (
        <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 shadow-sm">
          {data.payments.map((p) => (
            <li key={p.id} className="px-4 py-3 flex justify-between text-sm">
              <span>قسط {p.sequence.toLocaleString('fa-IR')}</span>
              <span>{formatToman(p.amountToman)} تومان</span>
              <span className="text-gray-500">
                {p.status === 'confirmed'
                  ? 'تأیید شده'
                  : p.status === 'reported'
                    ? 'در انتظار تأیید'
                    : 'در انتظار پرداخت'}
              </span>
            </li>
          ))}
        </ul>
      )}

      <StudentPortalActions
        enrollment={data.enrollment}
        payments={data.payments}
        midCourseDate={data.midCourseDate}
        amountDue={data.amountDue}
        showPaymentDetails={data.showPaymentDetails}
      />
    </div>
  )
}
