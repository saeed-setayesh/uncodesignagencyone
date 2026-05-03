import { desc, eq } from 'drizzle-orm'
import { customerOrder, customerUser, db, service as serviceTable } from '@/lib/db'

export const revalidate = 0

const statusFa: Record<string, string> = {
  draft: 'پیش‌نویس',
  pending_payment: 'در انتظار پرداخت',
  paid: 'پرداخت‌شده',
  cancelled: 'لغوشده',
  failed: 'ناموفق',
}

export default async function AdminOrdersPage() {
  const rows = await db
    .select({
      order: customerOrder,
      customerEmail: customerUser.email,
      serviceFa: serviceTable.fa,
    })
    .from(customerOrder)
    .innerJoin(customerUser, eq(customerOrder.customerId, customerUser.id))
    .innerJoin(serviceTable, eq(customerOrder.serviceId, serviceTable.id))
    .orderBy(desc(customerOrder.createdAt))

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">سفارش‌های مشتریان</h2>
      <p className="text-sm text-gray-500 mb-6">{rows.length} سفارش</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">مشتری</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">سرویس</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">مبلغ (ریال)</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">وضعیت</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map(({ order, customerEmail, serviceFa }) => {
              const snap = order.planSnapshot as { plan?: { name?: string } }
              return (
                <tr key={order.id}>
                  <td className="px-4 py-3 text-gray-800 font-mono text-xs">{customerEmail}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{serviceFa}</div>
                    <div className="text-xs text-gray-500">{snap?.plan?.name ?? `پلن ${order.planIndex}`}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{order.amountRial.toLocaleString('fa-IR')}</td>
                  <td className="px-4 py-3 text-xs">{statusFa[order.status] ?? order.status}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString('fa-IR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
