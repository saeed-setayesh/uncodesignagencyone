import Anthropic from '@anthropic-ai/sdk'
import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { db, city, industry, service, job, generatedPage, generatedJobPage, type City, type Industry } from '@/lib/db'
import { PageContentSchema, type PageContent } from '@/types/content'
import { buildCityLandingFallbackContent } from '@/lib/city-landing-fallback'
import { buildNationalHubFallbackContent } from '@/lib/national-hub-content'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'

const CACHE_VERSION = 'v1'

/** Reserved city slug for national (سراسر ایران) landing pages at /[service]/[industry] */
export const NATIONAL_HUB_CITY_SLUG = 'iran'

/** اسلاگ سرویس در دیتابیس (جدول Service) */
export type ServiceSlug = string

/** سازگاری با کد قدیمی */
export type ServiceType = ServiceSlug

// ─── Read from DB (no auto-generation) ───────────────────────────────────────

export async function getPageContent(
  industrySlug: string,
  citySlug: string,
  serviceSlug: ServiceSlug = 'web-design',
  neighborhoodKey: string = CITY_LEVEL_NEIGHBORHOOD_KEY
): Promise<PageContent | null> {
  const [indRow] = await db.select().from(industry).where(eq(industry.slug, industrySlug)).limit(1)
  const [cityRow] = await db.select().from(city).where(eq(city.slug, citySlug)).limit(1)

  if (!indRow || !cityRow) return null

  const [cached] = await db
    .select()
    .from(generatedPage)
    .where(
      and(
        eq(generatedPage.industryId, indRow.id),
        eq(generatedPage.cityId, cityRow.id),
        eq(generatedPage.neighborhoodKey, neighborhoodKey),
        eq(generatedPage.cacheVersion, CACHE_VERSION),
        eq(generatedPage.service, serviceSlug)
      )
    )
    .limit(1)

  return cached ? (cached.content as PageContent) : null
}

/**
 * ۱) اگر `generatedPage` در دیتابیس باشد، همان.
 * ۲) صفحهٔ ملی `/[service]/[industry]` (شهر «iran»): fallback ملی.
 * ۳) صفحهٔ شهری `/[service]/[industry]/[city]`: اگر DB خالی بود، فallback خودکار برای همان تلفیق.
 */
export async function getPageContentWithNationalFallback(
  industrySlug: string,
  citySlug: string,
  serviceSlug: ServiceSlug = 'web-design',
  neighborhoodKey: string = CITY_LEVEL_NEIGHBORHOOD_KEY
): Promise<PageContent | null> {
  const fromDb = await getPageContent(industrySlug, citySlug, serviceSlug, neighborhoodKey)
  if (fromDb) return fromDb

  /** صفحهٔ محله (`/.../city/hood`) بدون رکورد DB تولید خودکار نداریم — از ۴۰۴ جلوگیری نمی‌کنیم تا محتوای اشتباه محلی نمایش داده نشود. */
  if (neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) return null

  const [ind] = await db
    .select()
    .from(industry)
    .where(and(eq(industry.slug, industrySlug), eq(industry.active, true)))
    .limit(1)
  if (!ind) return null

  const [svc] = await db
    .select()
    .from(service)
    .where(and(eq(service.slug, serviceSlug), eq(service.active, true)))
    .limit(1)
  if (!svc) return null
  const serviceFa = svc.fa

  if (citySlug === NATIONAL_HUB_CITY_SLUG) {
    return buildNationalHubFallbackContent(ind, serviceSlug, serviceFa)
  }

  const [cityRow] = await db
    .select()
    .from(city)
    .where(and(eq(city.slug, citySlug), eq(city.active, true)))
    .limit(1)
  if (!cityRow) return null

  return buildCityLandingFallbackContent(ind, cityRow, serviceFa)
}

// ─── Build service-specific prompt ───────────────────────────────────────────

