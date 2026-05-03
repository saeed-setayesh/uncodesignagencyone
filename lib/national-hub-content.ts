import type { Industry } from '@/lib/db'
import type { PageContent } from '@/types/content'
import { SITE_URGENCY_BAR } from '@/lib/site-urgency'

const AREA = 'سراسر ایران'

/** SEO-rich placeholder when no DB row exists for (industry × «ایران» national hub). Admin AI can replace later. */
export function buildNationalHubFallbackContent(
  industry: Industry,
  _serviceSlug: string,
  serviceFa: string
): PageContent {
  const titleBase = `${serviceFa} ${industry.fa}`
  const metaTitle =
    titleBase.length <= 70 ? `${titleBase} — ${AREA}` : `${titleBase.slice(0, 55)}… — ${AREA}`.slice(0, 70)

  const metaDescription = `خدمات ${serviceFa} حرفه‌ای برای ${industry.fa} در ${AREA}. مشاوره، قیمت شفاف، تحویل سریع و پشتیبانی — همین امروز درخواست دهید.`.slice(
    0,
    165
  )

  return {
    metaTitle: metaTitle.slice(0, 70),
    metaDescription,
    h1: `${serviceFa} تخصصی برای ${industry.fa}`,
    heroSubtitle: `آژانس ما ${serviceFa} را برای کسب‌وکارهای ${industry.fa} در ${AREA} طراحی کرده است؛ شفاف، سریع و متناسب با نیاز واقعی بازار.`,
    urgencyText: SITE_URGENCY_BAR,
    stats: { projects: '+۱۸۰', satisfaction: '۹۸٪', rating: '۴.۹' },
    benefits: [
      {
        title: 'تمرکز روی صنعت شما',
        desc: `استراتژی و اجرای ${serviceFa} مخصوص ${industry.fa}، نه قالب‌های کلی.`,
      },
      {
        title: 'سئو و بازاریابی محور',
        desc: 'ساختار محتوا و لندینگ‌ها برای رتبه‌گیری در گوگل و تبدیل بازدید به لید.',
      },
      {
        title: 'قرارداد شفاف',
        desc: 'بودجه و فازبندی مشخص؛ بدون هزینه‌های پنهان.',
      },
      {
        title: 'پشتیبانی واقعی',
        desc: 'تیم فنی در دسترس پس از تحویل؛ آموزش و به‌روزرسانی.',
      },
    ],
    processSteps: [
      { title: 'مشاوره و تحلیل نیاز', desc: `بررسی اهداف ${industry.fa} و مخاطب هدف در ${AREA}`, timing: 'روز ۱–۲' },
      { title: 'پیشنهاد فنی و محتوا', desc: 'ارائه اسکچ، نقشه سایت یا نقشه سئو/کمپین', timing: 'روز ۳–۷' },
      { title: 'اجرای پروژه', desc: 'توسعه، تست، بهینه‌سازی سرعت و تجربه کاربری', timing: '۲ تا ۶ هفته' },
      { title: 'تحویل و رشد', desc: 'آموزش، گزارش، و بهبود مداوم بر اساس داده', timing: 'پس از تحویل' },
    ],
    testimonials: [
      {
        text: `کیفیت کار و پیگیری تیم برای ${serviceFa} ${industry.fa} فراتر از انتظار بود؛ تعداد تماس‌های ما رشد کرد.`,
        name: 'مدیر یک کسب‌وکار',
        business: `${industry.fa} — ${AREA}`,
        initials: 'م',
      },
      {
        text: 'قیمت شفاف بود و تحویل به‌موقع؛ برای ورود جدی به آنلاین همین را توصیه می‌کنم.',
        name: 'مالک مجموعه',
        business: industry.fa,
        initials: 'م',
      },
    ],
    faq: [
      {
        q: `چرا ${serviceFa} اختصاصی برای ${industry.fa} مهم است؟`,
        a: `هر صنعت مسیر و مخاطب متفاوتی دارد؛ ${serviceFa} باید با زبان همان بازار و نیاز واقعی مشتری شما هم‌راستا باشد.`,
      },
      {
        q: `آیا در تمام شهرها خدمت می‌دهید؟`,
        a: `بله؛ پروژه‌ها را به‌صورت ریموت مدیریت می‌کنیم و در صورت نیاز جلسات حضوری در شهرهای منتخب هماهنگ می‌شود.`,
      },
      {
        q: 'زمان تا تحویل معمولاً چقدر است؟',
        a: 'بسته به پیچیدگی بین چند هفته تا چند ماه؛ در قرارداد فازها و تاریخ تحویل شفاف ذکر می‌شود.',
      },
      {
        q: 'چطور قیمت تمام می‌شود؟',
        a: 'پس از بررسی دامنه پروژه، پیشنهاد بودجه مرحله‌به‌مرحله ارسال می‌شود؛ بدون هزینه پنهان.',
      },
    ],
    ctaHeading: `مشاوره رایگان ${serviceFa} برای ${industry.fa}`,
    ctaSubtext: 'یک تماس کوتاه می‌تواند مسیر رشد آنلاین شما را روشن کند.',
    whatsappText: `سلام؛ درباره ${serviceFa} برای ${industry.fa} در ${AREA} می‌خواهم مشاوره بگیرم`,
  }
}
