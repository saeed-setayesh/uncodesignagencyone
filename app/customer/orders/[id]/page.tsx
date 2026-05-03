import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { contractAcceptance, customerOrder, db, paymentTransaction } from '@/lib/db'
import { PayButton } from './PayButton'

const statusFa: Record<string, string> = {
  draft: 'پیش‌نویس',
  pending_payment: 'در انتظار پرداخت',
  paid: 'پرداخت‌شده',
  cancelled: 'لغوشده',
  failed: 'ناموفق',
}

export default async function CustomerOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ pay?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const session = await getServerSession(authOptions)
  const [order] = await db
    .select()
    .from(customerOrder)
    .where(eq(customerOrder.id, id))
    .limit(1)
  if (!order || order.customerId !== session!.user!.id) notFound()

  const payments = await db
    .select()
    .from(paymentTransaction)
    .where(eq(paymentTransaction.orderId, id))
    .orderBy(desc(paymentTransaction.createdAt))

  const [accepted] = await db
    .select({ id: contractAcceptance.id })
    .from(contractAcceptance)
    .where(eq(contractAcceptance.orderId, id))
    .limit(1)

  const snap = order.planSnapshot as { plan?: { name?: string }; serviceFa?: string }
  const canPay = order.status === 'pending_payment' || order.status === 'draft'
  const needsContract = order.status === 'paid' && !accepted

  return (
    <div dir="rtl">
      <Link href="/customer/orders" className="text-sm text-brand hover:underline mb-4 inline-block">
        ← سفارش‌ها
      </Link>

      {sp.pay === 'success' && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
          پرداخت با موفقیت انجام شد.
        </div>
      )}
      {sp.pay === 'failed' && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">
          پرداخت ناموفق بود یا لغو شد.
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {snap?.serviceFa} — {snap?.plan?.name ?? `پلن ${order.planIndex}`}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        وضعیت: {statusFa[order.status] ?? order.status} · مبلغ: {order.amountRial.toLocaleString('fa-IR')} ریال
      </p>

      <PayButton orderId={order.id} canPay={canPay} />

      {needsContract && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
          <p className="text-sm text-amber-900 mb-2">برای تکمیل فرآیند، قرارداد را تأیید کنید.</p>
          <Link
            href={`/customer/orders/${order.id}/contract`}
            className="inline-block bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            مطالعه و تأیید قرارداد
          </Link>
        </div>
      )}

      {accepted && (
        <p className="mt-6 text-sm text-green-700">قرارداد این سفارش تأیید شده است.</p>
      )}

      {payments.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">تراکنش‌ها</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {payments.map((p) => (
              <li key={p.id} className="font-mono text-xs">
                {p.status} · authority: {p.authority ?? '—'} · ref: {p.refId ?? '—'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
