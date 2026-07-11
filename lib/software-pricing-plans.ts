import { toPersianDigits } from '@/lib/utils'
import type { PricingPlan } from '@/types/pricing'

function fmt(n: number): string {
  return toPersianDigits(Math.round(n).toLocaleString('en-US').replace(/,/g, '،'))
}

/** Default software development pricing tiers for product landing pages. */
export function buildSoftwarePricingPlans(productFa: string): PricingPlan[] {
  const short = productFa.slice(0, 40)
  return [
    {
      name: 'MVP / استارتر',
      description: 'نسخهٔ اولیه برای راه‌اندازی سریع',
      priceLabel: `از ${fmt(32_000_000)} تومان`,
      originalPriceLabel: null,
      featured: false,
      features: [
        'تحلیل نیاز و نقشهٔ راه',
        'طراحی UI اصلی',
        'ماژول‌های هسته',
        'پنل مدیریت پایه',
        'استقرار اولیه',
        'پشتیبانی ۳ ماهه',
      ],
    },
    {
      name: 'حرفه‌ای',
      description: `پیشنهاد اصلی برای ${short}`,
      priceLabel: `از ${fmt(68_000_000)} تومان`,
      originalPriceLabel: `${fmt(95_000_000)} تومان`,
      featured: true,
      features: [
        'تمام موارد استارتر',
        'ماژول‌های کامل',
        'یکپارچگی درگاه / SMS',
        'گزارش‌گیری و داشبورد',
        'اپ موبایل (در صورت نیاز)',
        'آموزش تیم + مستندات',
        'پشتیبانی ۶ ماهه',
      ],
    },
    {
      name: 'سازمانی',
      description: 'مقیاس بالا، SLA و امنیت پیشرفته',
      priceLabel: 'بر اساس RFP',
      originalPriceLabel: null,
      featured: false,
      features: [
        'معماری اختصاصی',
        'چند شعبه / multi-tenant',
        'API و یکپارچه‌سازی ERP',
        'امنیت و audit log',
        'DevOps و مانیتورینگ',
        'SLA و پشتیبانی ۲۴/۷',
      ],
    },
  ]
}
