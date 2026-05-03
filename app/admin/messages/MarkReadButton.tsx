'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function MarkReadButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function onClick() {
    setPending(true)
    const res = await fetch(`/api/admin/messages/${id}`, { method: 'PATCH' })
    setPending(false)
    if (res.ok) router.refresh()
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs font-semibold text-brand hover:underline disabled:opacity-50"
    >
      {pending ? '…' : 'علامت‌گذاری به‌عنوان خوانده‌شده'}
    </button>
  )
}
