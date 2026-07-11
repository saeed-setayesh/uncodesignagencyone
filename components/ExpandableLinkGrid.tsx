'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type ExpandableLinkItem = {
  id: string
  href: string
  label: string
}

type Props = {
  items: ExpandableLinkItem[]
  /** کلاس گرید (مثلاً grid grid-cols-2 gap-2) */
  gridClassName: string
  linkClassName: string
  /** ارتفاع تقریبی ناحیهٔ بسته */
  collapsedMaxHeightClass?: string
  /** کلاس گرادیان محو؛ با رنگ پس‌زمینهٔ سکشن هماهنگ باشد، مثلاً `bg-gradient-to-t from-slate-50 to-transparent` */
  fadeGradientClass?: string
  /** اگر تعداد آیتم‌ها از این بیشتر بود دکمهٔ نمایش بیشتر نشان داده می‌شود */
  minItemsToCollapse?: number
  moreLabel?: string
  lessLabel?: string
}

export default function ExpandableLinkGrid({
  items,
  gridClassName,
  linkClassName,
  collapsedMaxHeightClass = 'max-h-[260px]',
  fadeGradientClass = 'bg-gradient-to-t from-white to-transparent',
  minItemsToCollapse = 9,
  moreLabel = 'نمایش بیشتر',
  lessLabel = 'نمایش کمتر',
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const needsToggle = items.length >= minItemsToCollapse

  if (items.length === 0) return null

  const wrapperClass =
    needsToggle && !expanded
      ? `relative overflow-hidden ${collapsedMaxHeightClass}`
      : ''

  return (
    <div className="w-full">
      <div className={wrapperClass}>
        <div className={gridClassName}>
          {items.map((item) => (
            <Link key={item.id} href={item.href} className={linkClassName}>
              {item.label}
            </Link>
          ))}
        </div>
        {needsToggle && !expanded && (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 ${fadeGradientClass}`}
            aria-hidden
          />
        )}
      </div>
      {needsToggle ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-light/50"
            aria-expanded={expanded}
          >
            {expanded ? lessLabel : moreLabel}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        </div>
      ) : null}
    </div>
  )
}
