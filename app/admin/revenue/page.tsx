import Link from 'next/link'
import AdminRevenueSection from '@/components/admin/AdminRevenueSection'
import { getAdminRevenueStats } from '@/lib/admin-revenue-stats'

export const revalidate = 0

export default async function AdminRevenuePage() {
  const stats = await getAdminRevenueStats(50)

  return (
    <div dir="rtl">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-brand hover:underline mb-2 inline-block">
          ← بازگشت به داشبورد
        </Link>
        <h2 className="text-xl font-bold text-gray-900">درآمد و تراکنش‌ها</h2>
        <p className="text-sm text-gray-500 mt-1">
          فقط پرداخت‌هایی که ادمین تأیید کرده — بر اساس تاریخ تأیید
        </p>
      </div>

      <AdminRevenueSection stats={stats} variant="page" />
    </div>
  )
}
