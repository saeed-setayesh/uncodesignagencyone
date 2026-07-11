import Link from 'next/link'
import StudentAdminForm from '@/components/admin/StudentAdminForm'

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div dir="rtl">
      <Link href="/admin/students" className="text-sm text-gray-500 hover:text-brand mb-4 inline-block">
        ← بازگشت
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-6">ویرایش دانشجو</h2>
      <StudentAdminForm studentId={id} />
    </div>
  )
}
