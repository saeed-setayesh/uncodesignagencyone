import { getStudentPortalData } from '@/lib/student-portal-data'
import { getInstallmentCount } from '@/lib/student-payment'

export default async function StudentCoursePage() {
  const data = await getStudentPortalData()

  if (!data.enrollment) {
    return (
      <div dir="rtl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">دوره من</h2>
        <p className="text-sm text-gray-500">دوره‌ای ثبت نشده است.</p>
      </div>
    )
  }

  const e = data.enrollment

  return (
    <div dir="rtl" className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-4">دوره من</h2>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{e.courseTitle}</h3>
          <p className="text-sm text-gray-500 mt-1">{e.statusLabel}</p>
        </div>
        {e.courseDescription ? (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {e.courseDescription}
          </div>
        ) : null}
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">تعداد جلسات</dt>
            <dd className="font-medium">{e.sessionCount.toLocaleString('fa-IR')}</dd>
          </div>
          <div>
            <dt className="text-gray-500">جلسات برگزار شده</dt>
            <dd className="font-medium">
              {e.sessionsCompletedCount.toLocaleString('fa-IR')} از{' '}
              {e.sessionCount.toLocaleString('fa-IR')}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">مبلغ دوره</dt>
            <dd className="font-medium">{e.priceToman.toLocaleString('fa-IR')} تومان</dd>
          </div>
          {e.paymentPlan && (
            <div>
              <dt className="text-gray-500">روش پرداخت</dt>
              <dd className="font-medium">
                {(() => {
                  const count = getInstallmentCount(e.paymentPlan, data.payments.length)
                  if (count <= 1) return 'یک‌جا'
                  if (count === 2) return 'دو قسط'
                  return `${count.toLocaleString('fa-IR')} قسط`
                })()}
              </dd>
            </div>
          )}
        </dl>
        {e.jobSlug && (
          <a href={`/learn/${e.jobSlug}`} className="text-sm text-brand font-medium hover:underline">
            مشاهده صفحه آموزش در سایت ←
          </a>
        )}
      </div>
    </div>
  )
}
