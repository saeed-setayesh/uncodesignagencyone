import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StudentStepper } from '@/components/student/StudentStepper'
import { StudentPortalActions } from '@/components/student/StudentPortalActions'
import { getStudentPortalData } from '@/lib/student-portal-data'

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions)
  const data = await getStudentPortalData()

  if (!data.enrollment) {
    return (
      <div dir="rtl">
        <h2 className="text-xl font-bold text-gray-900 mb-2">داشبورد</h2>
        <p className="text-sm text-gray-500">هنوز دوره‌ای برای حساب شما ثبت نشده است.</p>
      </div>
    )
  }

  const e = data.enrollment

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-1">سلام {session?.user?.name || 'دانشجو'}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {e.courseTitle} — {e.statusLabel}
      </p>

      <StudentStepper
        status={e.status}
        hasConfirmedPayment={data.payments.some((p) => p.status === 'confirmed')}
      />

      <StudentPortalActions
        enrollment={e}
        payments={data.payments}
        midCourseDate={data.midCourseDate}
        amountDue={data.amountDue}
        showPaymentDetails={data.showPaymentDetails}
      />
    </div>
  )
}
