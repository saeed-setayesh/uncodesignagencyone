export type PortfolioCategory =
  | 'وب‌سایت'
  | 'فروشگاه'
  | 'داشبورد/پنل'
  | 'موبایل'
  | 'لندینگ'
  | 'برند'

export type PortfolioShowcaseProject = {
  id: string
  title: string
  /** معرفی کوتاه کل پروژه */
  description: string
  /** چند نما از همان پروژه (فایل‌های داخل /public/portfolio) */
  images: string[]
  category: PortfolioCategory
  industry: string
  tags: string[]
  /** یک خط نتیجهٔ قابل اندازه‌گیری (اختیاری) */
  metrics?: string
}

/** مسیر ایمن برای فایل‌های داخل public/portfolio (فاصله و نویسهٔ خاص در نام فایل) */
function pf(filename: string): string {
  return `/portfolio/${encodeURIComponent(filename)}`
}

/** در نام اسکرین‌شات‌های macOS قبل از «PM» فاصلهٔ باریک بدون شکست خط (U+202F) استفاده می‌شود */
const NS = '\u202f'
function macShot(time: string): string {
  return pf(`Screenshot 2026-05-12 at ${time}${NS}PM.png`)
}

/**
 * پروژه‌های گالری: فایل‌هایی که پیشوند مشترک دارند (مثل crm + crm1) یک پروژه‌اند.
 * فایل‌ها باید در public/portfolio کپی شوند.
 */
