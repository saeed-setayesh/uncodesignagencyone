import { PricingPlansSchema, type PricingPlan } from '@/types/pricing'
import { buildDefaultJobHiringPlans } from '@/lib/default-job-pricing-plans'

export function parseJobPricingPlans(raw: unknown | null | undefined): PricingPlan[] {
  const parsed = PricingPlansSchema.safeParse(raw)
  if (parsed.success) return parsed.data
  return buildDefaultJobHiringPlans()
}
