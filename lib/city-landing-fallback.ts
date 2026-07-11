import type { City, Industry } from '@/lib/db'
import type { PageContent } from "@/types/content";
import { provinceLabelFa } from "@/lib/province-fa";
import { SITE_URGENCY_BAR } from "@/lib/site-urgency";

/**
 * وقتی ردیف GeneratedPage در دیتابیس نیست — محتوای کامل و معتبر برای
 * `/[service]/[industry]/[city]` تولید می‌کند تا صفحه ۴۰۴ نشود.
 */
export function buildCityLandingFallbackContent(
  industry: Industry,
  city: City,
  serviceFa: string,
): PageContent {
  const place = city.fa;
  const provinceFa = provinceLabelFa(city.province);

  const titleBase = `${serviceFa} برای ${industry.fa} در ${place}`;
  const metaTitle =
    titleBase.length <= 70
      ? titleBase
      : `${titleBase.slice(0, 64)}…`.slice(0, 70);

  // متا: یک جمله که استان فقط اگر متمایز از نام شهر معنی‌دار است (معمولاً در متا کافیست یک بار)
  const metaDescription = (
    provinceFa && !metaDescRedundantWithCity(place, provinceFa)
      ? `به ${serviceFa} برای ${industry.fa} در ${place} نیاز دارید؟ تماس — قیمت شفاف، ${provinceFa}.`
      : `به ${serviceFa} برای ${industry.fa} در ${place} نیاز دارید؟ تماس بگیرید — قیمت شفاف.`
  ).slice(0, 165);

  const heroSubtitle = buildNaturalHeroSubtitle(
    serviceFa,
    industry.fa,
    place,
    provinceFa,
  );

  return {
    metaTitle,
    metaDescription,
    h1: `${serviceFa} برای ${industry.fa} در ${place}`,
    heroSubtitle,
    urgencyText: SITE_URGENCY_BAR,
    stats: { projects: "+۱۴۰", satisfaction: "۹۷٪", rating: "۴.۹" },
    benefits: [
      {
        title: "همین شهر، همین صنف شما",
        desc: `${serviceFa} را برای کسب‌وکار ${industry.fa} در ${place} انجام می‌دهیم؛ متناسب با برند شما، نه قالب آمادهٔ جای دیگر.`,
      },
      {
        title: "مسیر تماس برای مشتری شما",
        desc: `معرفی خدمات، اعتماد و فرم درخواست طوری چیده می‌شود که مشتری ${place} راحت با شما ارتباط بگیرد.`,
      },
      {
        title: "قیمت و فاز قبل از شروع معلوم",
        desc: "می‌دانید هر مرحله چیست و چقدر تمام می‌شود؛ پشتیبانی بعد از تحویل اگر در قرارداد باشد.",
      },
      {
        title: "اجرای کامل توسط ما",
        desc: `تیم ما ${serviceFa} را تا تحویل پیش می‌برد؛ گزارش پیشرفت و اصلاح بر اساس بازخورد شما.`,
      },
    ],
    processSteps: [
      {
        title: "تماس و بیان نیاز",
        desc: `می‌گویید در ${place} چه می‌خواهید؛ برای ${industry.fa} و ${serviceFa} هم‌تراز می‌کنیم`,
        timing: "هفته ۱",
      },
      {
        title: "پیشنهاد و قرارداد",
        desc: "فهرست کار، زمان و بودجه در چند بند روشن",
        timing: "هفته ۱–۲",
      },
      {
        title: "اجرا",
        desc: `راه‌اندازی ${serviceFa}، تست و اصلاح بر اساس نظر شما`,
        timing: "۲–۸ هفته",
      },
      {
        title: "تحویل و ادامه",
        desc: "آموزش لازم، گزارش و در صورت توافق نگهداری",
        timing: "بعد از تحویل",
      },
    ],
    testimonials: [
      {
        text: `برای ${industry.fa} در ${place} همان نتیجه‌ای که در جلسه اول گفتیم، تحویل گرفتیم؛ پیگیری تیم قابل اتکا بود.`,
        name: "صاحب کسب‌وکار",
        business: `${industry.fa} — ${place}`,
        initials: "ص",
      },
      {
        text: "بودجه و فازبندی شفاف بود و استرس اضافه نداشتیم؛ در چند ماه اول اثرش را دیدیم.",
        name: "مدیر مجموعه",
        business: place,
        initials: "م",
      },
    ],
    faq: [
      {
        q: `چطور برای ${serviceFa} در ${place} با شما شروع کنم؟`,
        a: `تماس یا فرم؛ نیاز کوتاه را بگویید. پیشنهاد اسکوپ و محدودهٔ هزینه برای همین صنف در همین شهر را می‌گیرید و در صورت توافق قرارداد می‌بندیم.`,
      },
      {
        q: "زمان اجرا معمولاً چقدر است؟",
        a: "بسته به حجم، از چند هفته تا چند ماه؛ بعد از بررسی، تقویم دقیق می‌گوییم.",
      },
      {
        q: "هزینه چطور مشخص می‌شود؟",
        a: "بعد از دیدن دامنه کار، قیمت مرحله‌ای می‌دهیم؛ بدون هزینه پنهان در همان بخش‌های اصلی.",
      },
      {
        q: `جلسه حضوری در ${place} ممکن است؟`,
        a: "بسته به پروژه و زمان، حضوری یا آنلاین هماهنگ می‌شود.",
      },
    ],
    ctaHeading: `درخواست ${serviceFa} برای ${industry.fa} در ${place}`,
    ctaSubtext: 'تماس بگیرید — پاسخ و پیشنهاد سریع.',
    whatsappText: `سلام؛ درباره ${serviceFa} برای ${industry.fa} در ${place} می‌خواهم اطلاعات بگیرم`,
  };
}

function metaDescRedundantWithCity(cityFa: string, provinceFa: string): boolean {
  return (
    cityFa.trim() === provinceFa.trim() ||
    (cityFa.includes("تهران") && provinceFa === "تهران")
  );
}

/** زیرتیتر هیرو: کوتاه — «این سرویس را می‌خواهید؟ تماس» */
function buildNaturalHeroSubtitle(
  serviceFa: string,
  industryFa: string,
  place: string,
  provinceFa: string | null,
): string {
  if (provinceFa && !metaDescRedundantWithCity(place, provinceFa)) {
    return `به ${serviceFa} برای ${industryFa} در ${place} نیاز دارید؟ تماس بگیرید — قیمت شفاف، استان ${provinceFa}.`;
  }
  return `به ${serviceFa} برای ${industryFa} در ${place} نیاز دارید؟ با ما تماس بگیرید.`;
}
