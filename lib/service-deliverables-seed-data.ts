import type { ServiceDeliverables } from '@/types/service-deliverables'

/** محتوای پیش‌فرض تحویل‌ها برای هر اسلاگ سرویس — در seed و fallback مشترک */
export const DELIVERABLES_BY_SLUG: Record<string, ServiceDeliverables> = {
  'web-design': {
    summary:
      'از تحلیل نیاز و وایرفریم تا UI در Figma و پیاده‌سازی با Next.js؛ سایتی می‌سازیم که هم برای گوگل قابل ایندکس است هم برای مشتری شما قابل استفاده و تماس. هر فاز با خروجی قابل‌بررسی تحویل می‌شود.',
    whatWeDo: [
      {
        title: 'تحلیل نیاز و نقشهٔ سایت',
        description: 'جلسهٔ کشف، تعریف صفحات، مسیر کاربر و اولویت‌بندی MVP قبل از طراحی.',
        icon: 'ClipboardList',
      },
      {
        title: 'طراحی UI در Figma',
        description: 'سیستم رنگ و تایپوگرافی برند، موبایل‌فرست و کامپوننت‌های تکرارشونده.',
        icon: 'Palette',
      },
      {
        title: 'توسعه با Next.js و TypeScript',
        description: 'کد تمیز، SSR/SSG مناسب سئو، فرم تماس، بلاگ و صفحات پویا.',
        icon: 'Code2',
      },
      {
        title: 'سئوی فنی اولیه',
        description: 'متاتگ، sitemap، robots، Core Web Vitals و اسکیمای پایه.',
        icon: 'Search',
      },
      {
        title: 'اتصال دامنه و استقرار',
        description: 'راه‌اندازی روی هاست/Vercel، SSL، ریدایرکت و مانیتورینگ اولیه.',
        icon: 'Server',
      },
      {
        title: 'آموزش و تحویل مستندات',
        description: 'ویدیو یا جلسهٔ آموزش پنل، چک‌لیست نگهداری و تحویل سورس.',
        icon: 'GraduationCap',
      },
    ],
    tools: ['Figma', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel', 'Google Search Console'],
    outcomes: [
      { metric: '۱۴ روز', description: 'میانگین تحویل لندینگ استاندارد (بسته به مقیاس)' },
      { metric: '۹۷٪', description: 'رضایت اعلام‌شده پس از تحویل نسخهٔ اول' },
      { metric: 'موبایل‌اول', description: 'طراحی با تمرکز بر ترافیک موبایل ایران' },
    ],
    notIncluded: ['تولید محتوای بلندمدت ماهانه', 'کمپین تبلیغاتی پولی', 'نگهداری سرور پس از دورهٔ پشتیبانی'],
  },
  seo: {
    summary:
      'سئو برای ما یعنی ترکیب سلامت فنی سایت، محتوای هدفمند و گزارش شفاف — نه لیست لینک تصادفی. هر ماه می‌دانید چه کار شد، چه رتبه‌ای حرکت کرد و قدم بعدی چیست.',
    whatWeDo: [
      {
        title: 'ممیزی فنی و Lighthouse',
        description: 'سرعت، کرول، ایندکس، خطاهای Search Console و رفع مشکلات بحرانی.',
        icon: 'Gauge',
      },
      {
        title: 'تحقیق کلمات کلیدی',
        description: 'اولویت long-tail، نقشهٔ صفحات فرود و تطابق با نیت جستجوی ایرانی.',
        icon: 'KeyRound',
      },
      {
        title: 'بهینه‌سازی on-page',
        description: 'عنوان، متا، H1-H3، لینک‌دهی داخلی و اسکیمای FAQ/LocalBusiness.',
        icon: 'FileSearch',
      },
      {
        title: 'استراتژی محتوا',
        description: 'تقویم مقاله، خوشه‌بندی موضوعی و به‌روزرسانی صفحات قدیمی.',
        icon: 'PenLine',
      },
      {
        title: 'لینک‌سازی امن',
        description: 'رپورتاژ و همکاری‌های مرتبط بدون اسپم و آسیب به دامنه.',
        icon: 'Link2',
      },
      {
        title: 'گزارش ماهانه',
        description: 'ترافیک، رتبه، صفحات برتر و اقدام‌های پیشنهادی ماه بعد.',
        icon: 'BarChart3',
      },
    ],
    tools: ['Google Search Console', 'GA4', 'Ahrefs', 'Screaming Frog', 'Lighthouse', 'Schema.org'],
    outcomes: [
      { metric: '۳–۶ ماه', description: 'افق معمول برای اثر ارگانیک پایدار' },
      { metric: 'شفاف', description: 'گزارش فارسی قابل فهم برای مدیر غیرفنی' },
      { metric: 'فنی+محتوا', description: 'هر دو لایه هم‌زمان پوشش داده می‌شود' },
    ],
    notIncluded: ['تبلیغات کلیکی Google Ads', 'مدیریت شبکه‌های اجتماعی', 'بازنویسی کامل سایت بدون قرارداد جدا'],
  },
  content: {
    summary:
      'محتوایی می‌نویسیم که هم خوانده شود هم به سئو و فروش کمک کند: مقاله، صفحهٔ محصول، ایمیل و کپشن — با لحن یکدست برند شما و تقویم انتشار.',
    whatWeDo: [
      {
        title: 'تعریف لحن و پیام برند',
        description: 'راهنمای سبک نگارش، واژگان مجاز و ممنوع برای تیم شما.',
        icon: 'BookOpen',
      },
      {
        title: 'تقویم محتوایی',
        description: 'برنامهٔ هفتگی/ماهانه برای بلاگ، شبکه و خبرنامه.',
        icon: 'Calendar',
      },
      {
        title: 'مقاله و بلاگ سئو',
        description: 'تحقیق موضوع، ساختار H2، لینک داخلی و CTA در انتها.',
        icon: 'Newspaper',
      },
      {
        title: 'متن صفحهٔ محصول و لندینگ',
        description: 'عنوان جذاب، مزایا، اعتراضات و دعوت به اقدام.',
        icon: 'LayoutTemplate',
      },
      {
        title: 'کپشن و سناریوی ویدیو',
        description: 'ریلز، استوری و اسکریپت کوتاه برای تیم تولید شما.',
        icon: 'Clapperboard',
      },
      {
        title: 'بازبینی و ویرایش',
        description: 'یکدست‌سازی، غلط‌گیری و هم‌راستایی با کلمات کلیدی.',
        icon: 'SpellCheck',
      },
    ],
    tools: ['Google Docs', 'Notion', 'SurferSEO', 'Grammarly', 'Canva'],
    outcomes: [
      { metric: '۴–۸', description: 'قطعه محتوا در ماه (بسته به قرارداد)' },
      { metric: 'سئو‌پسند', description: 'ساختار مناسب برای ایندکس و خوانایی' },
      { metric: 'برند', description: 'لحن ثابت در همه کانال‌ها' },
    ],
    notIncluded: ['عکاسی و فیلمبرداری حرفه‌ای', 'ترجمه رسمی قانونی', 'مدیریت اکانت تبلیغاتی'],
  },
  'social-media': {
    summary:
      'حضور شما در اینستاگرام و لینکدین را با استراتژی، تقویم و گزارش عملکرد مدیریت می‌کنیم — تمرکز روی لید و اعتماد، نه فقط تعداد پست.',
    whatWeDo: [
      {
        title: 'استراتژی کانال و مخاطب',
        description: 'پرسونا، پیام اصلی و KPI هر شبکه (فالوور، لید، فروش).',
        icon: 'Target',
      },
      {
        title: 'تقویم و برنامهٔ انتشار',
        description: 'ریتم هفتگی، زمان‌بندی و نوع محتوا (آموزشی، فروش، اعتماد).',
        icon: 'CalendarDays',
      },
      {
        title: 'طراحی بصری پست و استوری',
        description: 'قالب ثابت برند، استوری تعاملی و کاور هایلایت.',
        icon: 'Image',
      },
      {
        title: 'کپشن و هشتگ هدفمند',
        description: 'CTA شفاف، هشتگ ترکیبی و A/B روی عنوان.',
        icon: 'Hash',
      },
      {
        title: 'مدیریت تعامل',
        description: 'پاسخ دایرکت و کامنت در ساعات کاری توافق‌شده.',
        icon: 'MessageCircle',
      },
      {
        title: 'گزارش ماهانه',
        description: 'رشد، تعامل، بهترین پست و پیشنهاد ماه بعد.',
        icon: 'TrendingUp',
      },
    ],
    tools: ['Meta Business Suite', 'Instagram', 'LinkedIn', 'Canva', 'Metricool'],
    outcomes: [
      { metric: '۲–۴', description: 'پست حرفه‌ای در هفته (قابل تنظیم)' },
      { metric: 'یکپارچه', description: 'هم‌راستا با سایت و کمپین‌های فروش' },
      { metric: 'گزارش', description: 'اعداد واقعی، نه فقط اسکرین‌شات' },
    ],
    notIncluded: ['بودجه تبلیغات Boost', 'اینفلوئنسر مارکتینگ', 'پاسخگویی ۲۴ ساعته'],
  },
  bot: {
    summary:
      'ربات تلگرام، واتساپ یا وب‌چت می‌سازیم که سوالات تکراری را جواب دهد، لید جمع کند و در صورت نیاز به اپراتور انسانی وصل شود.',
    whatWeDo: [
      {
        title: 'طراحی جریان گفتگو',
        description: 'درخت سوال، شاخه‌ها و fallback برای پیام نامفهوم.',
        icon: 'GitBranch',
      },
      {
        title: 'اتصال API و وب‌هوک',
        description: 'CRM، فرم سایت، Google Sheet یا پایگاه داده شما.',
        icon: 'Plug',
      },
      {
        title: 'پاسخ هوشمند (اختیاری)',
        description: 'ترکیب FAQ ثابت با LLM برای سوالات باز در حدود توافق‌شده.',
        icon: 'Bot',
      },
      {
        title: 'جمع‌آوری لید',
        description: 'نام، موبایل، خدمت موردنظر و ارسال به تیم فروش.',
        icon: 'UserPlus',
      },
      {
        title: 'پنل گزارش و لاگ',
        description: 'تعداد گفتگو، نرخ تبدیل و پیام‌های پرتکرار.',
        icon: 'LineChart',
      },
      {
        title: 'استقرار و نگهداری',
        description: 'هاست ربات، به‌روزرسانی پاسخ‌ها و مانیتورینگ.',
        icon: 'Cloud',
      },
    ],
    tools: ['Node.js', 'Telegram Bot API', 'WhatsApp Business API', 'n8n', 'PostgreSQL'],
    outcomes: [
      { metric: '۲۴/۷', description: 'پاسخ اولیه بدون معطلی تیم' },
      { metric: 'کمتر', description: 'کاهش تماس‌های تکراری پشتیبانی' },
      { metric: 'لید', description: 'ثبت خودکار در CRM یا شیت' },
    ],
    notIncluded: ['پشتیبانی انسانی شبانه', 'توسعه اپ موبایل بومی', 'خرید شماره واتساپ رسمی'],
  },
  'site-support': {
    summary:
      'پشتیبانی سایت یعنی آپدیت امن، بک‌آپ، رفع باگ و پاسخ سریع وقتی سایت down است — وردپرس یا Next.js، با SLA شفاف.',
    whatWeDo: [
      {
        title: 'مانیتورینگ uptime',
        description: 'هشدار فوری در قطعی یا کندی غیرعادی.',
        icon: 'Activity',
      },
      {
        title: 'بک‌آپ دوره‌ای',
        description: 'فایل + دیتابیس با بازیابی تست‌شده.',
        icon: 'HardDrive',
      },
      {
        title: 'به‌روزرسانی امنیتی',
        description: 'پلاگین، هسته و وابستگی‌های Node بدون شکستن سایت.',
        icon: 'Shield',
      },
      {
        title: 'رفع باگ و تغییرات کوچک',
        description: 'اصلاح متن، فرم، لینک و باگ UI در سقف ساعات ماهانه.',
        icon: 'Wrench',
      },
      {
        title: 'بهینه‌سازی سرعت',
        description: 'کش، تصویر و CDN در صورت نیاز.',
        icon: 'Zap',
      },
      {
        title: 'گزارش ماهانه',
        description: 'کارهای انجام‌شده، ریسک‌ها و پیشنهاد بهبود.',
        icon: 'FileText',
      },
    ],
    tools: ['WordPress', 'Next.js', 'Cloudflare', 'UptimeRobot', 'Git'],
    outcomes: [
      { metric: '<۴ ساعت', description: 'پاسخ اولیه در ساعات کاری (SLA قراردادی)' },
      { metric: 'امن', description: 'کاهش ریسک هک و از دست رفتن داده' },
      { metric: 'آرامش', description: 'یک نقطهٔ تماس برای همهٔ مسائل فنی' },
    ],
    notIncluded: ['طراحی مجدد کامل سایت', 'سئوی عمیق ماهانه', 'توسعه فیچر بزرگ جدید'],
  },
  'e-commerce': {
    summary:
      'فروشگاه اینترنتی با ووکامرس یا سفارشی: کاتالوگ، درگاه، انبار، ارسال و تجربهٔ خرید موبایل — آمادهٔ فروش واقعی، نه فقط ویترین.',
    whatWeDo: [
      {
        title: 'معماری فروشگاه و SKU',
        description: 'دسته‌بندی، ویژگی محصول، موجودی و قیمت‌گذاری.',
        icon: 'Package',
      },
      {
        title: 'طراحی صفحهٔ محصول و سبد',
        description: 'تصاویر، فیلتر، upsell و checkout کم‌اصطکاک.',
        icon: 'ShoppingCart',
      },
      {
        title: 'درگاه و پرداخت',
        description: 'زرین‌پال، سامان، ملت و تست تراکنش واقعی.',
        icon: 'CreditCard',
      },
      {
        title: 'حمل و نقل و استان',
        description: 'روش ارسال، هزینه پویا و پیگیری سفارش.',
        icon: 'Truck',
      },
      {
        title: 'سئو فروشگاه',
        description: 'URL تمیز، اسکیمای Product و بهینه‌سازی سرعت.',
        icon: 'Search',
      },
      {
        title: 'آموزش مدیریت سفارش',
        description: 'پنل ادمین، گزارش فروش و فرآیند مرجوعی.',
        icon: 'GraduationCap',
      },
    ],
    tools: ['WooCommerce', 'WordPress', 'Next.js', 'Zarinpal', 'WooCommerce Shipping'],
    outcomes: [
      { metric: 'موبایل', description: 'بیش از ۷۰٪ خریدها از موبایل — UX متناسب' },
      { metric: 'درگاه', description: 'تست پرداخت قبل از لانچ' },
      { metric: 'مقیاس', description: 'از ۵۰ تا ۵۰۰۰ SKU قابل برنامه‌ریزی' },
    ],
    notIncluded: ['انبارداری فیزیکی و بسته‌بندی', 'حسابداری رسمی', 'عکاسی محصول حرفه‌ای'],
  },
  'mobile-app': {
    summary:
      'اپ اندروید و iOS با Flutter یا نیتیو: از UX و پروتوتایپ تا انتشار در کافه‌بازار و استور — هم‌راستا با API و بک‌اند موجود شما.',
    whatWeDo: [
      {
        title: 'UX و پروتوتایپ',
        description: 'جریان کاربر، wireframe و تست سریع قبل از کد.',
        icon: 'Smartphone',
      },
      {
        title: 'توسعه Flutter',
        description: 'یک کدبیس برای دو پلتفرم با عملکرد نزدیک نیتیو.',
        icon: 'Code2',
      },
      {
        title: 'اتصال API',
        description: 'احراز، پرداخت درون‌برنامه و sync آفلاین در صورت نیاز.',
        icon: 'Plug',
      },
      {
        title: 'اعلان push',
        description: 'Firebase و سناریوهای بازگشت کاربر.',
        icon: 'Bell',
      },
      {
        title: 'تست و QA',
        description: 'دستگاه‌های مختلف، crash reporting و رفع باگ.',
        icon: 'Bug',
      },
      {
        title: 'انتشار استور',
        description: 'کافه‌بازار، گوگل پلی و راهنمای به‌روزرسانی.',
        icon: 'Upload',
      },
    ],
    tools: ['Flutter', 'Firebase', 'REST API', 'Figma', 'Cafe Bazaar', 'Google Play'],
    outcomes: [
      { metric: '۲ پلتفرم', description: 'اندروید + iOS از یک پایه کد' },
      { metric: 'فازبندی', description: 'MVP سریع و فیچر در نسخه‌های بعد' },
      { metric: 'پشتیبانی', description: 'رفع باگ پس از لانچ در قرارداد' },
    ],
    notIncluded: ['بک‌اند سنگین اگر جدا قرارداد نشود', 'تبلیغات نصب (UA)', 'طراحی بازی'],
  },
}

DELIVERABLES_BY_SLUG.ecommerce = DELIVERABLES_BY_SLUG['e-commerce']
DELIVERABLES_BY_SLUG['mobile-application'] = DELIVERABLES_BY_SLUG['mobile-app']
DELIVERABLES_BY_SLUG['content-creation'] = DELIVERABLES_BY_SLUG.content
DELIVERABLES_BY_SLUG['social-media-management'] = DELIVERABLES_BY_SLUG['social-media']
DELIVERABLES_BY_SLUG['support-and-maintenance'] = DELIVERABLES_BY_SLUG['site-support']
