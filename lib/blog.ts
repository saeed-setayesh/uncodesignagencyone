import { z } from 'zod'

export const blogPostBodySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'اسلاگ فقط حروف انگلیسی کوچک و خط تیره'),
  title: z.string().min(1).max(300),
  excerpt: z.string().min(1).max(800),
  body: z.string().min(1),
  serviceCategory: z.string().min(1).max(120),
  published: z.boolean(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(200).optional(),
})

export type BlogPostBodyInput = z.infer<typeof blogPostBodySchema>

export function normalizeBlogMeta(input: BlogPostBodyInput) {
  const metaTitle = input.metaTitle?.trim() || null
  const metaDescription = input.metaDescription?.trim() || null
  return {
    ...input,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
  }
}
