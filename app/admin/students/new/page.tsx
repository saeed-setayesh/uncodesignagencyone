import Link from 'next/link'
import StudentAdminForm from '@/components/admin/StudentAdminForm'

export default function NewStudentPage() {
  return (
    <div dir="rtl">
      <Link href="/admin/students" className="text-sm text-gray-500 hover:text-brand mb-4 inline-block">
        ← بازگشت
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-6">دانشجوی جدید</h2>
      <StudentAdminForm />
    </div>
  )
}
