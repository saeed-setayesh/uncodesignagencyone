'use client'

import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PortfolioCarouselSlide } from '@/lib/portfolio-data'

type Props = {
  slides: PortfolioCarouselSlide[]
  /** برای کاروسل‌های تو در تو؛ اسکرول باریک‌تر */
  compact?: boolean
  className?: string
}

/**
 * لیست افقی تصاویر نمونه کار با اسکرول و دکمه؛ بدون کارت بلند.
 * container داخلی dir=ltr تا جهت اسکرول و دکمه‌ها پایدار بماند.
 */
export function PortfolioShowcaseCarousel({ slides, compact, className }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollByDir = useCallback((forward: boolean) => {
    const el = scrollerRef.current
    if (!el) return
    const delta = forward ? el.clientWidth * 0.72 : -el.clientWidth * 0.72
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }, [])

  if (slides.length === 0) return null

  const slideBasis = compact
    ? 'w-[72vw] sm:w-[48vw] md:w-[38vw] lg:w-[28vw] max-w-sm'
    : 'w-[78vw] sm:w-[55vw] md:w-[40vw] lg:w-[32vw] max-w-md'

  return (
    <div className={`relative group/carousel ${className ?? ''}`}>
      <div
        dir="ltr"
        ref={scrollerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
        tabIndex={0}
        role="region"
        aria-label="کاروسل تصاویر نمونه کار"
      >
        {slides.map((s, i) => (
          <div key={`${s.src}-${i}`} className={`snap-start shrink-0 ${slideBasis}`}>
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-sm">
              <Image
                src={s.src}
                alt={s.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 40vw, 32vw"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByDir(false)}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 text-gray-800 shadow-md ring-1 ring-gray-200/80 opacity-90 transition hover:opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="اسلاید قبلی"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(true)}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 text-gray-800 shadow-md ring-1 ring-gray-200/80 opacity-90 transition hover:opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="اسلاید بعدی"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      )}
    </div>
  )
}
