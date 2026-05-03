'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AdminReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    await fetch(`/api/admin/support-tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    setBody('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-2 bg-white rounded-xl border border-gray-100 p-4">
      <label className="block text-sm font-medium text-gray-700">پاسخ مدیر</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="متن پاسخ..."
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-brand text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
      >
        ارسال پاسخ
      </button>
    </form>
  )
}
