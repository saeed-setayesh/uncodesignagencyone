import Link from 'next/link'
import { desc, eq, inArray, sql } from 'drizzle-orm'
import { db, studentEnrollment, studentUser } from '@/lib/db'
import { STUDENT_STATUS_LABELS, type StudentEnrollmentStatus, isPaymentReviewStatus } from '@/lib/student-enrollment-status'

export const revalidate = 0

export default async function AdminStudentsPage() {
  const students = await db
    .select({
      id: studentUser.id,
      phone: studentUser.phone,
      name: studentUser.name,
      active: studentUser.active,
      enrollmentId: studentEnrollment.id,
      courseTitle: studentEnrollment.courseTitle,
      status: studentEnrollment.status,
      sessionCount: studentEnrollment.sessionCount,
      sessionsCompletedCount: studentEnrollment.sessionsCompletedCount,
      priceToman: studentEnrollment.priceToman,
    })
    .from(studentUser)
    .leftJoin(studentEnrollment, eq(studentEnrollment.studentId, studentUser.id))
    .orderBy(desc(studentUser.createdAt))

  const pendingRows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(studentEnrollment)
    .where(
      inArray(studentEnrollment.status, ['payment_1_review', 'payment_2_review'] as string[])
    )
  const pendingCount = Number(pendingRows[0]?.c ?? 0)

  return (
    <div dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">دانشجویان</h2>
          <p className="text-sm text-gray-500 mt-1">مدیریت حساب، دوره و پرداخت</p>
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Link
              href="/admin/students?filter=pending"
              className="text-sm bg-amber-100 text-amber-900 px-3 py-2 rounded-lg font-medium"
            >
              {pendingCount.toLocaleString('fa-IR')} پرداخت در انتظار تأیید
            </Link>
          )}
          <Link
            href="/admin/students/new"
            className="bg-brand text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-brand-dark"
          >
            + دانشجوی جدید
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3 font-medium">نام</th>
              <th className="text-right px-4 py-3 font-medium">موبایل</th>
              <th className="text-right px-4 py-3 font-medium">دوره</th>
              <th className="text-right px-4 py-3 font-medium">پیشرفت جلسات</th>
              <th className="text-right px-4 py-3 font-medium">وضعیت</th>
              <th className="text-right px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((s) => {
              const statusLabel = s.status
                ? (STUDENT_STATUS_LABELS[s.status as StudentEnrollmentStatus] ?? s.status)
                : '—'
              const highlight = s.status && isPaymentReviewStatus(s.status)
              return (
                <tr key={s.id} className={highlight ? 'bg-amber-50/50' : ''}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {s.name}
                    {!s.active && (
                      <span className="text-xs text-red-500 mr-2">(غیرفعال)</span>
                    )}
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {s.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.courseTitle ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.sessionCount
                      ? `${(s.sessionsCompletedCount ?? 0).toLocaleString('fa-IR')} / ${s.sessionCount.toLocaleString('fa-IR')}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{statusLabel}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${s.id}`} className="text-brand hover:underline">
                      ویرایش
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">دانشجویی ثبت نشده است.</p>
        )}
      </div>
    </div>
  )
}
