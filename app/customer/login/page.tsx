'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrandMark } from '@/components/BrandMark'

function CustomerLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/customer'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('customer-credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('ایمیل یا رمز عبور اشتباه است')
    } else {
      router.push(callbackUrl.startsWith('/') ? callbackUrl : '/customer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4">
              <BrandMark size="lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ورود مشتریان</h1>
            <p className="text-sm text-gray-500 mt-1">پنل پیگیری سفارش و پشتیبانی</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            حساب ندارید؟{' '}
            <Link href="/customer/register" className="text-brand font-medium hover:underline">
              ثبت‌نام
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
          <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
        </div>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  )
}
