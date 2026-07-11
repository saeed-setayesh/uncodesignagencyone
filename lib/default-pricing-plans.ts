import { toPersianDigits } from '@/lib/utils'
import type { PricingPlan } from '@/types/pricing'

const TIER_MULTIPLIER: Record<number, number> = {
  1: 0.88,
  2: 1,
  3: 1.15,
}

function formatToman(amount: number): string {
  const s = Math.round(amount).toLocaleString('en-US')
  return toPersianDigits(s.replace(/,/g, '،'))
}

/** چهار پلن پیش‌فرض بر اساس سطح قیمت (۱–۳). */
export function buildDefaultPricingPlans(priceTier: number): PricingPlan[] {
  const tier = TIER_MULTIPLIER[priceTier] != null ? priceTier : 2
  const mult = TIER_MULTIPLIER[tier] ?? 1

  return [
    {
      name: 'استارتر',
      description: 'مناسب برای شروع آنلاین',
      priceLabel: `از ${formatToman(9_000_000 * mult)} تومان`,
      originalPriceLabel: `${formatToman(14_000_000 * mult)} تومان`,
      featured: false,
      features: [
        'طراحی ۵ صفحه',
        'ریسپانسیو (موبایل)',
        'فرم تماس',
        'نقشه گوگل',
        'پشتیبانی ۳ ماهه',
        'آموزش مدیریت سایت',
      ],
    },
    {
      name: 'حرفه‌ای',
      description: 'بهترین انتخاب برای کسب‌وکار شما',
      priceLabel: `از ${formatToman(18_000_000 * mult)} تومان`,
      originalPriceLabel: `${formatToman(28_000_000 * mult)} تومان`,
      featured: true,
      features: [
        'طراحی تا ۱۵ صفحه',
        'ریسپانسیو کامل',
        'سیستم رزرو آنلاین',
        'بهینه‌سازی سئو',
        'وبلاگ و محتوا',
        'پشتیبانی ۶ ماهه رایگان',
        'گواهی SSL رایگان',
        'سرعت بارگذاری بالا',
      ],
    },
    {
      name: 'فروشگاهی',
      description: 'برای فروش آنلاین محصولات',
      priceLabel: `از ${formatToman(32_000_000 * mult)} تومان`,
      originalPriceLabel: null,
      featured: false,
      features: [
        'فروشگاه اینترنتی کامل',
        'درگاه پرداخت آنلاین',
        'مدیریت موجودی',
        'پنل مدیریت حرفه‌ای',
        'گزارشات فروش',
        'پشتیبانی ۱۲ ماهه',
        'آپدیت مادام‌العمر',
      ],
    },
    {
      name: 'سازمانی',
      description: 'پروژه‌های بزرگ و قرارداد اختصاصی',
      priceLabel: 'بر اساس RFP',
      originalPriceLabel: null,
      featured: false,
      features: [
        'تحلیل نیاز و نقشه راه',
        'تیم اختصاصی و PM',
        'امنیت و مقیاس‌پذیری',
        'SLA و پشتیبانی ویژه',
        'یکپارچه‌سازی سیستم‌ها',
        'گزارش‌دهی مدیریتی',
      ],
    },
  ]
}
