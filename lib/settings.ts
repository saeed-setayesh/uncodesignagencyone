import { sql } from 'drizzle-orm'
import { db, siteSetting } from '@/lib/db'

export interface ContactSettings {
  phone: string
  email: string
  whatsapp: string
  telegram: string
  bale: string
  rubika: string
  eita: string
  address: string
  hours: string
}

/** آدرس و کد پستی ثابت — نمایش در صفحه تماس */
export const CONTACT_POSTAL_CODE = '1476933851'
export const CONTACT_POSTAL_ADDRESS =
  'تهران - تهران - مرکزی پونک شمالی خیابان بهار کوچه ارکیده پلاک -3 طبقه 5'

export async function getContactSettings(): Promise<ContactSettings> {
  const rows = await db.select().from(siteSetting).where(sql`${siteSetting.key} ~ ${'^contact_'}`)
  const map = Object.fromEntries(rows.map((r) => [r.key.replace('contact_', ''), r.value]))
  return {
    phone:    map.phone    ?? '',
    email:    map.email    ?? '',
    whatsapp: map.whatsapp ?? '',
    telegram: map.telegram ?? '',
    bale:     map.bale     ?? '',
    rubika:   map.rubika   ?? '',
    eita:     map.eita     ?? '',
    address:  map.address  ?? '',
    hours:    map.hours    ?? '',
  }
}
