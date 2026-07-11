export type ProjectScale = 'small' | 'medium' | 'large'
export type RushLevel = 'normal' | 'fast' | 'urgent'

export type ServiceBase = {
  slug: string
  label: string
  /** قیمت پایهٔ تومان برای مقیاس small */
  basePriceToman: number
  copy: string
}

/** Slugs aligned with canonical SERVICE_OFFERING_SEED catalog. */
export const SERVICE_BASES: ServiceBase[] = [
  {
    slug: 'web-design',
    label: 'طراحی سایت',
    basePriceToman: 19_000_000,
    copy: 'لندینگ، شرکتی یا چندصفحه‌ای با Next.js و سئوی اولیه',
  },
  {
    slug: 'e-commerce',
    label: 'فروشگاه اینترنتی',
    basePriceToman: 38_000_000,
    copy: 'کاتالوگ، درگاه، سبد و پنل سفارش',
  },
  {
    slug: 'seo',
    label: 'سئو',
    basePriceToman: 7_500_000,
    copy: 'ممیزی فنی، محتوا و گزارش ماهانه (ماهانه)',
  },
  {
    slug: 'social-media',
    label: 'شبکه‌های اجتماعی',
    basePriceToman: 6_500_000,
    copy: 'استراتژی، تولید و انتشار (ماهانه)',
  },
  {
    slug: 'mobile-app',
    label: 'اپلیکیشن موبایل',
    basePriceToman: 62_000_000,
    copy: 'Flutter اندروید و iOS با API',
  },
  {
    slug: 'content',
    label: 'تولید محتوا',
    basePriceToman: 4_500_000,
    copy: 'بلاگ، صفحهٔ محصول و کپشن (ماهانه)',
  },
  {
    slug: 'site-support',
    label: 'پشتیبانی سایت',
    basePriceToman: 3_200_000,
    copy: 'آپدیت، بک‌آپ، رفع باگ (ماهانه)',
  },
  {
    slug: 'bot',
    label: 'ربات و چت‌بات',
    basePriceToman: 13_000_000,
    copy: 'تلگرام، واتساپ یا وب‌چت با اتصال CRM',
  },
]

export const SCALE_MULTIPLIERS: Record<ProjectScale, { label: string; mult: number; hint: string }> = {
  small: { label: 'کوچک', mult: 1, hint: 'لندینگ، ۵–۱۰ صفحه، MVP' },
  medium: { label: 'متوسط', mult: 1.75, hint: 'سایت کامل یا فروشگاه متوسط' },
  large: { label: 'بزرگ', mult: 2.9, hint: 'پورتال، چندزبانه، یکپارچه‌سازی سنگین' },
}

export const RUSH_MULTIPLIERS: Record<RushLevel, { label: string; mult: number }> = {
  normal: { label: 'عادی', mult: 1 },
  fast: { label: 'سریع (−۲۵٪ زمان)', mult: 1.2 },
  urgent: { label: 'فوری', mult: 1.4 },
}

export type EstimatorAddon = {
  id: string
  label: string
  priceToman: number
  appliesTo: string[]
}

export const ESTIMATOR_ADDONS: EstimatorAddon[] = [
  { id: 'multilingual', label: 'چندزبانه (فارسی + انگلیسی)', priceToman: 5_500_000, appliesTo: ['web-design', 'e-commerce'] },
  { id: 'payment', label: 'درگاه پرداخت و تست تراکنش', priceToman: 3_500_000, appliesTo: ['web-design', 'e-commerce'] },
  { id: 'content-pack', label: 'بستهٔ محتوای اولیه (۱۰ صفحه)', priceToman: 5_000_000, appliesTo: ['web-design', 'e-commerce', 'seo'] },
  { id: 'hosting-setup', label: 'راه‌اندازی هاست و SSL', priceToman: 1_800_000, appliesTo: ['web-design', 'e-commerce', 'site-support'] },
  { id: 'training', label: 'جلسهٔ آموزش تیم (۲ ساعت)', priceToman: 2_200_000, appliesTo: ['web-design', 'e-commerce', 'mobile-app', 'bot'] },
  { id: 'animations', label: 'انیمیشن و میکرواینتراکشن', priceToman: 4_500_000, appliesTo: ['web-design'] },
  { id: 'crm-integration', label: 'اتصال CRM / شیت', priceToman: 3_000_000, appliesTo: ['web-design', 'bot', 'e-commerce'] },
  { id: 'ga-gsc', label: 'GA4 و Search Console', priceToman: 1_200_000, appliesTo: ['web-design', 'seo'] },
  { id: 'social-3m', label: 'مدیریت شبکه ۳ ماه (باندل)', priceToman: 17_000_000, appliesTo: ['social-media', 'web-design'] },
  { id: 'app-backend', label: 'بک‌اند و API اختصاصی', priceToman: 26_000_000, appliesTo: ['mobile-app'] },
]

export type EstimateInput = {
  serviceSlug: string
  scale: ProjectScale
  addonIds: string[]
  rush: RushLevel
}

export type EstimateBreakdownLine = { label: string; amountToman: number }

export type EstimateResult = {
  centerToman: number
  lowToman: number
  highToman: number
  breakdown: EstimateBreakdownLine[]
  serviceLabel: string
}

const RANGE_FACTOR = 0.15

export function estimatePrice(input: EstimateInput): EstimateResult | null {
  const base = SERVICE_BASES.find((s) => s.slug === input.serviceSlug)
  if (!base) return null

  const scaleMult = SCALE_MULTIPLIERS[input.scale].mult
  const rushMult = RUSH_MULTIPLIERS[input.rush].mult
  const baseLine = Math.round(base.basePriceToman * scaleMult)

  const addonLines: EstimateBreakdownLine[] = []
  let addonsSum = 0
  for (const id of input.addonIds) {
    const addon = ESTIMATOR_ADDONS.find((a) => a.id === id && a.appliesTo.includes(input.serviceSlug))
    if (addon) {
      addonLines.push({ label: addon.label, amountToman: addon.priceToman })
      addonsSum += addon.priceToman
    }
  }

  const subtotal = baseLine + addonsSum
  const center = Math.round(subtotal * rushMult)
  const low = Math.round(center * (1 - RANGE_FACTOR))
  const high = Math.round(center * (1 + RANGE_FACTOR))

  const breakdown: EstimateBreakdownLine[] = [
    {
      label: `${base.label} — مقیاس ${SCALE_MULTIPLIERS[input.scale].label}`,
      amountToman: baseLine,
    },
    ...addonLines,
  ]
  if (rushMult > 1) {
    breakdown.push({
      label: `فوریت (${RUSH_MULTIPLIERS[input.rush].label})`,
      amountToman: center - subtotal,
    })
  }

  return {
    centerToman: center,
    lowToman: low,
    highToman: high,
    breakdown,
    serviceLabel: base.label,
  }
}

/** فرمت تومان برای نمایش */
export function formatToman(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount)
}
