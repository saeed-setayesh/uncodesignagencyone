import { asc, desc, eq } from 'drizzle-orm'
import { db, city, generatedPage, industry, service as serviceTable } from '@/lib/db'
import { getAdminLandingPageStats } from '@/lib/admin-page-stats'
import AdminPagesClient from './AdminPagesClient'

export const revalidate = 0

export default async function AdminPagesPage() {
  const [rows, services, stats] = await Promise.all([
    db
      .select({
        id: generatedPage.id,
        service: generatedPage.service,
        neighborhoodKey: generatedPage.neighborhoodKey,
        cacheVersion: generatedPage.cacheVersion,
        createdAt: generatedPage.createdAt,
        updatedAt: generatedPage.updatedAt,
        industryFa: industry.fa,
        industrySlug: industry.slug,
        cityFa: city.fa,
        citySlug: city.slug,
      })
      .from(generatedPage)
      .innerJoin(industry, eq(generatedPage.industryId, industry.id))
      .innerJoin(city, eq(generatedPage.cityId, city.id))
      .orderBy(desc(generatedPage.updatedAt)),
    db
      .select({ slug: serviceTable.slug, fa: serviceTable.fa })
      .from(serviceTable)
      .where(eq(serviceTable.active, true))
      .orderBy(asc(serviceTable.sortOrder)),
    getAdminLandingPageStats(db),
  ])

  const pages = rows.map((r) => ({
    id: r.id,
    service: r.service,
    neighborhoodKey: r.neighborhoodKey,
    cacheVersion: r.cacheVersion,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    industry: { fa: r.industryFa, slug: r.industrySlug },
    city: { fa: r.cityFa, slug: r.citySlug },
  }))

  return <AdminPagesClient initialPages={pages} services={services} stats={stats} />
}
