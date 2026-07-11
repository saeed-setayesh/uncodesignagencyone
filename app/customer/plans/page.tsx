import { asc, eq } from 'drizzle-orm'
import { db, service as serviceTable } from '@/lib/db'
import { parseServicePricingPlans } from '@/lib/parse-pricing-plans'
import { shouldShowInServiceCatalog } from '@/lib/service-slug-canonical'
import { PlansCheckout } from './PlansCheckout'

export default async function CustomerPlansPage() {
  const rows = await db
    .select({
      id: serviceTable.id,
      fa: serviceTable.fa,
      slug: serviceTable.slug,
      pricingPlans: serviceTable.pricingPlans,
      priceTier: serviceTable.priceTier,
    })
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder), asc(serviceTable.fa))

  const services = rows
    .filter((r) => shouldShowInServiceCatalog(r.slug))
    .map((r) => ({
    id: r.id,
    fa: r.fa,
    slug: r.slug,
    plans: parseServicePricingPlans(r.pricingPlans, r.priceTier),
  }))

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-gray-900 mb-2">خرید پلن</h2>
      <p className="text-sm text-gray-500 mb-8">
        سرویس را انتخاب کنید؛ پس از پرداخت موفق، قرارداد را در جزئیات سفارش تأیید کنید.
      </p>
      <PlansCheckout services={services} />
    </div>
  )
}
