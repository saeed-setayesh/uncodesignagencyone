import type { City, Industry } from '@/lib/db'
import type { PageContent } from "@/types/content";
import { istganPhrase, provinceLabelFa } from "@/lib/province-fa";
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
  const istgan = istganPhrase(city.province);

  const titleBase = `${serviceFa} برای ${industry.fa} در ${place}`;
  const metaTitle =
    titleBase.length <= 70
      ? titleBase
      : `${titleBase.slice(0, 64)}…`.slice(0, 70);

  // متا: یک جمله که استان فقط اگر متمایز از نام شهر معنی‌دار است (معمولاً در متا کافیست یک بار)
  const metaDescription = (
    provinceFa && !metaDescRedundantWithCity(place, provinceFa)
      ? `خدمات ${serviceFa} برای کسب‌وکارهای ${industry.fa} در ${place} و${istgan}؛ مشاوره، اجرا و پشتیبانی با قیمت شفاف.`
      : `خدمات ${serviceFa} برای ${industry.fa} در ${place} — مشاوره، اجرا و پشتیبانی؛ قیمت و فازبندی شفاف.`
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
        title: "صنف و همان منطقه",
        desc: `پیام و ساختار سایت مخصوص ${industry.fa} در ${place}؛ الگوهای کلیِ شهرهای دیگر کپی نمی‌شود.`,
      },
      {
        title: "جستجو و تماس در همان ناحیه",
        desc: `کلمات و صفحاتی که مردم ${place} واقعاً جستجو می‌کنند، همراه با فرم و مسیر تماس واضح.`,
      },
      {
        title: "بودجه و فاز شفاف",
        desc: "قبل از شروع، خروجی هر فاز و هزینه‌اش معلوم است؛ پشتیبانی پس از تحویل اگر در قرارداد باشد.",
      },
      {
        title: "از ایده تا اجرا",
        desc: `برای ${serviceFa} تیم فنی و محتوا پشت‌صحنه دارد؛ گزارش منظم و اصلاح بر اساس بازخورد.`,
      },
    ],
    processSteps: [
      {
        title: "مشاوره",
        desc: `وضعیت فعلی ${industry.fa} شما در ${place} و هدف ۳ تا ۶ ماهه`,
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
        q: `چرا ${serviceFa} اختصاصی برای ${industry.fa} در ${place}؟`,
        a: `مشتری و رقبا در ${place} با شهر دیگر فرق دارند؛ متن و ساختار باید همانجا جذب کند، نه شعار کلی.`,
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
    ctaSubtext:
      "یک تماس کوتاه کافی است — مشاوره را رایگان شروع می‌کنیم و مسیر را شفاف می‌گوییم.",
    whatsappText: `سلام؛ درباره ${serviceFa} برای ${industry.fa} در ${place} می‌خواهم اطلاعات بگیرم`,
  };
}

function metaDescRedundantWithCity(cityFa: string, provinceFa: string): boolean {
  return (
    cityFa.trim() === provinceFa.trim() ||
    (cityFa.includes("تهران") && provinceFa === "تهران")
  );
}

/**
 * جملهٔ معرفی زیر تیتر: بدون ترکیب ناخوشایند «استان + نام انگلیسی» و بدون تکرار بی‌مورد شهر+استان
 */
function buildNaturalHeroSubtitle(
  serviceFa: string,
  industryFa: string,
  place: string,
  provinceFa: string | null,
): string {
  if (provinceFa && !metaDescRedundantWithCity(place, provinceFa)) {
    return `${serviceFa} را برای کسب‌وکار ${industryFa} در ${place} (استان ${provinceFa}) طوری اجرا می‌کنیم که با جستجوی محلی و رقبای همان ناحیه بخواند — تمرکز روی تماس و اعتماد مشتری، نه الگوی تکراری از شهر دیگر.`;
  }
  return `${serviceFa} را برای ${industryFa} در ${place} طوری می‌سازیم که در نتایج محلی و میان رقبای همان منطقه دیده شوید: محتوا و ساختار مخصوص کسب‌وکار شما، نه کپی سایت‌های عمومی.`;
}
