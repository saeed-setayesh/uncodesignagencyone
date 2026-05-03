import { cache } from 'react'
import { asc, desc, eq } from 'drizzle-orm'
import { blogPost, city, db, industry, job, service } from '@/lib/db'
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'

/** Google: حداکثر ۵۰٬۰۰۰ URL در هر فایل sitemap */
const CHUNK = 50_000

export const revalidate = 3600

type SitemapItem = MetadataRoute.Sitemap[number]

/**
 * فقط الگوهایی که می‌خواهید در گوگل ایندکس شوند:
 * - /service
 * - /service/industry
 * - /service/industry/city
 * - /job
 * - /job/city
 * به‌همراه صفحات اصلی سایت (خانه، تماس، …) و وبلاگ
 */
const buildSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [services, industries, cities, jobs, blogPosts] = await Promise.all([
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
      .select({ slug: city.slug, createdAt: city.createdAt })
      .from(city)
      .where(eq(city.active, true))
      .orderBy(asc(city.fa)),
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

  // صفحات ثابت مهم
  out.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    { url: `${SITE_URL}/team`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.82 },
    {
      url: `${SITE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    { url: `${SITE_URL}/cities`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }
  )
  for (const ind of industries) {
    out.push({
      url: `${SITE_URL}/industries/${ind.slug}`,
      lastModified: ind.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })
  }
  for (const c of cities) {
    out.push({
      url: `${SITE_URL}/cities/${c.slug}`,
      lastModified: c.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })
  }
  out.push(
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.75 }
  )
  for (const p of blogPosts) {
    out.push({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt ?? p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })
  }

  for (const s of services) {
    out.push({
      url: `${SITE_URL}/${s.slug}`,
      lastModified: s.updatedAt ?? new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  }

  for (const s of services) {
    for (const ind of industries) {
      out.push({
        url: `${SITE_URL}/${s.slug}/${ind.slug}`,
        lastModified: ind.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })
    }
  }

  for (const s of services) {
    for (const ind of industries) {
      for (const c of cities) {
        out.push({
          url: `${SITE_URL}/${s.slug}/${ind.slug}/${c.slug}`,
          lastModified: c.createdAt,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      }
    }
  }

  for (const j of jobs) {
    out.push({
      url: `${SITE_URL}/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })
  }
  for (const j of jobs) {
    for (const c of cities) {
      out.push({
        url: `${SITE_URL}/${j.slug}/${c.slug}`,
        lastModified: j.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.55,
      })
    }
  }

  return out
}

/** Per-request dedupe (no 2MB Next.js data cache). Full list is still built in memory. */
const getSitemap = cache(buildSitemap)

export async function generateSitemaps() {
  const all = await getSitemap()
  const n = Math.max(1, Math.ceil(all.length / CHUNK))
  return Array.from({ length: n }, (_, i) => ({ id: i }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const all = await getSitemap()
  const idStr = String(await props.id)
  const id = Math.max(0, Number.parseInt(idStr, 10) || 0)
  const start = id * CHUNK
  return all.slice(start, start + CHUNK)
}
