'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type Props = {
  cityId: string
  initialActive: boolean
  isNationalHub: boolean
}

export default function CityActiveToggle({ cityId, initialActive, isNationalHub }: Props) {
  const [active, setActive] = useState(initialActive)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (isNationalHub) {
    return (
      <div className="text-xs text-amber-700 max-w-[10rem] text-right" title="لازم برای صفحهٔ ملی /سرویس/صنف">
        همیشه فعال
      </div>
    )
  }

  function toggle() {
    const next = !active
    setError(null)
    setActive(next)
    startTransition(async () => {
      const res = await fetch(`/api/admin/cities/${encodeURIComponent(cityId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        setActive(!next)
        setError(j.error ?? 'خطا')
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={active ? 'شهر فعال است' : 'شهر غیرفعال است'}
        disabled={isPending}
        onClick={toggle}
        className={`
          relative h-7 w-12 shrink-0 rounded-full transition-colors
          ${active ? 'bg-brand' : 'bg-gray-200'}
          ${isPending ? 'opacity-60' : ''}
        `}
      >
        <span
          className={`
            absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[inset-inline-start]
            ${active ? 'start-6' : 'start-1'}
          `}
        />
      </button>
      {error && <p className="text-xs text-red-600 text-right m-0">{error}</p>}
    </div>
  )
}
