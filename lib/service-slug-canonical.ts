import { SERVICE_OFFERING_SEED } from '@/lib/service-offerings'
import { isSoftwareProduct } from '@/lib/software-products'

/** Official agency service slugs (from seed catalog). */
export const CANONICAL_SERVICE_SLUGS = new Set(SERVICE_OFFERING_SEED.map((s) => s.slug))

/** Legacy/import duplicates → canonical slug. */
export const LEGACY_SERVICE_SLUG_REDIRECTS: Record<string, string> = {
  'content-creation': 'content',
  'social-media-management': 'social-media',
  'support-and-maintenance': 'site-support',
  ecommerce: 'e-commerce',
  'mobile-application': 'mobile-app',
}

export function resolveCanonicalServiceSlug(slug: string): string {
  return LEGACY_SERVICE_SLUG_REDIRECTS[slug] ?? slug
}

export function isLegacyDuplicateServiceSlug(slug: string): boolean {
  return slug in LEGACY_SERVICE_SLUG_REDIRECTS
}

export function isCanonicalAgencyServiceSlug(slug: string): boolean {
  return CANONICAL_SERVICE_SLUGS.has(slug)
}

/** Show in nav, footer, homepage cards — not software, not legacy duplicates. */
export function shouldShowInServiceCatalog(slug: string): boolean {
  if (isSoftwareProduct(slug)) return false
  if (isLegacyDuplicateServiceSlug(slug)) return false
  return isCanonicalAgencyServiceSlug(slug)
}

/** Permanent redirect target for legacy service URLs, or null. */
export function getLegacyServiceRedirect(slug: string, pathSuffix?: string): string | null {
  const canonical = LEGACY_SERVICE_SLUG_REDIRECTS[slug]
  if (!canonical) return null
  if (!pathSuffix) return `/${canonical}`
  return `/${canonical}/${pathSuffix}`
}
