'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function TrainingCertificateVerifyForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a certificate ID.')
      return
    }
    setLoading(true)
    setError('')
    router.push(`/certificate/verify/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Certificate ID</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="UCD-2026-XXXXXXXX"
          required
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 whitespace-nowrap min-w-[120px]"
        >
          {loading ? 'Checking...' : 'Verify'}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  )
}
