/**
 * اسلاگ‌هایی که نباید توسط مسیر پویا `app/[slug]` گرفته شوند
 * (صفحات ثابت، API، ادمین، فایل‌های سیستمی).
 */
export const RESERVED_TOP_LEVEL_SLUGS = new Set([
  'admin',
  'api',
  'blog',
  'careers',
  'cities',
  'contact',
  'industries',
  'portfolio',
  'team',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
])

export function isReservedSlug(slug: string): boolean {
  return RESERVED_TOP_LEVEL_SLUGS.has(slug.toLowerCase())
}
