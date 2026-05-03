import { revalidatePath } from 'next/cache'
import { CITY_LEVEL_NEIGHBORHOOD_KEY } from '@/lib/neighborhood'

export function revalidateGeneratedPagePaths(opts: {
  service: string
  industrySlug: string
  citySlug: string
  neighborhoodKey: string
}): void {
  const base = `/${opts.service}/${opts.industrySlug}/${opts.citySlug}`
  revalidatePath(base)
  if (opts.neighborhoodKey !== CITY_LEVEL_NEIGHBORHOOD_KEY) {
    revalidatePath(`${base}/${opts.neighborhoodKey}`)
  }
}
