const DEFAULT_SITE = 'https://yourdomain.ir'

function normalize(raw: string): string {
  const noTrailing = raw.trim().replace(/\/+$/, '')
  if (/^https?:\/\//i.test(noTrailing)) return noTrailing
  return `https://${noTrailing}`
}

/** Canonical origin for metadata, OG URLs, sitemap. Uses NEXT_PUBLIC_SITE_URL or {@link DEFAULT_SITE}. */
export function getSiteOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
  if (!raw) return DEFAULT_SITE
  return normalize(raw)
}
/**
 * Absolute redirects / payment callbacks where missing env historically meant localhost in dev.
 */
export function getServerCallbackOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
  if (!raw) return 'http://localhost:3000'
  return normalize(raw)
}

export function getMetadataBase(): URL {
  try {
    return new URL(`${getSiteOrigin()}/`)
  } catch {
    return new URL(`${DEFAULT_SITE}/`)
  }
}