export const PORTFOLIO_SHOWCASE_PROJECTS: PortfolioShowcaseProject[] = [
  {
    id: 'crm',
    title: 'پنل CRM و مدیریت ارتباط با مشتری',
    description:
      'داشبورد لید و قیف فروش، وظایف تیمی و نمای کلی ارتباطات؛ مناسب تیم فروش B2B که به گزارش لحظه‌ای نیاز دارد.',
    images: [pf('crm.avif'), pf('crm1.avif')],
    category: 'داشبورد/پنل',
    industry: 'فناوری و B2B',
    tags: ['Next.js', 'داشبورد', 'فروش'],
    metrics: 'قیف فروش و گزارش لحظه‌ای در یک نما',
  },
  {
    id: 'erp',
    title: 'سامانه ERP و داشبورد مدیریت',
    description:
      'یکپارچه‌سازی داده مالی و عملیات با نمودار شاخص و کارت‌های تصمیم‌سازی برای مدیران و انبار و سفارش.',
    images: [pf('erp.avif'), pf('erp1.avif')],
    category: 'داشبورد/پنل',
    industry: 'عملیات و مالی',
    tags: ['ERP', 'گزارش', 'مدیریت'],
    metrics: 'شاخص‌های مالی و عملیات در یک داشبورد',
  },
  {
    id: 'flight',
    title: 'رزرو و پلتفرم سفر (پرواز)',
    description:
      'جریان رزرو چندمرحله‌ای، جستجو و فیلتر نتایج با تمرکز روی موبایل و وضوح قیمت و زمان پرواز.',
    images: [pf('flight.avif'), pf('flight1.avif')],
    category: 'وب‌سایت',
    industry: 'گردشگری و سفر',
    tags: ['رزرو', 'موبایل', 'UX'],
    metrics: 'جریان رزرو چندمرحله‌ای با تمرکز موبایل',
  },
  {
    id: 'gold',
    title: 'فروشگاه و برند طلا و جواهر',
    description:
      'ویترین بصری، کاتالوگ محصول، اطلاعات عیار و وزن و دعوت به اقدام برای سفارش و اعتماد به برند.',
    images: [pf('gold1.avif'), pf('gold2.avif'), pf('gold3.avif'), pf('gold4.avif')],
    category: 'فروشگاه',
    industry: 'طلا و جواهر',
    tags: ['ووکامرس', 'کاتالوگ', 'برند'],
    metrics: 'ویترین بصری با جزئیات عیار و وزن',
  },
  {
    id: 'cinema',
    title: 'سینما، بلیت و کمپین اکران',
    description:
      'لیست فیلم و سانس، رزرو صندلی، لندینگ تبلیغاتی و رابط موبایل با رنگ‌بندی برند سینمایی و تمرکز بر خرید بلیت.',
    images: [
      pf('movie1.avif'),
      pf('movie2.avif'),
      pf('movie3.avif'),
      pf('movie4.avif'),
      pf('movie5.avif'),
      pf('movie6.avif'),
    ],
    category: 'وب‌سایت',
    industry: 'سینما و سرگرمی',
    tags: ['بلیت', 'رزرو', 'کمپین'],
    metrics: 'رزرو سانس و بلیت با UX موبایل',
  },
  {
    id: 'orbit-vc',
    title: 'وب‌سایت صندوق سرمایه‌گذاری',
    description: 'معرفی تیم، تز سرمایه‌گذاری و درخواست جلسه برای استارتاپ‌ها و هم‌سرمایه‌گذاران.',
    images: [pf('orbit-vc.avif')],
    category: 'لندینگ',
    industry: 'سرمایه‌گذاری',
    tags: ['VC', 'لندینگ', 'برند'],
    metrics: 'مسیر درخواست جلسه برای استارتاپ‌ها',
  },
  {
    id: 'ramzarz',
    title: 'پلتفرم رمزارز',
    description: 'وضوح اطلاعات خرید و فروش، امنیت و احراز و داشبورد کاربری ساده و قابل فهم.',
    images: [pf('ramzarz.avif')],
    category: 'داشبورد/پنل',
    industry: 'فین‌تک',
    tags: ['امنیت', 'داشبورد', 'احراز'],
    metrics: 'داشبورد معامله با تاکید بر شفافیت',
  },
  {
    id: 'uni-portal',
    title: 'پورتال و صفحات جزئیات آموزشی',
    description:
      'جریان اطلاعات دوره و واحد، جزئیات برنامهٔ درسی و چیدمان مناسب مطالعهٔ طولانی روی وب و موبایل.',
    images: [pf('Uni Details page.png'), pf('Uni Details page (2).png')],
    category: 'وب‌سایت',
    industry: 'آموزش',
    tags: ['پورتال', 'Next.js', 'محتوا'],
    metrics: 'صفحات جزئیات دوره با خوانایی بالا',
  },
  {
    id: 'home-landing-draft',
    title: 'لندینگ و صفحهٔ اصلی محصول',
    description: 'هیرو، بلوک‌های اعتماد و مسیر دعوت به اقدام برای معرفی سریع محصول یا سرویس.',
    images: [pf('Home Draft.png')],
    category: 'لندینگ',
    industry: 'SaaS و محصول',
    tags: ['لندینگ', 'تبدیل', 'برند'],
    metrics: 'هیرو و CTA برای معرفی محصول',
  },
  {
    id: 'product-dashboard-views',
    title: 'نماهای داشبورد و محصول',
    description: 'چند نما از رابط تحویلی در حوزهٔ SaaS، گزارش و مدیریت با تمرکز روی خوانایی و سلسله‌مراتب بصری.',
    images: [
      macShot('7.00.29'),
      macShot('7.00.36'),
      macShot('7.00.51'),
      macShot('7.04.03'),
      macShot('7.04.20'),
      macShot('7.05.47'),
      macShot('7.06.13'),
      macShot('7.07.35'),
    ],
    category: 'داشبورد/پنل',
    industry: 'SaaS و محصول',
    tags: ['SaaS', 'داشبورد', 'Tailwind'],
    metrics: 'سلسله‌مراتب بصری برای گزارش و مدیریت',
  },
]

/** صنایع یکتا برای فیلتر چیپ */
export function getPortfolioIndustries(): string[] {
  const set = new Set(PORTFOLIO_SHOWCASE_PROJECTS.map((p) => p.industry))
  return ['همه', ...Array.from(set)]
}

export type PortfolioCarouselSlide = { src: string; alt: string }

/** همهٔ تصاویر پشت سر هم؛ برای کاروسل یک‌خطی در صفحات لندینگ */
export function getFlattenedPortfolioSlides(): PortfolioCarouselSlide[] {
  return PORTFOLIO_SHOWCASE_PROJECTS.flatMap((p) => p.images.map((src) => ({ src, alt: p.title })))
}
