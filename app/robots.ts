import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'

export default function robots(): MetadataRoute.Robots {
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
