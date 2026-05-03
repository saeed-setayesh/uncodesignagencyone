import { parseServicePricingPlans } from '@/lib/parse-pricing-plans'
import type { Service } from '@/lib/db'

/** Same multipliers as `buildDefaultPricingPlans` (toman base prices). */
const TIER_MULTIPLIER: Record<number, number> = {
  1: 0.88,
  2: 1,
  3: 1.2,
}

const BASE_TOMAN: [number, number, number] = [12_000_000, 24_000_000, 40_000_000]

/** Rial amount for checkout (plan indices 0–2). Index 3 is organizational / RFP — not payable online. */
export function getPlanAmountRial(service: Service, planIndex: number): number | null {
  if (planIndex < 0 || planIndex > 3) return null
  if (planIndex === 3) return null

  const tier = TIER_MULTIPLIER[service.priceTier] != null ? service.priceTier : 2
  const mult = TIER_MULTIPLIER[tier] ?? 1
  const tomans = Math.round(BASE_TOMAN[planIndex]! * mult)
  return tomans * 10
}

export function getPlanSnapshotForOrder(service: Service, planIndex: number) {
  const plans = parseServicePricingPlans(service.pricingPlans, service.priceTier)
  const plan = plans[planIndex]
  if (!plan) return null
  return { plan, serviceFa: service.fa, serviceSlug: service.slug }
}
