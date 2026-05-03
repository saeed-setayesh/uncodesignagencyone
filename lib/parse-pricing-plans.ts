import { PricingPlansSchema, type PricingPlan } from '@/types/pricing'
import { buildDefaultPricingPlans } from '@/lib/default-pricing-plans'

export function parseServicePricingPlans(raw: unknown, priceTierFallback: number): PricingPlan[] {
  const parsed = PricingPlansSchema.safeParse(raw)
  if (parsed.success) return parsed.data
  return buildDefaultPricingPlans(priceTierFallback)
}
