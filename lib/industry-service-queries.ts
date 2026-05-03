import { and, arrayContains, eq, type SQL } from 'drizzle-orm'
import { industry } from '@/drizzle/schema'

/** Industries that list this service in the Excel «سرویس‌های پیشنهادی» column (stored as slugs). */
export function whereIndustryOffersService(serviceSlug: string): SQL {
  return and(eq(industry.active, true), arrayContains(industry.suggestedServices, [serviceSlug])) as SQL
}

export function industryOffersService(
  suggestedServices: string[] | null | undefined,
  serviceSlug: string
): boolean {
  return Array.isArray(suggestedServices) && suggestedServices.includes(serviceSlug)
}