async function buildPrompt(
  ind: Industry,
  cityRow: City,
  serviceSlug: string,
  serviceFa: string
): Promise<string> {
  const [svc] = await db
    .select()
    .from(service)
    .where(and(eq(service.slug, serviceSlug), eq(service.active, true)))
    .limit(1)
  const serviceContext =
    svc?.seoBody?.trim().slice(0, 1500) ??
    `خدمات ${serviceFa} برای کسب‌وکارها در ایران — مشاوره، اجرا و پشتیبانی`

  return `Write a complete sales page in Farsi (Persian) for a digital agency offering this specific service:

Service: ${serviceFa} (${serviceContext})
Industry: ${ind.fa} (${ind.desc})
City: ${cityRow.fa}, Iran (${cityRow.province} province)

Return a JSON object with EXACTLY these fields (all text must be in Farsi):

{
  "metaTitle": "${serviceFa} ${ind.fa} در ${cityRow.fa} — آژانس دیجیتال",
  "metaDescription": "max 155 chars, include city, service name + CTA",
  "h1": "${serviceFa} حرفه‌ای ${ind.fa} در ${cityRow.fa}",
  "heroSubtitle": "1-2 sentence value proposition specific to ${serviceFa} for ${ind.fa} businesses in ${cityRow.fa}",
  "urgencyText": "scarcity message e.g. فقط ۲ ظرفیت خالی این ماه",
  "stats": {
    "projects": "+۱۴۰",
    "satisfaction": "۹۷٪",
    "rating": "۴.۹"
  },
  "benefits": [
    { "title": "...", "desc": "..." },
    { "title": "...", "desc": "..." },
    { "title": "...", "desc": "..." },
    { "title": "...", "desc": "..." }
  ],
  "processSteps": [
    { "title": "...", "desc": "...", "timing": "هفته ۱" },
    { "title": "...", "desc": "...", "timing": "هفته ۲" },
    { "title": "...", "desc": "...", "timing": "هفته ۳" },
    { "title": "...", "desc": "...", "timing": "ماه ۲+" }
  ],
  "testimonials": [
    { "text": "...", "name": "...", "business": "${ind.fa} در ${cityRow.fa}", "initials": "..." },
    { "text": "...", "name": "...", "business": "${ind.fa} در ${cityRow.fa}", "initials": "..." }
  ],
  "faq": [
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." },
    { "q": "...", "a": "..." }
  ],
  "ctaHeading": "...",
  "ctaSubtext": "...",
  "whatsappText": "سلام، درباره ${serviceFa} برای ${ind.fa} در ${cityRow.fa} می‌خواهم بیشتر بدانم"
}

Rules:
- All text in Farsi (Persian script)
- Benefits and FAQ must be specific to ${serviceFa} for the ${ind.fa} industry
- Testimonials must mention ${cityRow.fa}
- Return ONLY valid JSON, no markdown, no code fences`
}

// ─── AI generation (admin-only, returns content without saving) ───────────────

export async function generateContentWithAI(
  industrySlug: string,
  citySlug: string,
  serviceSlug: ServiceSlug
): Promise<PageContent> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const [indRow] = await db.select().from(industry).where(eq(industry.slug, industrySlug)).limit(1)
  const [cityRow] = await db.select().from(city).where(eq(city.slug, citySlug)).limit(1)

  if (!indRow || !cityRow) {
    throw new Error(`Unknown combination: ${industrySlug}/${citySlug}`)
  }

  const [svc] = await db
    .select()
    .from(service)
    .where(and(eq(service.slug, serviceSlug), eq(service.active, true)))
    .limit(1)
  const serviceFa = svc?.fa ?? serviceSlug

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: `You are a senior Farsi copywriter for a digital agency in Iran.
Write persuasive, conversion-optimized content in Farsi for local business owners.
Return ONLY valid JSON matching the exact schema provided. Pure JSON only — no markdown.`,
    messages: [{ role: 'user', content: await buildPrompt(indRow, cityRow, serviceSlug, serviceFa) }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  return PageContentSchema.parse(JSON.parse(cleaned))
}

// ─── Save page to DB ──────────────────────────────────────────────────────────

export async function savePageContent(
  industryId: string,
  cityId: string,
  serviceSlug: ServiceSlug,
  content: PageContent,
  neighborhoodKey: string = CITY_LEVEL_NEIGHBORHOOD_KEY
): Promise<void> {
  const id = randomUUID()
  const now = new Date()
  await db
    .insert(generatedPage)
    .values({
      id,
      industryId,
      cityId,
      neighborhoodKey,
      service: serviceSlug,
      content: content as unknown as Record<string, unknown>,
      cacheVersion: CACHE_VERSION,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [
        generatedPage.industryId,
        generatedPage.cityId,
        generatedPage.neighborhoodKey,
        generatedPage.cacheVersion,
        generatedPage.service,
      ],
      set: { content: content as unknown as Record<string, unknown>, updatedAt: new Date() },
    })
}

/** محتوای صفحهٔ شغل + شهر */
export async function getJobCityPageContent(jobSlug: string, citySlug: string): Promise<PageContent | null> {
  const [j] = await db
    .select()
    .from(job)
    .where(and(eq(job.slug, jobSlug), eq(job.active, true)))
    .limit(1)
  const [c] = await db
    .select()
    .from(city)
    .where(and(eq(city.slug, citySlug), eq(city.active, true)))
    .limit(1)
  if (!j || !c) return null

  const [row] = await db
    .select()
    .from(generatedJobPage)
    .where(
      and(
        eq(generatedJobPage.jobId, j.id),
        eq(generatedJobPage.cityId, c.id),
        eq(generatedJobPage.cacheVersion, CACHE_VERSION)
      )
    )
    .limit(1)
  return row ? (row.content as PageContent) : null
}

export async function saveJobCityPageContent(jobId: string, cityId: string, content: PageContent): Promise<void> {
  const id = randomUUID()
  const now = new Date()
  await db
    .insert(generatedJobPage)
    .values({
      id,
      jobId,
      cityId,
      content: content as unknown as Record<string, unknown>,
      cacheVersion: CACHE_VERSION,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [generatedJobPage.jobId, generatedJobPage.cityId, generatedJobPage.cacheVersion],
      set: { content: content as unknown as Record<string, unknown>, updatedAt: new Date() },
    })
}
