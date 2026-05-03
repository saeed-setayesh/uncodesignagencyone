/** Count whitespace-separated words (فارسی و انگلیسی). */
export function countWords(text: string): number {
  const t = text.trim()
  if (!t) return 0
  return t.split(/\s+/).length
}

/**
 * Convert Western Arabic digits to Eastern Arabic (Persian) digits.
 * e.g. "140" → "۱۴۰"
 */
export function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)])
}

/**
 * Build a WhatsApp link with pre-filled message.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
