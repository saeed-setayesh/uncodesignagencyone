import { DELIVERABLES_BY_SLUG } from '@/lib/service-deliverables-seed-data'
import { ServiceDeliverablesSchema, type ServiceDeliverables } from '@/types/service-deliverables'

const GENERIC: ServiceDeliverables = {
  summary:
    'تیم ما از تحلیل نیاز تا طراحی، توسعه و پشتیبانی کنار شماست. خروجی هر فاز شفاف است و قبل از پرداخت نهایی، نسخهٔ قابل‌بررسی می‌بینید.',
  whatWeDo: [
    {
      title: 'جلسهٔ کشف و اهداف',
      description: 'نیاز، مخاطب، بودجه و زمان‌بندی را شفاف می‌کنیم.',
      icon: 'MessageSquare',
    },
    {
      title: 'طراحی و اجرا',
      description: 'UI/UX و پیاده‌سازی با استانداردهای روز.',
      icon: 'Palette',
    },
    {
      title: 'تحویل و آموزش',
      description: 'تحویل فازها، مستندات و آموزش تیم شما.',
      icon: 'CheckCircle2',
    },
    {
      title: 'پشتیبانی',
      description: 'رفع باگ و به‌روزرسانی در دورهٔ قراردادی.',
      icon: 'Headphones',
    },
  ],
  tools: ['Figma', 'Next.js', 'TypeScript', 'PostgreSQL'],
  outcomes: [
    { metric: 'شفاف', description: 'قرارداد و فازهای قابل پیگیری' },
    { metric: 'تخمینی→دقیق', description: 'قیمت اولیه پس از مشاوره نهایی می‌شود' },
    { metric: 'ایران', description: 'تجربهٔ بازار و زبان فارسی' },
  ],
}

export function getDeliverablesFallback(serviceSlug: string, serviceFa: string): ServiceDeliverables {
  const base = DELIVERABLES_BY_SLUG[serviceSlug] ?? GENERIC
  if (DELIVERABLES_BY_SLUG[serviceSlug]) return base
  return {
    ...GENERIC,
    summary: GENERIC.summary.replace('تیم ما', `برای ${serviceFa}، تیم ما`),
  }
}

export function parseDeliverablesFromDb(value: unknown): ServiceDeliverables | null {
  const parsed = ServiceDeliverablesSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

export function resolveServiceDeliverables(
  serviceSlug: string,
  serviceFa: string,
  dbValue: unknown | null | undefined
): ServiceDeliverables {
  const fromDb = dbValue != null ? parseDeliverablesFromDb(dbValue) : null
  return fromDb ?? getDeliverablesFallback(serviceSlug, serviceFa)
}
