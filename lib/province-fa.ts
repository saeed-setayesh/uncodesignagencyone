/**
 * نام استان در CSV انگلیسی است؛ برای متن فارسی به برچسب خوانا نگاشت می‌شود.
 */
const EN_PROVINCE_TO_FA: Record<string, string> = {
  Tehran: 'تهران',
  Alborz: 'البرز',
  Isfahan: 'اصفهان',
  Fars: 'فارس',
  'East Azerbaijan': 'آذربایجان شرقی',
  'West Azerbaijan': 'آذربایجان غربی',
  Mazandaran: 'مازندران',
  Gilan: 'گیلان',
  Khorasan: 'خراسان',
  'Razavi Khorasan': 'خراسان رضوی',
  'North Khorasan': 'خراسان شمالی',
  'South Khorasan': 'خراسان جنوبی',
  Khuzestan: 'خوزستان',
  Kermanshah: 'کرمانشاه',
  Kerman: 'کرمان',
  Hormozgan: 'هرمزگان',
  Bushehr: 'بوشهر',
  Yazd: 'یزد',
  Semnan: 'سمنان',
  Qom: 'قم',
  Qazvin: 'قزوین',
  Zanjan: 'زنجان',
  Hamadan: 'همدان',
  Markazi: 'مرکزی',
  Lorestan: 'لرستان',
  'Chaharmahal and Bakhtiari': 'چهارمحال و بختیاری',
  'Kohgiluyeh and Boyer-Ahmad': 'کهگیلویه و بویراحمد',
  'Sistan and Baluchestan': 'سیستان و بلوچستان',
  Ilam: 'ایلام',
  Kurdistan: 'کردستان',
  Golestan: 'گلستان',
  Ardabil: 'اردبیل',
  Iran: 'ایران',
}

/**
 * برچسب فارسی استان برای استفاده در جمله؛ اگر ناشناس بود، null.
 */
export function provinceLabelFa(english: string | null | undefined): string | null {
  if (!english || !english.trim()) return null
  const t = english.trim()
  if (t === 'Iran' || t === '-' || t === 'Province (English)') return null
  if (EN_PROVINCE_TO_FA[t]) return EN_PROVINCE_TO_FA[t]
  // اگر خودش حروف فارسی دارد
  if (/[\u0600-\u06FF]/.test(t)) return t
  return null
}

/**
 * عبارت کوتاه برای متن— فقط وقتی استان مفید است (مثلاً در متا). از «استان X» با X انگلیسی خودداری می‌کند.
 */
export function istganPhrase(english: string | null | undefined): string {
  const fa = provinceLabelFa(english)
  return fa ? ` استان ${fa}` : ''
}
