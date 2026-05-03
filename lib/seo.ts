import type { Metadata } from 'next'
import type { PageContent } from '@/types/content'
import { getSiteOrigin } from '@/lib/site-url'

export function buildMetadata(
  content: PageContent,
  params: {
    industry: string
    city: string
    service?: string
    nationalHub?: boolean
    neighborhood?: string
  }
): Metadata {
  const site = getSiteOrigin()
  const service = params.service ?? 'web-design'
  const url = params.nationalHub
    ? `${site}/${service}/${params.industry}`
    : params.neighborhood
      ? `${site}/${service}/${params.industry}/${params.city}/${params.neighborhood}`
      : `${site}/${service}/${params.industry}/${params.city}`

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url,
      type: 'website',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
    robots: { index: true, follow: true },
  }
}

/** Canonical: `/{service}` — صفحهٔ اصلی هر سرویس */
export function buildServiceRootMetadata(content: PageContent, service: string): Metadata {
  const url = `${getSiteOrigin()}/${service}`

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url,
      type: 'website',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
    robots: { index: true, follow: true },
  }
}
