export type PortfolioShowcaseProject = {
  id: string
  title: string
  /** معرفی کوتاه کل پروژه */
  description: string
  /** چند نما از همان پروژه (فایل‌های داخل /public/portfolio) */
  images: string[]
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
    images: ['/portfolio/crm.avif', '/portfolio/crm1.avif'],
  },
  {
    id: 'erp',
    title: 'سامانه ERP و داشبورد مدیریت',
    description:
      'یکپارچه‌سازی داده مالی و عملیات با نمودار شاخص و کارت‌های تصمیم‌سازی برای مدیران و انبار و سفارش.',
    images: ['/portfolio/erp.avif', '/portfolio/erp1.avif'],
  },
  {
    id: 'flight',
    title: 'رزرو و پلتفرم سفر (پرواز)',
    description:
      'جریان رزرو چندمرحله‌ای، جستجو و فیلتر نتایج با تمرکز روی موبایل و وضوح قیمت و زمان پرواز.',
    images: ['/portfolio/flight.avif', '/portfolio/flight1.avif'],
  },
  {
    id: 'gold',
    title: 'فروشگاه و برند طلا و جواهر',
    description:
      'ویترین بصری، کاتالوگ محصول، اطلاعات عیار و وزن و دعوت به اقدام برای سفارش و اعتماد به برند.',
    images: [
      '/portfolio/gold1.avif',
      '/portfolio/gold2.avif',
      '/portfolio/gold3.avif',
      '/portfolio/gold4.avif',
    ],
  },
  {
    id: 'cinema',
    title: 'سینما، بلیت و کمپین اکران',
    description:
      'لیست فیلم و سانس، رزرو صندلی، لندینگ تبلیغاتی و رابط موبایل با رنگ‌بندی برند سینمایی و تمرکز بر خرید بلیت.',
    images: [
      '/portfolio/movie1.avif',
      '/portfolio/movie2.avif',
      '/portfolio/movie3.avif',
      '/portfolio/movie4.avif',
      '/portfolio/movie5.avif',
      '/portfolio/movie6.avif',
    ],
  },
  {
    id: 'orbit-vc',
    title: 'وب‌سایت صندوق سرمایه‌گذاری',
    description: 'معرفی تیم، تز سرمایه‌گذاری و درخواست جلسه برای استارتاپ‌ها و هم‌سرمایه‌گذاران.',
    images: ['/portfolio/orbit-vc.avif'],
  },
  {
    id: 'ramzarz',
    title: 'پلتفرم رمزارز',
    description: 'وضوح اطلاعات خرید و فروش، امنیت و احراز و داشبورد کاربری ساده و قابل فهم.',
    images: ['/portfolio/ramzarz.avif'],
  },
]
