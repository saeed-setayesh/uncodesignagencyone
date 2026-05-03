'use client'

import { useState } from 'react'
import type { PageContent } from '@/types/content'

interface Props {
  faq: PageContent['faq']
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-right bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 text-sm leading-relaxed">{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 ms-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white text-sm text-gray-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FaqSection({ faq }: Props) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          سوالات متداول
        </h2>
        <p className="text-center text-gray-500 mb-10">پاسخ به رایج‌ترین سوالات شما</p>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
