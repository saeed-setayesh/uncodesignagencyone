import { z } from 'zod'

export const WhatWeDoItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
})

export const OutcomeItemSchema = z.object({
  metric: z.string().min(1),
  description: z.string().min(1),
})

export const ServiceDeliverablesSchema = z.object({
  summary: z.string().min(1),
  whatWeDo: z.array(WhatWeDoItemSchema).min(1),
  tools: z.array(z.string()).min(1),
  outcomes: z.array(OutcomeItemSchema).min(1),
  notIncluded: z.array(z.string()).optional(),
})

export type WhatWeDoItem = z.infer<typeof WhatWeDoItemSchema>
export type OutcomeItem = z.infer<typeof OutcomeItemSchema>
export type ServiceDeliverables = z.infer<typeof ServiceDeliverablesSchema>
