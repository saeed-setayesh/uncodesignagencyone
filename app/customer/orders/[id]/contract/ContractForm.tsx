'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ContractForm({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!accepted) {
      setErr('باید شرایط را بپذیرید')
      return
    }
    setErr('')
    setLoading(true)
    const res = await fetch(`/api/customer/orders/${orderId}/contract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepted: true }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setErr(typeof data.error === 'string' ? data.error : 'خطا')
      return
    }
    router.push(`/customer/orders/${orderId}`)
  }

  return (
    <form onSubmit={submit} className="space-y-4 mt-6">
      {err && <p className="text-sm text-red-600">{err}</p>}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm text-gray-800">
          متن قرارداد و شرایط بالا را خوانده‌ام و می‌پذیرم.
        </span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
      >
        {loading ? 'در حال ثبت...' : 'ثبت تأیید'}
      </button>
    </form>
  )
}
