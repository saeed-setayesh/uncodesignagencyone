import {
  Bot,
  LifeBuoy,
  Monitor,
  PenLine,
  Share2,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  'web-design': Monitor,
  seo: TrendingUp,
  'social-media': Share2,
  'e-commerce': ShoppingCart,
  'mobile-app': Smartphone,
  'site-support': LifeBuoy,
  content: PenLine,
  bot: Bot,
}

export function getHomeServiceIcon(slug: string): LucideIcon {
  return MAP[slug] ?? Sparkles
}
