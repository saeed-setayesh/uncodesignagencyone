import Link from 'next/link'
import { notFound } from 'next/navigation'
import TrainingCertificateAdminForm from '@/components/admin/TrainingCertificateAdminForm'
import {
  getTrainingCertificateById,
  getTrainingCertificateVerifyUrl,
} from '@/lib/training-certificate'

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cert = await getTrainingCertificateById(id)
  if (!cert) notFound()

  return (
    <div dir="rtl">
      <Link href="/admin/certificates" className="text-sm text-gray-500 hover:text-brand mb-4 inline-block">
        ← بازگشت
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">گواهی {cert.studentName}</h2>
          <p className="text-sm text-gray-500 mt-1 font-mono" dir="ltr">
            {cert.trackingNumber}
          </p>
        </div>
        <a
          href={`/api/admin/certificates/${cert.id}/download`}
          className="bg-brand text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-brand-dark"
        >
          دانلود PDF
        </a>
      </div>
      <TrainingCertificateAdminForm
        certificateId={cert.id}
        initial={{
          studentName: cert.studentName,
          skillTitle: cert.skillTitle,
          teacherName: cert.teacherName,
          courseTitle: cert.courseTitle,
          totalHours: cert.totalHours,
          sessionCount: cert.sessionCount,
          courseStartsAt: cert.courseStartsAt?.toISOString() ?? null,
          courseEndsAt: cert.courseEndsAt?.toISOString() ?? null,
          durationText: cert.durationText,
          trackingNumber: cert.trackingNumber,
          verifyUrl: getTrainingCertificateVerifyUrl(cert.trackingNumber),
        }}
      />
    </div>
  )
}
