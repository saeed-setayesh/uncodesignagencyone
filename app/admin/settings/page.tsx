'use client'

import { useEffect, useState } from 'react'
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  Share2,
  Video,
  Globe,
  Send,
  Mail,
} from 'lucide-react'

const CONTACT_FIELDS = [
  { key: 'contact_phone', label: 'شماره تلفن', placeholder: '02112345678', icon: Phone, hint: 'شماره مستقیم برای تماس تلفنی' },
  { key: 'contact_email', label: 'ایمیل', placeholder: 'info@uncodesign.ir', icon: Mail, hint: 'ایمیل رسمی — نمایش در صفحه تماس با ما' },
  { key: 'contact_whatsapp', label: 'واتس‌اپ', placeholder: '989123456789', icon: MessageCircle, hint: 'شماره بدون + و بدون صفر اول (فرمت بین‌المللی)' },
  { key: 'contact_telegram', label: 'تلگرام (پیام‌رسان)', placeholder: 'https://t.me/username', icon: MessageCircle, hint: 'لینک برای ارسال پیام مستقیم — بخش «پیام بدهید»' },
  { key: 'contact_bale', label: 'بله', placeholder: 'https://ble.ir/username', icon: MessageCircle, hint: 'لینک پروفایل بله' },
  { key: 'contact_rubika', label: 'روبیکا', placeholder: 'https://rubika.ir/user', icon: MessageCircle, hint: 'لینک پروفایل روبیکا' },
  { key: 'contact_eita', label: 'ایتا', placeholder: 'https://eitaa.com/user', icon: MessageCircle, hint: 'لینک پروفایل ایتا' },
  { key: 'contact_address', label: 'آدرس', placeholder: 'تهران، خیابان...', icon: MapPin, hint: 'آدرس دفتر (اختیاری)' },
  { key: 'contact_hours', label: 'ساعات کاری', placeholder: 'شنبه تا چهارشنبه ۹–۱۸', icon: Clock, hint: 'ساعات پاسخگویی' },
]

const SOCIAL_FIELDS = [
  {
    key: 'social_instagram',
    label: 'اینستاگرام',
    placeholder: 'https://instagram.com/username',
    icon: Share2,
    hint: 'لینک صفحه یا @username — فوتر و تماس',
  },
  {
    key: 'social_youtube',
    label: 'کانال یوتیوب',
    placeholder: 'https://youtube.com/@channel',
    icon: Video,
    hint: 'لینک کانال یوتیوب',
  },
  {
    key: 'social_aparat',
    label: 'آپارات',
    placeholder: 'https://www.aparat.com/username',
    icon: Video,
    hint: 'لینک کانال آپارات',
  },
  {
    key: 'social_telegram_channel',
    label: 'کانال تلگرام',
    placeholder: 'https://t.me/channelname',
    icon: Send,
    hint: 'کانال عمومی — جدا از تلگرام پیام‌رسان',
  },
  {
    key: 'social_linkedin',
    label: 'لینکدین',
    placeholder: 'https://linkedin.com/company/name',
    icon: Globe,
    hint: 'صفحه شرکت یا پروفایل لینکدین',
  },
]

function SettingsFieldGroup({
  title,
  description,
  fields,
  values,
  onChange,
}: {
  title: string
  description: string
  fields: typeof CONTACT_FIELDS
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {fields.map(({ key, label, placeholder, icon: Icon, hint }) => (
        <div key={key} className="bg-white rounded-xl border border-gray-100 p-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <Icon className="w-4 h-4 text-brand" />
            {label}
          </label>
          {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            placeholder={placeholder}
            value={values[key] ?? ''}
            onChange={(e) => onChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        setValues(d.settings ?? {})
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: values }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="text-center py-20 text-gray-500">در حال بارگذاری...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">تنظیمات تماس و شبکه‌های اجتماعی</h2>
          <p className="text-sm text-gray-500 mt-1">فیلدهای خالی در سایت نمایش داده نمی‌شوند</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'در حال ذخیره...' : saved ? 'ذخیره شد!' : 'ذخیره تغییرات'}
        </button>
      </div>

      <div className="space-y-10">
        <SettingsFieldGroup
          title="تماس و پیام‌رسان‌ها"
          description="شماره، واتس‌اپ و پیام‌رسان‌های ایرانی — بخش «پیام بدهید» در صفحه تماس"
          fields={CONTACT_FIELDS}
          values={values}
          onChange={(key, value) => setValues({ ...values, [key]: value })}
        />

        <SettingsFieldGroup
          title="شبکه‌های اجتماعی"
          description="یوتیوب، کانال تلگرام، لینکدین و اینستاگرام — فوتر و بخش «ما را دنبال کنید» (جدا از پیام‌رسان)"
          fields={SOCIAL_FIELDS}
          values={values}
          onChange={(key, value) => setValues({ ...values, [key]: value })}
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saving ? 'در حال ذخیره...' : saved ? 'ذخیره شد!' : 'ذخیره همه تغییرات'}
        </button>
      </div>
    </div>
  )
}
