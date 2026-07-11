export type SoftwareSeoInput = {
  fa: string
  en: string
  metaDescription: string
}

/** One short SEO paragraph for software product pages. */
export function buildSoftwareSeoBodyMarkdown(input: SoftwareSeoInput): string {
  const { fa, metaDescription } = input
  const intro = metaDescription?.trim()
  const lead = intro
    ? `${intro} `
    : `${fa} برای دیجیتال‌سازی و سرعت بخشیدن به فرآیندهای کسب‌وکار شما طراحی می‌شود. `

  return `${lead}${fa} راه‌حل اختصاصی آنکو دیزاین است — از تحلیل نیاز و UI/UX تا توسعه، تست و پشتیبانی؛ مشاورهٔ اولیه رایگان و قیمت شفاف پس از جلسهٔ آشنایی.`
}
