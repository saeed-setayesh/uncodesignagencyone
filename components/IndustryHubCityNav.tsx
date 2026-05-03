import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { city, db } from '@/lib/db'

interface Props {
  service: string
  industrySlug: string
}

export default async function IndustryHubCityNav({ service, industrySlug }: Props) {
  const cities = await db
    .select()
    .from(city)
    .where(eq(city.active, true))
    .orderBy(asc(city.fa))

  if (cities.length === 0) return null

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-100" aria-label="شهرها">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">موقعیت در شهرها</h2>
        <p className="text-center text-gray-500 text-sm mb-6 max-w-2xl mx-auto leading-relaxed">
          صفحه اختصاصی همین سرویس و صنف در هر شهر؛ روی نام شهر بزنید.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/${service}/${industrySlug}/${city.slug}`}
              className="block text-center py-2.5 px-2 rounded-lg border border-gray-200 bg-white text-sm hover:border-brand hover:text-brand"
            >
              {city.fa}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
