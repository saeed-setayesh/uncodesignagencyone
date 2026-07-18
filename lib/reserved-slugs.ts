/**
 * اسلاگ‌هایی که نباید توسط مسیر پویا `app/[slug]` گرفته شوند
 * (صفحات ثابت، API، ادمین، فایل‌های سیستمی).
 */
export const RESERVED_TOP_LEVEL_SLUGS = new Set([
  'admin',
  'api',
  'blog',
  'careers',
  'certificate',
  'cities',
  'contact',
  'industries',
  'learn',
  'software',
  'student',
  'portfolio',
  'price-calculator',
  'team',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
])

export function isReservedSlug(slug: string): boolean {
  return RESERVED_TOP_LEVEL_SLUGS.has(slug.toLowerCase())
}
