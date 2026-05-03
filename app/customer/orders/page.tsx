import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { customerOrder, db } from '@/lib/db'

const statusFa: Record<string, string> = {
  draft: 'پیش‌نویس',
  pending_payment: 'در انتظار پرداخت',
  paid: 'پرداخت‌شده',
  cancelled: 'لغوشده',
  failed: 'ناموفق',
}

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions)
  const orders = await db
    .select()
    .from(customerOrder)
    .where(eq(customerOrder.customerId, session!.user!.id))
    .orderBy(desc(customerOrder.createdAt))

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">سفارش‌ها و پرداخت</h2>
      <p className="text-sm text-gray-500 mb-6">تاریخچه خرید پلن‌ها</p>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm mb-4">سفارشی ثبت نشده.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => {
            const snap = o.planSnapshot as { plan?: { name?: string }; serviceFa?: string }
            return (
              <li key={o.id}>
                <Link
                  href={`/customer/orders/${o.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-xl border border-gray-100 p-4 hover:border-brand/30"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {snap?.serviceFa} — {snap?.plan?.name ?? `پلن ${o.planIndex}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {o.amountRial.toLocaleString('fa-IR')} ریال · {new Date(o.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {statusFa[o.status] ?? o.status}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <Link href="/customer/plans" className="inline-block mt-6 text-sm text-brand font-medium hover:underline">
        خرید پلن جدید ←
      </Link>
    </div>
  )
}
