/** Service slugs prefixed with this are custom software product pages — not root service pages. */
export const SOFTWARE_SLUG_PREFIX = 'software-'

export function isSoftwareProduct(slug: string): boolean {
  return slug.startsWith(SOFTWARE_SLUG_PREFIX)
}

export function softwarePublicSlug(fullSlug: string): string {
  return fullSlug.startsWith(SOFTWARE_SLUG_PREFIX)
    ? fullSlug.slice(SOFTWARE_SLUG_PREFIX.length)
    : fullSlug
}

export function softwareDbSlug(publicSlug: string): string {
  return publicSlug.startsWith(SOFTWARE_SLUG_PREFIX) ? publicSlug : `${SOFTWARE_SLUG_PREFIX}${publicSlug}`
}
