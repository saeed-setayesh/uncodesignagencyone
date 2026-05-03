'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PricingPlan } from '@/types/pricing'

type ServiceRow = {
  id: string
  fa: string
  slug: string
  plans: PricingPlan[]
}

export function PlansCheckout({ services }: { services: ServiceRow[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [err, setErr] = useState('')

  async function buy(serviceId: string, planIndex: number) {
    const key = `${serviceId}-${planIndex}`
    setErr('')
    setLoading(key)
    const create = await fetch('/api/customer/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, planIndex }),
    })
    const cdata = await create.json().catch(() => ({}))
    if (!create.ok) {
      setLoading(null)
      setErr(typeof cdata.error === 'string' ? cdata.error : 'خطا در ایجاد سفارش')
      return
    }
    const orderId = cdata.order?.id as string
    if (!orderId) {
      setLoading(null)
      setErr('پاسخ نامعتبر')
      return
    }
    const pay = await fetch(`/api/customer/orders/${orderId}/pay`, { method: 'POST' })
    const pdata = await pay.json().catch(() => ({}))
    setLoading(null)
    if (!pay.ok) {
      setErr(typeof pdata.error === 'string' ? pdata.error : 'خطا در درگاه')
      router.push(`/customer/orders/${orderId}`)
      return
    }
    if (pdata.redirectUrl) {
      window.location.href = pdata.redirectUrl as string
    }
  }

  return (
    <div dir="rtl">
      {err && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{err}</div>
      )}
      <div className="space-y-10">
        {services.map((s) => (
          <section key={s.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{s.fa}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {s.plans.map((plan, idx) => {
                const isOrg = idx === 3
                const key = `${s.id}-${idx}`
                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-4 ${plan.featured ? 'border-brand ring-1 ring-brand/30' : 'border-gray-200'}`}
                  >
                    <div className="font-semibold text-gray-900">{plan.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{plan.description}</div>
                    <div className="text-brand font-bold mt-2">{plan.priceLabel}</div>
                    <ul className="mt-3 text-xs text-gray-600 space-y-1">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                    {isOrg ? (
                      <p className="mt-4 text-xs text-gray-400">این پلن فقط با هماهنگی مستقیم — پرداخت آنلاین ندارد.</p>
                    ) : (
                      <button
                        type="button"
                        disabled={loading !== null}
                        onClick={() => buy(s.id, idx)}
                        className="mt-4 w-full bg-brand text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        {loading === key ? 'در حال انتقال...' : 'خرید و پرداخت'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
