'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewTicketPage() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/customer/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setError(typeof data.error === 'string' ? data.error : 'خطا')
      return
    }
    router.push(`/customer/tickets/${data.id}`)
  }

  return (
    <div dir="rtl" className="max-w-lg">
      <Link href="/customer/tickets" className="text-sm text-brand hover:underline mb-4 inline-block">
        ← بازگشت به تیکت‌ها
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-6">تیکت جدید</h2>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-100 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">موضوع</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">پیام</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'در حال ارسال...' : 'ارسال تیکت'}
        </button>
      </form>
    </div>
  )
}
