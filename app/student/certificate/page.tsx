import Link from 'next/link'
import { getStudentPortalData } from '@/lib/student-portal-data'

export default async function StudentCertificatePage() {
  const data = await getStudentPortalData()

  if (!data.enrollment || data.enrollment.status !== 'completed' || !data.certificate) {
    return (
      <div dir="rtl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">گواهی دوره</h2>
        <p className="text-sm text-gray-500">
          پس از تکمیل تمام جلسات دوره، گواهی با شماره پیگیری برای شما صادر می‌شود.
        </p>
      </div>
    )
  }

  const cert = data.certificate

  return (
    <div dir="rtl" className="max-w-xl space-y-6">
      <h2 className="text-xl font-bold text-gray-900">گواهی دوره</h2>

      <div className="bg-white rounded-xl border border-brand/20 p-6 shadow-sm space-y-4">
        <p className="text-sm text-gray-600">
          تبریک! دوره <strong className="text-gray-900">{cert.courseTitle}</strong> را با موفقیت
          به پایان رساندید.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">شماره پیگیری</dt>
            <dd className="font-mono font-semibold text-brand" dir="ltr">
              {cert.trackingNumber}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">تاریخ صدور</dt>
            <dd className="font-medium">
              {new Date(cert.issuedAt).toLocaleDateString('fa-IR')}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/api/student/certificate/download?lang=fa"
            className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark"
          >
            دانلود فارسی
          </a>
          <a
            href="/api/student/certificate/download?lang=en"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            Download English
          </a>
        </div>

        <p className="text-xs text-gray-500">
          فایل HTML را باز کنید و از مرورگر «چاپ → ذخیره PDF» استفاده کنید. شماره پیگیری را
          می‌توانید در{' '}
          <Link href="/student/login" className="text-brand hover:underline">
            صفحه ورود دانشجو
          </Link>{' '}
          استعلام کنید.
        </p>
      </div>
    </div>
  )
}
