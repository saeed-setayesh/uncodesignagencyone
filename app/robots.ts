import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteOrigin()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    // یک فایل `sitemap.ts` بدون generateSitemaps → آدرس استاندارد `/sitemap.xml`
    sitemap: [`${SITE_URL}/sitemap.xml`],
  }
}
