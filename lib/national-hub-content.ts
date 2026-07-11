import type { Industry } from "@/lib/db";
import type { PageContent } from "@/types/content";
import { SITE_URGENCY_BAR } from "@/lib/site-urgency";

const AREA = "سراسر ایران";

/** وقتی ردیف GeneratedPage نیست — مخاطب صاحب کسب‌وکار است که می‌خواهد همین سرویس را از آژانس بگیرد، نه متن‌های مبهم فقط برای سئو */
export function buildNationalHubFallbackContent(
  industry: Industry,
  _serviceSlug: string,
  serviceFa: string,
): PageContent {
  const titleBase = `${serviceFa} برای ${industry.fa}`;
  const metaTitle =
    titleBase.length <= 70
      ? `${titleBase} — ${AREA}`
      : `${titleBase.slice(0, 55)}… — ${AREA}`.slice(0, 70);

  const metaDescription =
    `به ${serviceFa} برای ${industry.fa} نیاز دارید؟ تماس بگیرید — ${AREA}، قیمت شفاف.`.slice(
      0,
      165,
    );

  return {
    metaTitle: metaTitle.slice(0, 70),
    metaDescription,
    h1: `${serviceFa} حرفه‌ای برای کسب‌وکارهای ${industry.fa}`,
    /** یک جمله: نیاز؟ تماس. */
    heroSubtitle: `به ${serviceFa} برای ${industry.fa} نیاز دارید؟ با ما تماس بگیرید —قیمت و زمان بندی مشخص بدون نیاز به پیش پرداخت، اجرا در ${AREA}.`,
    urgencyText: SITE_URGENCY_BAR,
    stats: { projects: "+۱۸۰", satisfaction: "۹۸٪", rating: "۴.۹" },
    benefits: [
      {
        title: "برای کارفرما، نه شعار تبلیغاتی",
        desc: `اجرای ${serviceFa} متناسب با برند و نیاز واقعی ${industry.fa} شما؛ قرارداد و خروجی هر مرحله قبل از شروع مشخص است.`,
      },
      {
        title: "یک تماس، مسیر روشن",
        desc: "نیاز و بودجه را می‌گویید؛ ما نقشهٔ کار، زمان تقریبی و هزینهٔ مرحله‌ای را برمی‌گردانیم — بدون ابهام.",
      },
      {
        title: "اجرای تخصصی همین صنف",
        desc: `زبان محتوا، ساختار لندینگ یا کمپین با مخاطب ${industry.fa} هماهنگ است؛ قالب آمادهٔ شهر دیگر تحویل نمی‌گیرید.`,
      },
      {
        title: "همراهی تا تحویل و بعدش",
        desc: "پس از تحویل، در صورت توافق آموزش، اصلاحات و پشتیبانی در دسترس است.",
      },
    ],
    processSteps: [
      {
        title: "تماس یا درخواست",
        desc: `می‌گویید چه می‌خواهید؛ برای ${industry.fa} و ${serviceFa} هم‌تراز می‌کنیم.`,
        timing: "روز ۱–۲",
      },
      {
        title: "پیشنهاد فنی و قیمت",
        desc: "اسکوپ، زمان‌بندی و هزینهٔ هر فاز به‌صورت شفاف روی کاغذ",
        timing: "همان هفته",
      },
      {
        title: "اجرای پروژه",
        desc: `${serviceFa} تا تحویل طبق قرارداد؛ گزارش پیشرفت`,
        timing: "۲ تا ۶ هفته و بیشتر بسته به حجم",
      },
      {
        title: "تحویل و ادامه",
        desc: "آموزش، بهینه‌سازی و در صورت نیاز قرارداد نگهداری",
        timing: "پس از تحویل",
      },
    ],
    testimonials: [
      {
        text: `برای ${industry.fa} همان چیزی را که برای رشد آنلاین لازم داشتیم با تماس اول روشن کردند؛ ${serviceFa} را تحویل گرفتیم بدون حاشیه.`,
        name: "مدیر یک کسب‌وکار",
        business: `${industry.fa} — ${AREA}`,
        initials: "م",
      },
      {
        text: "قرارداد شفاف بود؛ می‌دانستیم هر فاز چه می‌شود و چقدر تمام می‌شود.",
        name: "مالک مجموعه",
        business: industry.fa,
        initials: "م",
      },
    ],
    faq: [
      {
        q: `چطور برای ${serviceFa} و ${industry.fa} با شما شروع کنم؟`,
        a: `تماس یا پیام در واتساپ/فرم؛ نیاز کوتاه را بگویید. پیشنهاد اولیه و محدودهٔ هزینه را می‌گیرید؛ اگر جلو رفتید قرارداد می‌بندیم.`,
      },
      {
        q: `آیا در همهٔ شهرها کار می‌کنید؟`,
        a: `بله؛ پروژه را از راه دور پیش می‌بریم. برای هر شهر هم می‌توانید از صفحهٔ همان شهر همان صنف وارد شوید تا هماهنگی محلی ذکر شود.`,
      },
      {
        q: "زمان تحویل معمولاً چقدر است؟",
        a: "بسته به حجم؛ بعد از دیدن اسکوپ، بازهٔ هفته‌ای یا ماهانه در پیشنهاد نوشته می‌شود.",
      },
      {
        q: "قیمت چطور تمام می‌شود؟",
        a: "پیشنهاد مرحله‌به‌مرحله؛ بدون هزینهٔ پنهان در همان بخش‌های اصلی قرارداد.",
      },
    ],
    ctaHeading: `نیاز به ${serviceFa} دارید؟ تماس بگیرید`,
    ctaSubtext: "یک تماس یا پیام — پاسخ و پیشنهاد شفاف.",
    whatsappText: `سلام؛ برای ${serviceFa} در حوزهٔ ${industry.fa} می‌خواهم با شما همکاری کنم (${AREA})`,
  };
}
