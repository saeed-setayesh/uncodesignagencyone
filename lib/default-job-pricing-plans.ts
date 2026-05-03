import { toPersianDigits } from '@/lib/utils'
import type { PricingPlan } from '@/types/pricing'

function milToman(n: number): string {
  return `${toPersianDigits(String(n))} میلیون تومان`
}

/**
 * چهار سطح تعرفهٔ همکاری/استخدام برای صفحات ریشهٔ شغل (مثل /fpga-engineer).
 */
export function buildDefaultJobHiringPlans(): PricingPlan[] {
  return [
    {
      name: 'موقعیت سبک / ساده',
      description: 'پروژه کوتاه، نیازمندی ساده و حجم کاری قابل مدیریت',
      priceLabel: `از ${milToman(20)}`,
      originalPriceLabel: null,
      featured: false,
      features: [
        'تعریف دقیق scope در همان جلسهٔ اول',
        'قابل ارتقا به پلن‌های بالاتر',
        'پشتیبانی هماهنگی از طریق تیم',
        'شروع سریع پس از تایید',
      ],
    },
    {
      name: 'تخصصی',
      description: 'پروژه‌های پیچیده‌تر، دامنه وسیع‌تر و مسئولیت بیشتر',
      priceLabel: `از ${milToman(40)}`,
      originalPriceLabel: null,
      featured: true,
      features: [
        'تمرکز روی ساختار کاری و تحویل‌های میانی',
        'هماهنگی تنگاتنگ با تیم فنی',
        'مناسب برای نیازمندی‌های تخصصی‌تر نسبت به پلن ساده',
        'بازهٔ زمانی بر اساس توافق',
      ],
    },
    {
      name: 'تمام‌وقت (فول‌تایم)',
      description: 'همکاری بلندمدت و حضور معادل فول‌تایم',
      priceLabel: `از ${milToman(60)}`,
      originalPriceLabel: null,
      featured: false,
      features: [
        'ساختار قرارداد ماهانه / پروژه‌ای بر اساس توافق',
        'تعریف milestone و حوزه مسئولیت',
        'پشتیبانی مدیریتی و همسوسازی با اهداف تیم',
        'انعطاف شروع/پایان فازها',
      ],
    },
    {
      name: 'سطح خبره / اختصاصی',
      description: 'لید فنی، معماری، یا نقش بسیار تخصصی',
      priceLabel: 'مذاکره',
      originalPriceLabel: null,
      featured: false,
      features: [
        'تعریف وظایف و اختیار بر اساس RFP / قرارداد',
        'نرخ و مدت بر اساس سطح تخصص و در دسترس بودن',
        'مناسب سینیور و نقش‌های پرریسک',
        'مشاورهٔ دقیق قبل از امضا',
      ],
    },
  ]
}
