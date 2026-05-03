import { asc, eq } from 'drizzle-orm'
import { city, db, industry, neighborhood, service as serviceTable } from '@/lib/db'
import PageForm from '../_components/PageForm'

export default async function NewPagePage() {
  const [industries, cities, services, hoods] = await Promise.all([
    db
      .select()
      .from(industry)
      .where(eq(industry.active, true))
      .orderBy(asc(industry.fa)),
    db
      .select()
      .from(city)
      .where(eq(city.active, true))
      .orderBy(asc(city.fa)),
    db
      .select({ slug: serviceTable.slug, fa: serviceTable.fa })
      .from(serviceTable)
      .where(eq(serviceTable.active, true))
      .orderBy(asc(serviceTable.sortOrder)),
    db
      .select({ cityId: neighborhood.cityId, slug: neighborhood.slug, fa: neighborhood.fa })
      .from(neighborhood)
      .where(eq(neighborhood.active, true)),
  ])
  const serviceOptions = services.map((s) => ({ value: s.slug, label: s.fa }))

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">ایجاد صفحه جدید</h2>
      <PageForm
        industries={industries}
        cities={cities}
        serviceOptions={serviceOptions}
        neighborhoods={hoods}
      />
    </div>
  )
}
