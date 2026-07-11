import type { LucideIcon } from 'lucide-react'
import { Code2, GraduationCap } from 'lucide-react'
import type { Service } from '@/lib/db'
import { getHomeServiceIcon } from '@/lib/home-service-icons'
import { parseServicePricingPlans } from '@/lib/parse-pricing-plans'
import { isSoftwareProduct } from '@/lib/software-products'
import { shouldShowInServiceCatalog } from '@/lib/service-slug-canonical'

export type HomeOfferCard = {
  id: string
  href: string
  title: string
  blurb: string
  priceLabel: string
  priceNote: string
  features: string[]
  featured: boolean
  Icon: LucideIcon
}

function serviceToCard(svc: Service): HomeOfferCard {
  const plans = parseServicePricingPlans(svc.pricingPlans, svc.priceTier)
  const p0 = plans[0]
  return {
    id: svc.id,
    href: `/${svc.slug}`,
    title: svc.fa,
    blurb: (svc.metaDescription?.trim() || p0?.description || '').replace(/\s+/g, ' '),
    priceLabel: p0?.priceLabel ?? '—',
    priceNote: p0?.description ?? p0?.name ?? '',
    features: (p0?.features ?? []).slice(0, 5),
    featured: Boolean(p0?.featured),
    Icon: getHomeServiceIcon(svc.slug),
  }
}

const SOFTWARE_HUB_CARD: HomeOfferCard = {
  id: 'hub-software',
  href: '/software',
  title: 'نرم‌افزار اختصاصی',
  blurb:
    'طراحی و توسعه CRM، ERP، پنل admin، فروشگاه، AI و اتوماسیون — بیش از ۱۰۰ راه‌حل سفارشی برای کسب‌وکار شما.',
  priceLabel: 'از ۳۲٬۰۰۰٬۰۰۰ تومان',
  priceNote: 'MVP تا نسخه سازمانی',
  features: ['CRM و ERP', 'Admin Panel', 'یکپارچگی درگاه', 'تحویل مرحله‌ای', 'پشتیبانی و آموزش'],
  featured: false,
  Icon: Code2,
}

const LEARN_HUB_CARD: HomeOfferCard = {
  id: 'hub-learn',
  href: '/learn',
  title: 'آموزش خصوصی فناوری',
  blurb:
    'کلاس یک‌به‌یک با مربی شاغل صنعت — وب، موبایل، AI و بیش از ۱۰۰ دوره تخصصی. پروژه‌محور و آماده بازار کار.',
  priceLabel: 'جلسه آشنایی رایگان',
  priceNote: 'شامل دوره‌های هوش مصنوعی',
  features: ['کلاس خصوصی', 'منتور صنعتی', 'دوره‌های AI', 'گواهی پایان دوره', 'پروژه واقعی'],
  featured: false,
  Icon: GraduationCap,
}

/** Core agency services + one software hub + one learning hub (no individual software/learn items). */
export function buildHomeOfferCards(
  services: Service[],
  options: { hasSoftwareProducts?: boolean; hasLearnCourses?: boolean } = {}
): HomeOfferCard[] {
  const core = services.filter((s) => shouldShowInServiceCatalog(s.slug)).map(serviceToCard)
  const cards = [...core]

  if (options.hasSoftwareProducts !== false) {
    const hasSoftware = services.some((s) => isSoftwareProduct(s.slug))
    if (hasSoftware) cards.push(SOFTWARE_HUB_CARD)
  }

  if (options.hasLearnCourses !== false) {
    cards.push(LEARN_HUB_CARD)
  }

  return cards
}

export function homeCardPriceBody(priceLabel: string): string {
  return priceLabel.trim().replace(/^(?:از\s+)+/u, '').trim() || '—'
}
