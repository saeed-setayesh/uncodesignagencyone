'use client'

import Image from 'next/image'
import type { PortfolioShowcaseProject } from '@/lib/portfolio-data'

type Props = {
  project: PortfolioShowcaseProject
  className?: string
}

export function PortfolioShowcaseCard({ project, className }: Props) {
  const cover = project.images[0]
  if (!cover) return null

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 ${className ?? ''}`}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={cover}
          alt={project.title}
          fill
          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 33vw, 380px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-right" dir="rtl">
          <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm mb-2">
            {project.category}
          </span>
          <h3 className="font-bold text-white text-sm md:text-base leading-snug line-clamp-2">{project.title}</h3>
          <p className="text-white/70 text-xs mt-1">{project.industry}</p>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-end">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-brand/80 px-2 py-0.5 text-[10px] font-medium text-white"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.metrics ? (
            <p className="text-brand-light text-[11px] mt-2 font-medium">{project.metrics}</p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
