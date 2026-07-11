'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { redirectAfterSignIn } from '@/lib/auth-redirect'
import { BrandLogo } from '@/components/BrandLogo'
import { CertificateVerifyForm } from '@/components/student/CertificateVerifyForm'

function StudentLoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/student'

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('student-credentials', {
      phone,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('شماره موبایل یا رمز عبور اشتباه است')
    } else {
      redirectAfterSignIn(callbackUrl.startsWith('/') ? callbackUrl : '/student')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex justify-center">
              <BrandLogo size="lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ورود دانشجو</h1>
            <p className="text-sm text-gray-500 mt-1">پنل دوره و پرداخت</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">موبایل</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="09123456789"
                dir="ltr"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-left"
                autoComplete="tel"
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
            <Link href="/customer/login" className="text-brand font-medium hover:underline">
              ورود مشتریان
            </Link>
          </p>

          <CertificateVerifyForm compact />
        </div>
      </div>
    </div>
  )
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
          <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
        </div>
      }
    >
      <StudentLoginForm />
    </Suspense>
  )
}
