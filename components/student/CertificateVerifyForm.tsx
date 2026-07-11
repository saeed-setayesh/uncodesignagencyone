'use client'

import { useState } from 'react'

type VerifyResult = {
  valid: boolean
  certificate?: {
    trackingNumber: string
    studentName: string
    courseTitle: string
    sessionCount: number
    issuedAt: string
  }
  error?: string
}

export function CertificateVerifyForm({ compact = false }: { compact?: boolean }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const res = await fetch(`/api/certificate/verify?code=${encodeURIComponent(code.trim())}`)
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) {
      setResult({ valid: false, error: data.error || 'گواهی یافت نشد' })
      return
    }
    setResult(data)
  }

  return (
    <div className={compact ? 'mt-6 pt-6 border-t border-gray-200' : ''} dir="rtl">
      <h2 className={`font-semibold text-gray-900 ${compact ? 'text-sm mb-2' : 'text-base mb-3'}`}>
        استعلام گواهی دوره
      </h2>
      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="UC-2026-XXXXXXXX"
          dir="ltr"
          required
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? '...' : 'بررسی'}
        </button>
      </form>

      {result && (
        <div
          className={`mt-3 rounded-lg px-3 py-3 text-sm ${
            result.valid
              ? 'bg-green-50 border border-green-200 text-green-900'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {result.valid && result.certificate ? (
            <div className="space-y-1">
              <p className="font-semibold">گواهی معتبر است ✓</p>
              <p>{result.certificate.studentName}</p>
              <p>{result.certificate.courseTitle}</p>
              <p className="text-xs opacity-80" dir="ltr">
                {result.certificate.trackingNumber}
              </p>
            </div>
          ) : (
            <p>{result.error || 'گواهی یافت نشد'}</p>
          )}
        </div>
      )}
    </div>
  )
}
