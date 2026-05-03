'use client'

import Image from 'next/image'
import { useState } from 'react'

export type ProjectCardProps = {
  title: string
  description: string
  /** مسیرها از root سایت، مثلاً /portfolio/crm.avif */
  images: string[]
}

/**
 * گروهِ تصاویر یک پروژه؛ اگر بیش از یک تصویر باشد تامبنیل + تصویر اصلی قابل تعویض.
 * برای AVIF محلی، unoptimized از مشکل لود در برخی محیطها جلوگیری می‌کند.
 */
export function PortfolioProjectCard({ title, description, images }: ProjectCardProps) {
  const [active, setActive] = useState(0)
  const main = images[active] ?? images[0]
  const hasMultiple = images.length > 1

  if (!main) return null

  return (
    <article className="h-full flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-brand/25 transition-all group">
      <div className="space-y-2 p-2 pb-0">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={main}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            priority={false}
          />
        </div>
        {hasMultiple && (
          <div className="flex gap-1.5 overflow-x-auto pb-1" role="list">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="listitem"
                onClick={() => setActive(i)}
                className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                  i === active ? 'ring-brand opacity-100' : 'ring-transparent opacity-80 hover:opacity-100'
                }`}
                aria-label={`نمای ${i + 1} از ${images.length}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover object-top" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{description}</p>
        {images.length > 1 && (
          <p className="text-xs text-gray-400 mt-2">{images.length} نما از این پروژه</p>
        )}
      </div>
    </article>
  )
}
