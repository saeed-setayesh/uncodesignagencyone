import Link from 'next/link'
import TrainingCertificateAdminForm from '@/components/admin/TrainingCertificateAdminForm'

export default function NewCertificatePage() {
  return (
    <div dir="rtl">
      <Link href="/admin/certificates" className="text-sm text-gray-500 hover:text-brand mb-4 inline-block">
        ← بازگشت
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-2">صدور گواهی جدید</h2>
      <p className="text-sm text-gray-500 mb-6">
        اطلاعات را دستی وارد کنید. گواهی PDF انگلیسی با QR code و اطلاعات Uncodesign صادر می‌شود.
      </p>
      <TrainingCertificateAdminForm />
    </div>
  )
}
