import { z } from 'zod'

export const PricingPlanSchema = z.object({
  name: z.string(),
  description: z.string(),
  priceLabel: z.string(),
  originalPriceLabel: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  features: z.array(z.string()),
})

export const PricingPlansSchema = z.array(PricingPlanSchema).length(4)

export type PricingPlan = z.infer<typeof PricingPlanSchema>
export type PricingPlans = z.infer<typeof PricingPlansSchema>
