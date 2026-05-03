import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { city, db, generatedPage, industry, neighborhood, service as serviceTable } from '@/lib/db'
import PageForm from '../../_components/PageForm'
import type { PageContent } from '@/types/content'

type Props = { params: Promise<{ id: string }> }

export default async function EditPagePage({ params }: Props) {
  const { id } = await params
  const [pageRows, industries, cities, services, hoods] = await Promise.all([
    db
      .select({ page: generatedPage, ind: industry, c: city })
      .from(generatedPage)
      .innerJoin(industry, eq(generatedPage.industryId, industry.id))
      .innerJoin(city, eq(generatedPage.cityId, city.id))
      .where(eq(generatedPage.id, id))
      .limit(1),
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

  const found = pageRows[0]
  if (!found) notFound()
  const page = found.page
  const pageIndustry = found.ind
  const pageCity = found.c

  const serviceOptions = services.map((s) => ({ value: s.slug, label: s.fa }))

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">ویرایش صفحه</h2>
      <p className="text-sm text-gray-500 mb-6">
        {pageIndustry.fa} — {pageCity.fa}
      </p>
      <PageForm
        industries={industries}
        cities={cities}
        serviceOptions={serviceOptions}
        neighborhoods={hoods}
        initialData={{
          id: page.id,
          service: page.service,
          industryId: page.industryId,
          cityId: page.cityId,
          neighborhoodKey: page.neighborhoodKey,
          content: page.content as PageContent,
        }}
      />
    </div>
  )
}
