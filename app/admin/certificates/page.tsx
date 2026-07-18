import Link from 'next/link'
import { listTrainingCertificates } from '@/lib/training-certificate'

export const revalidate = 0

export default async function AdminCertificatesPage() {
  const certificates = await listTrainingCertificates()

  return (
    <div dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">گواهی‌های آموزشی</h2>
          <p className="text-sm text-gray-500 mt-1">
            صدور گواهی PDF انگلیسی برای هر فرد — مستقل از پورتال دانشجو
          </p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="bg-brand text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-brand-dark"
        >
          + گواهی جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3 font-medium">دانشجو</th>
              <th className="text-right px-4 py-3 font-medium">مهارت</th>
              <th className="text-right px-4 py-3 font-medium">دوره</th>
              <th className="text-right px-4 py-3 font-medium">شماره گواهی</th>
              <th className="text-right px-4 py-3 font-medium">تاریخ صدور</th>
              <th className="text-right px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {certificates.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{c.studentName}</td>
                <td className="px-4 py-3 text-gray-700">{c.skillTitle}</td>
                <td className="px-4 py-3 text-gray-700">{c.courseTitle}</td>
                <td className="px-4 py-3 font-mono text-xs" dir="ltr">
                  {c.trackingNumber}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(c.issuedAt).toLocaleDateString('en-US')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/certificates/${c.id}`} className="text-brand hover:underline">
                    مشاهده
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {certificates.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">هنوز گواهی صادر نشده است.</p>
        )}
      </div>
    </div>
  )
}
