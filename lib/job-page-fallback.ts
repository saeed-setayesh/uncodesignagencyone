import type { PageContent } from '@/types/content'
import { SITE_URGENCY_BAR } from '@/lib/site-urgency'

export function buildJobCityFallbackContent(jobFa: string, cityFa: string): PageContent {
  return {
    metaTitle: `${jobFa} در ${cityFa} — آژانس دیجیتال`.slice(0, 70),
    metaDescription: `فرصت شغلی ${jobFa} در ${cityFa}. مشاوره و همکاری با تیم حرفه‌ای.`.slice(0, 165),
    h1: `${jobFa} — ${cityFa}`,
    heroSubtitle: `اگر به دنبال ${jobFa} در ${cityFa} هستید، با ما در تماس باشید.`,
    urgencyText: SITE_URGENCY_BAR,
    stats: { projects: '+۵۰', satisfaction: '۹۶٪', rating: '۴.۸' },
    benefits: [
      { title: 'تیم حرفه‌ای', desc: 'همکاری در پروژه‌های دیجیتال معتبر.' },
      { title: 'قرارداد شفاف', desc: 'شرایط کاری روشن.' },
      { title: 'رشد مهارت', desc: 'کار روی استک مدرن.' },
      { title: 'انعطاف', desc: 'امکان دورکاری و حضوری بسته به پروژه.' },
    ],
    processSteps: [
      { title: 'ارسال رزومه', desc: 'فرم تماس در سایت', timing: 'روز ۱' },
      { title: 'مصاحبه', desc: 'بررسی تطابق', timing: 'هفته ۱' },
      { title: 'پروژه آزمایشی', desc: 'در صورت نیاز', timing: 'هفته ۲' },
      { title: 'شروع همکاری', desc: 'قرارداد', timing: 'هفته ۳' },
    ],
    testimonials: [
      { text: 'فرآیند استخدام سریع و حرفه‌ای بود.', name: 'کارجو', business: cityFa, initials: 'ک' },
      { text: 'تیم منسجم و پروژه‌های جذاب.', name: 'عضو تیم', business: jobFa, initials: 'ع' },
    ],
    faq: [
      { q: 'نحوهٔ ارسال رزومه؟', a: 'از طریق فرم تماس در سایت.' },
      { q: 'دورکاری ممکن است؟', a: 'بسته به نقش و پروژه، بله.' },
      { q: 'حقوق چگونه است؟', a: 'طبق توافق و تجربه در مصاحبه شفاف می‌شود.' },
      { q: 'ساعت کاری؟', a: 'طبق قرارداد و نوع همکاری.' },
    ],
    ctaHeading: `همکاری در ${jobFa}`,
    ctaSubtext: 'رزومه خود را همین الان بفرستید.',
    whatsappText: `درخواست همکاری برای ${jobFa} در ${cityFa}`,
  }
}
