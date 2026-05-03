'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BrandMark } from '@/components/BrandMark'

export default function CustomerRegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setLoading(false)
      setError(typeof data.error === 'string' ? data.error : 'خطا در ثبت‌نام')
      return
    }

    const sign = await signIn('customer-credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (sign?.error) {
      router.push('/customer/login')
      return
    }
    router.push('/customer')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4">
              <BrandMark size="lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ثبت‌نام مشتری</h1>
            <p className="text-sm text-gray-500 mt-1">ایجاد حساب برای سفارش و پشتیبانی</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">موبایل (اختیاری)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور (حداقل ۸ کاراکتر)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'در حال ثبت...' : 'ثبت‌نام'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link href="/customer/login" className="text-brand font-medium hover:underline">
              ورود
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
