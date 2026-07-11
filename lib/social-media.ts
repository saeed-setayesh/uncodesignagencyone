import { sql } from 'drizzle-orm'
import { db, siteSetting } from '@/lib/db'

export type SocialMediaPlatform = 'youtube' | 'aparat' | 'telegram_channel' | 'linkedin' | 'instagram'

export interface SocialMediaSettings {
  youtube: string
  aparat: string
  telegramChannel: string
  linkedin: string
  instagram: string
}

export interface SocialMediaLink {
  platform: SocialMediaPlatform
  label: string
  href: string
}

const PLATFORM_META: Record<SocialMediaPlatform, { label: string; key: keyof SocialMediaSettings }> = {
  youtube: { label: 'یوتیوب', key: 'youtube' },
  aparat: { label: 'آپارات', key: 'aparat' },
  telegram_channel: { label: 'کانال تلگرام', key: 'telegramChannel' },
  linkedin: { label: 'لینکدین', key: 'linkedin' },
  instagram: { label: 'اینستاگرام', key: 'instagram' },
}

function normalizeUrl(raw: string, platform: SocialMediaPlatform): string | null {
  const v = raw.trim()
  if (!v) return null

  if (/^https?:\/\//i.test(v)) return v

  switch (platform) {
    case 'youtube':
      if (v.startsWith('@')) return `https://www.youtube.com/${v}`
      if (v.includes('youtube.com') || v.includes('youtu.be')) return `https://${v.replace(/^\/\//, '')}`
      return `https://www.youtube.com/@${v.replace(/^@/, '')}`
    case 'aparat':
      if (v.includes('aparat.com')) return `https://${v.replace(/^\/\//, '')}`
      return `https://www.aparat.com/${v.replace(/^@/, '').replace(/^\/+/, '')}`
    case 'telegram_channel':
      if (v.startsWith('t.me/')) return `https://${v}`
      if (v.startsWith('@')) return `https://t.me/${v.slice(1)}`
      return `https://t.me/${v.replace(/^@/, '')}`
    case 'linkedin':
      if (v.includes('linkedin.com')) return `https://${v.replace(/^\/\//, '')}`
      return `https://www.linkedin.com/company/${v.replace(/^\/+/, '')}`
    case 'instagram':
      if (v.includes('instagram.com')) return `https://${v.replace(/^\/\//, '')}`
      return `https://www.instagram.com/${v.replace(/^@/, '').replace(/^\/+/, '')}`
    default:
      return v
  }
}

export async function getSocialMediaSettings(): Promise<SocialMediaSettings> {
  const rows = await db.select().from(siteSetting).where(sql`${siteSetting.key} ~ ${'^social_'}`)
  const map = Object.fromEntries(rows.map((r) => [r.key.replace('social_', ''), r.value]))
  return {
    youtube: map.youtube ?? '',
    aparat: map.aparat ?? '',
    telegramChannel: map.telegram_channel ?? map.telegramChannel ?? '',
    linkedin: map.linkedin ?? '',
    instagram: map.instagram ?? '',
  }
}

export function buildSocialMediaLinks(settings: SocialMediaSettings): SocialMediaLink[] {
  const order: SocialMediaPlatform[] = ['instagram', 'telegram_channel', 'youtube', 'aparat', 'linkedin']
  const out: SocialMediaLink[] = []

  for (const platform of order) {
    const meta = PLATFORM_META[platform]
    const raw = settings[meta.key]
    const href = normalizeUrl(raw, platform)
    if (href) {
      out.push({ platform, label: meta.label, href })
    }
  }

  return out
}
