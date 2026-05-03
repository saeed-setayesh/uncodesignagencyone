'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const [err, setErr] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message,
        }),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        setErr(j.error ?? 'ارسال ناموفق بود. دوباره تلاش کنید.')
        return
      }
      setSent(true)
    } catch {
      setErr('خطا در ارتباط با سرور.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <CheckCircle className="w-14 h-14 text-brand mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">پیام شما ارسال شد</h3>
        <p className="text-gray-500">در اولین فرصت با شما تماس می‌گیریم.</p>
      </div>
    )
  }

  const cls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">نام شما</label>
        <input
          className={cls}
          placeholder="مثلاً: علی محمدی"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">شماره تماس</label>
        <input
          className={cls}
          placeholder="۰۹۱۲..."
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
      </div>
      {err && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
          {err}
        </p>
      )}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">پیام</label>
        <textarea
          className={cls}
          rows={4}
          placeholder="درباره پروژه‌تان بنویسید..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        {loading ? 'در حال ارسال...' : 'ارسال پیام'}
      </button>
    </form>
  )
}
