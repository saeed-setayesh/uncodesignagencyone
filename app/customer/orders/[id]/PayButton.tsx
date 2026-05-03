'use client'

import { useState } from 'react'

export function PayButton({ orderId, canPay }: { orderId: string; canPay: boolean }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  if (!canPay) return null

  async function pay() {
    setErr('')
    setLoading(true)
    const res = await fetch(`/api/customer/orders/${orderId}/pay`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setErr(typeof data.error === 'string' ? data.error : 'خطا در اتصال به درگاه')
      return
    }
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl as string
    }
  }

  return (
    <div className="mt-4">
      {err && <p className="text-sm text-red-600 mb-2">{err}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
      >
        {loading ? 'در حال اتصال...' : 'پرداخت آنلاین (زرین‌پال)'}
      </button>
    </div>
  )
}
