import { count, eq, sql } from 'drizzle-orm'
import { city, generatedPage, industry, neighborhood, service, type AppDb } from '@/lib/db'
import { industryOffersService } from '@/lib/industry-service-queries'

export type AdminLandingPageStats = {
  /** تعداد رکورد در `generatedPage` */
  stored: number
  /**
   * حداکثر مسیرهای ممکن: برای هر سرویس، فقط صنف‌هایی که آن سرویس در suggestedServices دارند
   * × (برای هر شهر: یک صفحه سطح شهر + یک صفحه به‌ازای هر محله فعال).
   */
  theoreticalMax: number
  /** فقط صفحه سطح شهر (بدون ردیف جدا برای محله) */
  theoreticalCityLevelOnly: number
  servicesActive: number
  citiesActive: number
  industriesActive: number
}

/**
 * همان منطق فیلتر صنف در `PageForm` (industryOffersService)
 * برای هر شهر: ۱ + تعداد محله‌های فعال
 */
export async function getAdminLandingPageStats(client: AppDb): Promise<AdminLandingPageStats> {
  const [services, industries, activeCities, storedRow] = await Promise.all([
    client.select({ slug: service.slug }).from(service).where(eq(service.active, true)),
    client
      .select({ suggestedServices: industry.suggestedServices })
      .from(industry)
      .where(eq(industry.active, true)),
    client.select({ id: city.id }).from(city).where(eq(city.active, true)),
    client.select({ c: count() }).from(generatedPage),
  ])

  const stored = Number(storedRow[0]?.c ?? 0)

  const neighRows = await client
    .select({
      cityId: neighborhood.cityId,
      n: sql<number>`count(*)::int`,
    })
    .from(neighborhood)
    .where(eq(neighborhood.active, true))
    .groupBy(neighborhood.cityId)

  const neighByCity = new Map(neighRows.map((r) => [r.cityId, r.n]))
  const sumSlotsPerServiceIndustry = activeCities.reduce(
    (acc, c) => acc + 1 + (neighByCity.get(c.id) ?? 0),
    0
  )

  let theoreticalMax = 0
  let theoreticalCityLevelOnly = 0
  for (const s of services) {
    const indN = industries.filter((i) => industryOffersService(i.suggestedServices, s.slug)).length
    theoreticalMax += indN * sumSlotsPerServiceIndustry
    theoreticalCityLevelOnly += indN * activeCities.length
  }

  return {
    stored,
    theoreticalMax,
    theoreticalCityLevelOnly,
    servicesActive: services.length,
    citiesActive: activeCities.length,
    industriesActive: industries.length,
  }
}
