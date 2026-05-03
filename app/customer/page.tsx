import Link from 'next/link'
import { count, desc, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  contractAcceptance,
  customerOrder,
  db,
  supportTicket,
} from '@/lib/db'

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions)
  const customerId = session!.user!.id

  const [ticketCountRow] = await db
    .select({ n: count() })
    .from(supportTicket)
    .where(eq(supportTicket.customerId, customerId))
  const ticketTotal = Number(ticketCountRow?.n ?? 0)

  const [latestOrder] = await db
    .select()
    .from(customerOrder)
    .where(eq(customerOrder.customerId, customerId))
    .orderBy(desc(customerOrder.updatedAt))
    .limit(1)

  let pendingContract = false
  if (latestOrder?.status === 'paid') {
    const [ca] = await db
      .select({ id: contractAcceptance.id })
      .from(contractAcceptance)
      .where(eq(contractAcceptance.orderId, latestOrder.id))
      .limit(1)
    pendingContract = !ca
  }

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">داشبورد</h2>
      <p className="text-sm text-gray-500 mb-8">خلاصه وضعیت حساب شما</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/customer/tickets"
          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-brand/30 transition-colors"
        >
          <div className="text-2xl font-bold text-gray-900">{ticketTotal}</div>
          <div className="text-sm text-gray-500 mt-1">تیکت‌های شما (همه)</div>
        </Link>
        <Link
          href="/customer/orders"
          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-brand/30 transition-colors"
        >
          <div className="text-sm font-medium text-gray-900 truncate">
            {latestOrder ? `آخرین: ${latestOrder.status}` : 'سفارشی نیست'}
          </div>
          <div className="text-sm text-gray-500 mt-1">سفارش‌ها</div>
        </Link>
        <Link
          href="/customer/plans"
          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-brand/30 transition-colors"
        >
          <div className="text-sm font-medium text-brand">خرید پلن جدید</div>
          <div className="text-sm text-gray-500 mt-1">سرویس و پرداخت آنلاین</div>
        </Link>
      </div>

      {pendingContract && latestOrder && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900 mb-6">
          پرداخت شما ثبت شد. برای ادامه،{' '}
          <Link href={`/customer/orders/${latestOrder.id}/contract`} className="font-semibold underline">
            قرارداد را مطالعه و تأیید کنید
          </Link>
          .
        </div>
      )}
    </div>
  )
}
