import type { Metadata } from 'next'
import type { PageContent } from '@/types/content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'

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
  const service = params.service ?? 'web-design'
  const url = params.nationalHub
    ? `${SITE_URL}/${service}/${params.industry}`
    : params.neighborhood
      ? `${SITE_URL}/${service}/${params.industry}/${params.city}/${params.neighborhood}`
      : `${SITE_URL}/${service}/${params.industry}/${params.city}`

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
  const url = `${SITE_URL}/${service}`

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
