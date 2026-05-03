'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ReplyForm({ ticketId, closed }: { ticketId: string; closed: boolean }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  if (closed) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setLoading(true)
    await fetch(`/api/customer/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    setBody('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="پاسخ شما..."
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-brand text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
      >
        ارسال
      </button>
    </form>
  )
}
