import { countWords } from '@/lib/utils'

/** حداقل واژه برای متن سئوی صفحهٔ ریشهٔ سرویس/شغل (طبق نیاز محصول). */
export const MIN_SERVICE_SEO_WORDS = 800

export function meetsMinServiceSeoWords(text: string): boolean {
  return countWords(text) >= MIN_SERVICE_SEO_WORDS
}
