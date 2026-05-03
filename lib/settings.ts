import { sql } from 'drizzle-orm'
import { db, siteSetting } from '@/lib/db'

export interface ContactSettings {
  phone: string
  whatsapp: string
  telegram: string
  bale: string
  rubika: string
  eita: string
  address: string
  hours: string
}

export async function getContactSettings(): Promise<ContactSettings> {
  const rows = await db.select().from(siteSetting).where(sql`${siteSetting.key} ~ ${'^contact_'}`)
  const map = Object.fromEntries(rows.map((r) => [r.key.replace('contact_', ''), r.value]))
  return {
    phone:    map.phone    ?? '',
    whatsapp: map.whatsapp ?? '',
    telegram: map.telegram ?? '',
    bale:     map.bale     ?? '',
    rubika:   map.rubika   ?? '',
    eita:     map.eita     ?? '',
    address:  map.address  ?? '',
    hours:    map.hours    ?? '',
  }
}
