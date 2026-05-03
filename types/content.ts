import { z } from 'zod'

// ─── Zod Schema (validates Claude API responses) ─────────────────────────────

export const PageContentSchema = z.object({
  metaTitle: z.string().max(70),
  metaDescription: z.string().max(165),
  h1: z.string(),
  heroSubtitle: z.string(),
  urgencyText: z.string(),
  stats: z.object({
    projects: z.string(),
    satisfaction: z.string(),
    rating: z.string(),
  }),
  benefits: z.array(
    z.object({
      title: z.string(),
      desc: z.string(),
    })
  ).min(4),
  processSteps: z.array(
    z.object({
      title: z.string(),
      desc: z.string(),
      timing: z.string(),
    })
  ).min(4),
  testimonials: z.array(
    z.object({
      text: z.string(),
      name: z.string(),
      business: z.string(),
      initials: z.string(),
    })
  ).min(2),
  faq: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    })
  ).min(4),
  ctaHeading: z.string(),
  ctaSubtext: z.string(),
  whatsappText: z.string(),
})

// ─── TypeScript Interface ─────────────────────────────────────────────────────

export type PageContent = z.infer<typeof PageContentSchema>
