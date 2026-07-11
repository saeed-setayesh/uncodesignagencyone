/** Normalize Iranian mobile to 09xxxxxxxxx */
export function normalizeStudentPhone(input: string): string | null {
  let s = input.replace(/\s+/g, '').replace(/-/g, '')
  if (s.startsWith('+98')) s = '0' + s.slice(3)
  if (s.startsWith('98') && s.length === 12) s = '0' + s.slice(2)
  if (/^9\d{9}$/.test(s)) s = '0' + s
  if (!/^09\d{9}$/.test(s)) return null
  return s
}
