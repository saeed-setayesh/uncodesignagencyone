import { formatToman } from '@/lib/student-payment'

export function getPerSessionPriceToman(priceToman: number, sessionCount: number): number {
  if (sessionCount <= 0) return priceToman
  return Math.floor(priceToman / sessionCount)
}

export function getPerSessionPricingSummary(priceToman: number, sessionCount: number) {
  const perSession = getPerSessionPriceToman(priceToman, sessionCount)
  const allocated = perSession * sessionCount
  const remainder = priceToman - allocated
  return { perSession, remainder }
}

export function formatPerSessionLine(priceToman: number, sessionCount: number): string {
  const { perSession, remainder } = getPerSessionPricingSummary(priceToman, sessionCount)
  if (sessionCount <= 0) return `${formatToman(priceToman)} تومان`
  let line = `${formatToman(perSession)} تومان برای هر جلسه (${sessionCount.toLocaleString('fa-IR')} جلسه)`
  if (remainder > 0) {
    line += ` — جمع کل ${formatToman(priceToman)} تومان`
  }
  return line
}
