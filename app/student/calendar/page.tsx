import { StudentCalendarList } from '@/components/student/StudentCalendarList'
import { getStudentPortalData } from '@/lib/student-portal-data'

export default async function StudentCalendarPage() {
  const data = await getStudentPortalData()

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">تقویم جلسات</h2>
      {data.enrollment ? (
        <StudentCalendarList
          sessions={data.sessions}
          courseStartsAt={data.enrollment.courseStartsAt}
          courseEndsAt={data.enrollment.courseEndsAt}
          sessionsCompletedCount={data.enrollment.sessionsCompletedCount}
        />
      ) : (
        <p className="text-sm text-gray-500">دوره‌ای ثبت نشده است.</p>
      )}
    </div>
  )
}
