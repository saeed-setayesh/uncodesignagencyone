import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@/lib/sitemap-build'

export const revalidate = 3600

/** Single urlset در `/sitemap.xml` — بدون تکه‌بندی؛ گوگل و مرورگر آن را مستقیم می‌خوانند. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries()
}
