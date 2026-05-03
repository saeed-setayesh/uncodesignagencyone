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
    // Chunked sitemaps from `app/sitemap.ts` + `generateSitemaps()` — add more if build shows more `/sitemap/N.xml` routes
    sitemap: [`${SITE_URL}/sitemap/0.xml`, `${SITE_URL}/sitemap/1.xml`],
  }
}
