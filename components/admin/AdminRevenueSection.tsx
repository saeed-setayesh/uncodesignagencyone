import Link from 'next/link'
import { ArrowLeft, Banknote, Clock, TrendingUp, Wallet } from 'lucide-react'
import type { AdminRevenueStats } from '@/lib/admin-revenue-stats'
import { formatRevenueToman } from '@/lib/admin-revenue-stats'

type Props = {
  stats: AdminRevenueStats
  /** Compact card on dashboard vs full page */
  variant?: 'dashboard' | 'page'
}

export default function AdminRevenueSection({ stats, variant = 'dashboard' }: Props) {
  const maxTimeline = Math.max(...stats.timeline.map((p) => p.totalToman), 1)
  const isPage = variant === 'page'
  const cutLabel = `${stats.platformCutPercent.toLocaleString('fa-IR')}٪`

  return (
    <section
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${
        isPage ? '' : 'mb-8'
      }`}
      dir="rtl"
      aria-label="درآمد و تراکنش‌ها"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Banknote className="w-5 h-5" aria-hidden />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">درآمد و تراکنش‌ها</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              بر اساس پرداخت‌های تأییدشدهٔ دانشجویان
            </p>
          </div>
        </div>
        {!isPage && (
          <Link
            href="/admin/revenue"
            className="text-sm font-semibold text-brand hover:underline inline-flex items-center gap-1"
          >
            جزئیات کامل
            <ArrowLeft className="w-4 h-4" aria-hidden />
          </Link>
        )}
      </div>

      <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-4">
          <div className="text-xs text-emerald-800/80 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden />
            کل درآمد تأییدشده
          </div>
          <div className="text-lg md:text-xl font-black text-emerald-900 leading-snug">
            {formatRevenueToman(stats.totalConfirmedToman)}
          </div>
          <div className="text-[11px] text-emerald-700/70 mt-1">
            {stats.confirmedPaymentCount.toLocaleString('fa-IR')} تراکنش
          </div>
        </div>

        <div className="rounded-xl bg-brand-light/50 border border-brand/15 p-4">
          <div className="text-xs text-brand-dark/80 mb-1">درآمد این ماه</div>
          <div className="text-lg md:text-xl font-black text-brand-dark leading-snug">
            {formatRevenueToman(stats.thisMonthToman)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {stats.thisMonthCount.toLocaleString('fa-IR')} پرداخت تأیید شده
          </div>
        </div>

        <div className="rounded-xl bg-amber-50/80 border border-amber-100 p-4">
          <div className="text-xs text-amber-900/80 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden />
            در انتظار تأیید
          </div>
          <div className="text-lg md:text-xl font-black text-amber-950 leading-snug">
            {formatRevenueToman(stats.pendingReportedToman)}
          </div>
          <div className="text-[11px] text-amber-800/70 mt-1">
            {stats.pendingReportedCount.toLocaleString('fa-IR')} گزارش پرداخت
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-600 mb-1">میانگین هر تراکنش</div>
          <div className="text-lg md:text-xl font-black text-slate-900 leading-snug">
            {stats.confirmedPaymentCount > 0
              ? formatRevenueToman(Math.round(stats.totalConfirmedToman / stats.confirmedPaymentCount))
              : '—'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">پس از تأیید ادمین</div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-l from-emerald-50/80 to-white p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-emerald-800/90 mb-1 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" aria-hidden />
                سهم پلتفرم ({cutLabel})
              </div>
              <div className="text-xl md:text-2xl font-black text-emerald-900 leading-snug">
                {formatRevenueToman(stats.totalExpectedPlatformCutToman)}
              </div>
              <p className="text-xs text-emerald-800/70 mt-2 max-w-xl">
                {cutLabel} از هر پرداخت دوره — شامل دریافت‌شده، در انتظار تأیید، و اقساط آینده.
              </p>
            </div>
            <div className="text-xs text-gray-600 bg-white/80 border border-emerald-100 rounded-lg px-3 py-2 space-y-1 min-w-[11rem]">
              <div className="flex justify-between gap-4">
                <span>دریافت‌شده</span>
                <span className="font-bold text-emerald-800 tabular-nums">
                  {formatRevenueToman(stats.confirmedPlatformCutToman)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>در انتظار تأیید</span>
                <span className="font-bold text-amber-800 tabular-nums">
                  {formatRevenueToman(stats.pendingReportedPlatformCutToman)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>پرداخت آینده</span>
                <span className="font-bold text-slate-700 tabular-nums">
                  {formatRevenueToman(stats.upcomingPendingPlatformCutToman)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <h4 className="text-sm font-bold text-gray-900 mb-3">روند ۱۲ ماه اخیر (تأیید شده)</h4>
        {stats.totalConfirmedToman === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center bg-slate-50 rounded-xl">
            هنوز پرداخت تأییدشده‌ای ثبت نشده است.
          </p>
        ) : (
          <div className="flex items-end gap-1.5 md:gap-2 h-36 pt-2">
            {stats.timeline.map((point) => {
              const heightPct =
                point.totalToman > 0 ? Math.max(8, (point.totalToman / maxTimeline) * 100) : 4
              return (
                <div key={point.monthKey} className="flex-1 min-w-0 flex flex-col items-center gap-1 h-full">
                  <span
                    className="text-[10px] text-gray-500 tabular-nums truncate w-full text-center"
                    title={formatRevenueToman(point.totalToman)}
                  >
                    {point.totalToman > 0
                      ? `${(point.totalToman / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}M`
                      : '—'}
                  </span>
                  <div className="flex-1 w-full flex items-end justify-center">
                    <div
                      className={`w-full max-w-[2.5rem] rounded-t-md transition-all ${
                        point.totalToman > 0 ? 'bg-brand' : 'bg-slate-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${point.label}: ${formatRevenueToman(point.totalToman)} (${point.paymentCount} تراکنش)`}
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] text-gray-500 truncate w-full text-center">
                    {point.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {stats.recentTransactions.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-5 py-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900">آخرین تراکنش‌های تأییدشده</h4>
            {!isPage && stats.recentTransactions.length >= 5 && (
              <Link href="/admin/revenue" className="text-xs text-brand hover:underline">
                همه
              </Link>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm hover:bg-slate-50/50"
              >
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {tx.studentName || 'دانشجو'} — {tx.courseTitle}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    قسط {tx.sequence.toLocaleString('fa-IR')} ·{' '}
                    {tx.confirmedAt.toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formatRevenueToman(tx.amountToman)}
                  </span>
                  <Link
                    href={`/admin/students/${tx.studentId}`}
                    className="text-xs text-brand hover:underline"
                  >
                    جزئیات
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
