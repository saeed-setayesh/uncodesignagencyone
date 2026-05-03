import { cache } from 'react'
import { asc, desc, eq } from 'drizzle-orm'
import { blogPost, db, industry, job, service } from '@/lib/db'
import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

type SitemapItem = MetadataRoute.Sitemap[number]

/** Full absolute URL for sitemap `<loc>` with correct encoding per URL standard. */
export function absoluteSitemapLoc(siteOrigin: string, pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const base = siteOrigin.replace(/\/+$/, '')
  return new URL(path, `${base}/`).href
}

/**
 * Sitemap بدون صفحات شهر (بدون `/cities/[slug]`، بدون `/.../city` برای سرویس، بدون `/job/city`).
 * برای اندازٔ معقول برای گوگل و یک فایل تکی در `/sitemap.xml`.
 */
export const buildSitemapEntries = cache(async (): Promise<MetadataRoute.Sitemap> => {
  const SITE_URL = getSiteOrigin()
  const [services, industries, jobs, blogPosts] = await Promise.all([
    db
      .select({ slug: service.slug, updatedAt: service.updatedAt })
      .from(service)
      .where(eq(service.active, true))
      .orderBy(asc(service.sortOrder)),
    db
      .select({ slug: industry.slug, createdAt: industry.createdAt })
      .from(industry)
      .where(eq(industry.active, true))
      .orderBy(asc(industry.fa)),
    db
      .select({ slug: job.slug, updatedAt: job.updatedAt })
      .from(job)
      .where(eq(job.active, true))
      .orderBy(asc(job.fa)),
    db
      .select({
        slug: blogPost.slug,
        updatedAt: blogPost.updatedAt,
        publishedAt: blogPost.publishedAt,
      })
      .from(blogPost)
      .where(eq(blogPost.published, true))
      .orderBy(desc(blogPost.publishedAt)),
  ])

  const out: SitemapItem[] = []

  out.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    {
      url: absoluteSitemapLoc(SITE_URL, '/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: absoluteSitemapLoc(SITE_URL, '/careers'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    },
    {
      url: absoluteSitemapLoc(SITE_URL, '/portfolio'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: absoluteSitemapLoc(SITE_URL, '/team'),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.82,
    },
    {
      url: absoluteSitemapLoc(SITE_URL, '/industries'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: absoluteSitemapLoc(SITE_URL, '/cities'),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  )

  for (const ind of industries) {
    out.push({
      url: absoluteSitemapLoc(SITE_URL, `/industries/${ind.slug}`),
      lastModified: ind.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })
  }

  out.push({
    url: absoluteSitemapLoc(SITE_URL, '/blog'),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  })

  for (const p of blogPosts) {
    out.push({
      url: absoluteSitemapLoc(SITE_URL, `/blog/${p.slug}`),
      lastModified: p.publishedAt ?? p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })
  }

  for (const s of services) {
    out.push({
      url: absoluteSitemapLoc(SITE_URL, `/${s.slug}`),
      lastModified: s.updatedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  }

  for (const s of services) {
    for (const ind of industries) {
      out.push({
        url: absoluteSitemapLoc(SITE_URL, `/${s.slug}/${ind.slug}`),
        lastModified: ind.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })
    }
  }

  for (const j of jobs) {
    out.push({
      url: absoluteSitemapLoc(SITE_URL, `/${j.slug}`),
      lastModified: j.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })
  }

  return out
})
