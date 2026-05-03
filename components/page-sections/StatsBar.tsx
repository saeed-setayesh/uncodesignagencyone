import type { PageContent } from '@/types/content'

interface Props {
  stats: PageContent['stats']
}

export default function StatsBar({ stats }: Props) {
  return (
    <section className="bg-brand py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/25">
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stats.projects}
            </div>
            <div className="text-brand-light/90 text-sm">پروژه تحویل‌شده</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stats.satisfaction}
            </div>
            <div className="text-brand-light/90 text-sm">رضایت مشتریان</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stats.rating}
            </div>
            <div className="text-brand-light/90 text-sm">امتیاز از ۵</div>
          </div>
        </div>
      </div>
    </section>
  )
}
