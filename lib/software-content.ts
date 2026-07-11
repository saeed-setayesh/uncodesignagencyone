import type { Service } from '@/lib/db'
import { isSoftwareProduct } from '@/lib/software-products'

export type SoftwarePageContent = {
  productFa: string
  metaTitle: string
  metaDescription: string
  h1: string
  heroSubtitle: string
  urgencyText: string
  stats: { projects: string; satisfaction: string; rating: string }
  benefits: { title: string; desc: string }[]
  deliverables: { title: string; desc: string }[]
  processSteps: { title: string; desc: string; timing: string }[]
  faq: { q: string; a: string }[]
  ctaHeading: string
  ctaSubtext: string
}

function productLabel(fa: string): string {
  let s = fa.trim()
  for (const p of ['نرم‌افزار ', 'سیستم ', 'پنل ', 'ابزار ', 'پلتفرم ', 'منوی ']) {
    if (s.startsWith(p)) {
      s = s.slice(p.length).trim()
      break
    }
  }
  return s || fa.trim()
}

export function buildSoftwarePageContent(
  row: Pick<Service, 'fa' | 'metaDescription' | 'seoBody' | 'slug'>
): SoftwarePageContent {
  const product = row.fa
  const topic = productLabel(product)
  const blurb = row.metaDescription?.trim() ?? ''
  const hasAi = /AI|هوش مصنوعی|هوشمند/i.test(product)

  const heroSubtitle = blurb
    ? `${blurb} طراحی، توسعه و استقرار اختصاصی با تیم آنکو دیزاین — از MVP تا نسخهٔ سازمانی.`
    : `سفارش ${product} با تحلیل نیاز، UI/UX حرفه‌ای، کد تمیز و پشتیبانی پس از تحویل.`

  return {
    productFa: product,
    metaTitle: `سفارش ${product} — طراحی و توسعه اختصاصی | آنکو دیزاین`.slice(0, 70),
    metaDescription:
      blurb ||
      `طراحی و پیاده‌سازی ${product} برای کسب‌وکار شما. مشاوره رایگان، قیمت شفاف، تحویل مرحله‌ای.`.slice(
        0,
        165
      ),
    h1: `${product} — طراحی و توسعه اختصاصی برای کسب‌وکار شما`,
    heroSubtitle,
    urgencyText: 'مشاوره و برآورد اولیه رایگان — ظرفیت پروژه محدود',
    stats: {
      projects: '+۱۵۰',
      satisfaction: '۹۷٪',
      rating: '۴.۹',
    },
    benefits: [
      {
        title: '100٪ متناسب با فرآیند شما',
        desc: `برخلاف نرم‌افزار آماده، ${topic} دقیقاً مطابق workflow تیم شما ساخته می‌شود.`,
      },
      {
        title: hasAi ? 'هوش مصنوعی یکپارچه' : 'فناوری روز و پایدار',
        desc: hasAi
          ? 'مدل‌های AI، اتوماسیون و گزارش هوشمند در صورت نیاز embed می‌شود.'
          : 'Next.js، PostgreSQL و معماری مقیاس‌پذیر — نه کد legacy.',
      },
      {
        title: 'تحویل مرحله‌ای با دمو',
        desc: 'هر هفته خروجی قابل بررسی؛ بدون انتظار ماه‌ها بدون بازخورد.',
      },
      {
        title: 'پشتیبانی و آموزش',
        desc: 'تیم شما بعد از تحویل مستقل کار می‌کند؛ SLA شفاف.',
      },
    ],
    deliverables: [
      { title: 'تحلیل نیاز و مستندات', desc: 'User story، wireframe و نقشهٔ راه' },
      { title: 'طراحی UI/UX', desc: 'رابط فارسی RTL، موبایل‌فرست' },
      { title: 'توسعه Backend & Frontend', desc: 'API، پنل admin، امنیت' },
      { title: 'تست و استقرار', desc: 'سرور ایران، SSL، backup' },
      { title: 'آموزش و مستندات', desc: 'ویدئو + راهنمای کاربری' },
      ...(hasAi
        ? [{ title: 'ماژول AI', desc: 'Chatbot، پیش‌بینی یا اتوماسیون هوشمند' }]
        : []),
    ],
    processSteps: [
      {
        title: 'مشاوره رایگان',
        desc: 'اهداف، کاربران، بودجه و زمان‌بندی را مشخص می‌کنیم.',
        timing: '۱–۲ روز',
      },
      {
        title: 'پیش‌فاکتور و قرارداد',
        desc: 'قیمت شفاف، milestone و تحویل مرحله‌ای.',
        timing: '۲–۳ روز',
      },
      {
        title: 'طراحی و تأیید UI',
        desc: 'Prototype تعاملی قبل از کدنویسی.',
        timing: '۱–۲ هفته',
      },
      {
        title: 'توسعه و تحویل',
        desc: 'اسپرینت هفتگی، دمو، تست و go-live.',
        timing: '۴–۱۲ هفته',
      },
    ],
    faq: [
      {
        q: `هزینهٔ ${product} چقدر است؟`,
        a: 'بسته به ماژول‌ها و یکپارچگی؛ MVP معمولاً از ۳۲ میلیون تومان و نسخهٔ کامل از ۶۸ میلیون تومان شروع می‌شود. پس از جلسهٔ اولیه پیش‌فاکتور دقیق می‌دهیم.',
      },
      {
        q: 'چقدر طول می‌کشد؟',
        a: 'MVP: ۴–۶ هفته. نسخهٔ کامل: ۸–۱۴ هفته. پروژه‌های سازمانی بر اساس scope.',
      },
      {
        q: 'کد و داده مال کیست؟',
        a: 'کامل متعلق به شماست. سورس‌کد، دیتابیس و مستندات تحویل داده می‌شود.',
      },
      {
        q: 'آیا پشتیبانی دارید؟',
        a: 'بله — ۳ تا ۱۲ ماه پشتیبانی رایگان بسته به پکیج؛ قرارداد SLA برای سازمان‌ها.',
      },
      {
        q: 'آیا با سیستم فعلی ما یکپارچه می‌شود؟',
        a: 'بله — API، webhook و import/export برای حسابداری، SMS و درگاه.',
      },
      {
        q: 'آیا نمونه کار مشابه دارید؟',
        a: 'بله — در جلسهٔ مشاوره نمونه‌های مرتبط با حوزهٔ شما نشان داده می‌شود.',
      },
    ],
    ctaHeading: `آمادهٔ سفارش ${topic} هستید؟`,
    ctaSubtext: 'مشاوره و برآورد اولیه رایگان — همین امروز تماس بگیرید.',
  }
}

export function isSoftwareService(row: Pick<Service, 'slug'>): boolean {
  return isSoftwareProduct(row.slug)
}
