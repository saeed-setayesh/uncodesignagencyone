import { isNotNull } from 'drizzle-orm'
import { db, service } from '@/lib/db'

export const SERVICE_OFFERING_SEED: {
  slug: string
  code: string
  fa: string
  priceTier: number
  sortOrder: number
}[] = [
  { slug: 'web-design', code: 'WEB', fa: 'طراحی سایت', priceTier: 2, sortOrder: 1 },
  { slug: 'seo', code: 'SEO', fa: 'سئو و بهینه‌سازی', priceTier: 2, sortOrder: 2 },
  { slug: 'content', code: 'CNT', fa: 'تولید محتوا', priceTier: 1, sortOrder: 3 },
  { slug: 'social-media', code: 'MKT', fa: 'دیجیتال مارکتینگ و شبکه‌های اجتماعی', priceTier: 2, sortOrder: 4 },
  { slug: 'bot', code: 'BOT', fa: 'ربات و چت‌بات', priceTier: 2, sortOrder: 5 },
  { slug: 'site-support', code: 'SUP', fa: 'پشتیبانی سایت', priceTier: 1, sortOrder: 6 },
  { slug: 'e-commerce', code: 'ECM', fa: 'فروشگاه اینترنتی / ای‌کامرس', priceTier: 3, sortOrder: 7 },
  { slug: 'mobile-app', code: 'APP', fa: 'اپلیکیشن موبایل', priceTier: 3, sortOrder: 8 },
]

export async function getExcelCodeToSlugMap(client: typeof db): Promise<Map<string, string>> {
  const services = await client
    .select({ slug: service.slug, excelCode: service.excelCode })
    .from(service)
    .where(isNotNull(service.excelCode))
  const byCode = new Map<string, string>()
  for (const s of services) {
    if (s.excelCode) byCode.set(s.excelCode.trim().toUpperCase(), s.slug)
  }
  return byCode
}

/** نگاشت کد اکسل → اسلاگ سرویس (با map از قبل بارگذاری‌شده). */
export function parseSuggestedCodesWithMap(
  codesRaw: string | null | undefined,
  byCode: Map<string, string>
): string[] {
  if (!codesRaw || typeof codesRaw !== 'string') return []

  const parts = codesRaw.split(/[,،\s]+/).map((p) => p.trim().toUpperCase()).filter(Boolean)
  const out: string[] = []
  for (const p of parts) {
    const slug = byCode.get(p)
    if (slug && !out.includes(slug)) out.push(slug)
  }
  return out
}
