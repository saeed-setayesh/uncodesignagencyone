import { desc, eq, sql } from 'drizzle-orm'
import { db, studentEnrollment, studentPayment, studentUser } from '@/lib/db'
import {
  STUDENT_PLATFORM_CUT_PERCENT,
  calcStudentPlatformCut,
} from '@/lib/student-platform-fee'
import { formatToman } from '@/lib/student-payment'
import { toPersianDigits } from '@/lib/utils'

export type RevenueTimelinePoint = {
  monthKey: string
  label: string
  totalToman: number
  platformCutToman: number
  paymentCount: number
}

export type RecentTransaction = {
  id: string
  amountToman: number
  platformCutToman: number
  confirmedAt: Date
  sequence: number
  studentName: string
  courseTitle: string
  studentId: string
}

export type AdminRevenueStats = {
  platformCutPercent: number
  totalConfirmedToman: number
  confirmedPlatformCutToman: number
  confirmedPaymentCount: number
  thisMonthToman: number
  thisMonthPlatformCutToman: number
  thisMonthCount: number
  pendingReportedToman: number
  pendingReportedPlatformCutToman: number
  pendingReportedCount: number
  upcomingPendingToman: number
  upcomingPendingPlatformCutToman: number
  upcomingPendingCount: number
  totalExpectedPlatformCutToman: number
  timeline: RevenueTimelinePoint[]
  recentTransactions: RecentTransaction[]
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function buildLast12MonthsTimeline(
  raw: { monthKey: string; totalToman: number; paymentCount: number }[]
): RevenueTimelinePoint[] {
  const map = new Map(raw.map((r) => [r.monthKey, r]))
  const points: RevenueTimelinePoint[] = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = monthKey(d)
    const row = map.get(key)
    points.push({
      monthKey: key,
      label: d.toLocaleDateString('fa-IR', { month: 'short', year: '2-digit' }),
      totalToman: row?.totalToman ?? 0,
      platformCutToman: calcStudentPlatformCut(row?.totalToman ?? 0),
      paymentCount: row?.paymentCount ?? 0,
    })
  }

  return points
}

export async function getAdminRevenueStats(recentLimit = 10): Promise<AdminRevenueStats> {
  const [totalsRow, thisMonthRow, pendingRow, upcomingRow, monthlyRows, recentRows] =
    await Promise.all([
    db
      .select({
        total: sql<number>`coalesce(sum(${studentPayment.amountToman}), 0)::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(studentPayment)
      .where(eq(studentPayment.status, 'confirmed')),
    db
      .select({
        total: sql<number>`coalesce(sum(${studentPayment.amountToman}), 0)::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(studentPayment)
      .where(
        sql`${studentPayment.status} = 'confirmed'
          AND ${studentPayment.confirmedAt} >= date_trunc('month', CURRENT_DATE)`
      ),
    db
      .select({
        total: sql<number>`coalesce(sum(${studentPayment.amountToman}), 0)::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(studentPayment)
      .where(eq(studentPayment.status, 'reported')),
    db
      .select({
        total: sql<number>`coalesce(sum(${studentPayment.amountToman}), 0)::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(studentPayment)
      .where(eq(studentPayment.status, 'pending')),
    db
      .select({
        monthKey: sql<string>`to_char(date_trunc('month', ${studentPayment.confirmedAt}), 'YYYY-MM')`,
        totalToman: sql<number>`coalesce(sum(${studentPayment.amountToman}), 0)::int`,
        paymentCount: sql<number>`count(*)::int`,
      })
      .from(studentPayment)
      .where(
        sql`${studentPayment.status} = 'confirmed'
          AND ${studentPayment.confirmedAt} IS NOT NULL
          AND ${studentPayment.confirmedAt} >= (date_trunc('month', CURRENT_DATE) - interval '11 months')`
      )
      .groupBy(sql`date_trunc('month', ${studentPayment.confirmedAt})`)
      .orderBy(sql`date_trunc('month', ${studentPayment.confirmedAt})`),
    db
      .select({
        id: studentPayment.id,
        amountToman: studentPayment.amountToman,
        confirmedAt: studentPayment.confirmedAt,
        sequence: studentPayment.sequence,
        studentName: studentUser.name,
        courseTitle: studentEnrollment.courseTitle,
        studentId: studentUser.id,
      })
      .from(studentPayment)
      .innerJoin(studentEnrollment, eq(studentPayment.enrollmentId, studentEnrollment.id))
      .innerJoin(studentUser, eq(studentEnrollment.studentId, studentUser.id))
      .where(
        sql`${studentPayment.status} = 'confirmed' AND ${studentPayment.confirmedAt} IS NOT NULL`
      )
      .orderBy(desc(studentPayment.confirmedAt))
      .limit(recentLimit),
  ])

  const totalConfirmedToman = Number(totalsRow[0]?.total ?? 0)
  const thisMonthToman = Number(thisMonthRow[0]?.total ?? 0)
  const pendingReportedToman = Number(pendingRow[0]?.total ?? 0)
  const upcomingPendingToman = Number(upcomingRow[0]?.total ?? 0)

  const confirmedPlatformCutToman = calcStudentPlatformCut(totalConfirmedToman)
  const thisMonthPlatformCutToman = calcStudentPlatformCut(thisMonthToman)
  const pendingReportedPlatformCutToman = calcStudentPlatformCut(pendingReportedToman)
  const upcomingPendingPlatformCutToman = calcStudentPlatformCut(upcomingPendingToman)
  const totalExpectedPlatformCutToman =
    confirmedPlatformCutToman +
    pendingReportedPlatformCutToman +
    upcomingPendingPlatformCutToman

  return {
    platformCutPercent: STUDENT_PLATFORM_CUT_PERCENT,
    totalConfirmedToman,
    confirmedPlatformCutToman,
    confirmedPaymentCount: Number(totalsRow[0]?.count ?? 0),
    thisMonthToman,
    thisMonthPlatformCutToman,
    thisMonthCount: Number(thisMonthRow[0]?.count ?? 0),
    pendingReportedToman,
    pendingReportedPlatformCutToman,
    pendingReportedCount: Number(pendingRow[0]?.count ?? 0),
    upcomingPendingToman,
    upcomingPendingPlatformCutToman,
    upcomingPendingCount: Number(upcomingRow[0]?.count ?? 0),
    totalExpectedPlatformCutToman,
    timeline: buildLast12MonthsTimeline(
      monthlyRows.map((r) => ({
        monthKey: r.monthKey,
        totalToman: Number(r.totalToman),
        paymentCount: Number(r.paymentCount),
      }))
    ),
    recentTransactions: recentRows
      .filter((r) => r.confirmedAt)
      .map((r) => ({
        id: r.id,
        amountToman: r.amountToman,
        platformCutToman: calcStudentPlatformCut(r.amountToman),
        confirmedAt: r.confirmedAt!,
        sequence: r.sequence,
        studentName: r.studentName,
        courseTitle: r.courseTitle,
        studentId: r.studentId,
      })),
  }
}

export function formatRevenueToman(amount: number): string {
  return `${toPersianDigits(formatToman(amount))} تومان`
}
