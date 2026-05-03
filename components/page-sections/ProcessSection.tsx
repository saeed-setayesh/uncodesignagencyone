import type { PageContent } from '@/types/content'

interface Props {
  steps: PageContent['processSteps']
  subheading?: string
  /** استایل ملایم و کم‌رنگ (مناسب بعد از بخش قیمت) */
  pale?: boolean
}

export default function ProcessSection({ steps, subheading, pale }: Props) {
  if (!steps?.length) return null
  return (
    <section
      className={
        pale
          ? 'py-14 border-y border-slate-100/90 bg-slate-50/80'
          : 'py-16 bg-gray-50'
      }
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2
          className={
            pale
              ? 'text-xl md:text-2xl font-semibold text-center text-slate-600 mb-2'
              : 'text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3'
          }
        >
          فرآیند کار ما
        </h2>
        <p
          className={
            pale
              ? 'text-center text-slate-400 text-sm md:text-base mb-8'
              : 'text-center text-gray-500 mb-10'
          }
        >
          {subheading ?? 'از مشاوره تا تحویل نهایی در ۱۴ روز'}
        </p>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5 relative">
              {i < steps.length - 1 && (
                <div
                  className={
                    pale
                      ? 'absolute top-12 end-[1.6rem] w-0.5 h-full bg-slate-200/80'
                      : 'absolute top-12 end-[1.6rem] w-0.5 h-full bg-brand-light'
                  }
                />
              )}

              <div
                className={
                  pale
                    ? 'flex-shrink-0 w-11 h-11 rounded-full bg-slate-200/90 text-slate-600 font-semibold flex items-center justify-center text-base z-10'
                    : 'flex-shrink-0 w-12 h-12 rounded-full bg-brand text-white font-bold flex items-center justify-center text-lg z-10'
                }
              >
                {i + 1}
              </div>

              <div className="pb-8 flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3
                    className={
                      pale ? 'font-semibold text-slate-700 text-base md:text-lg' : 'font-bold text-gray-900 text-lg'
                    }
                  >
                    {step.title}
                  </h3>
                  <span
                    className={
                      pale
                        ? 'bg-slate-100/90 text-slate-500 text-xs font-medium px-2.5 py-0.5 rounded-full border border-slate-200/60'
                        : 'bg-brand-light text-brand-dark text-xs font-medium px-2.5 py-1 rounded-full'
                    }
                  >
                    {step.timing}
                  </span>
                </div>
                <p className={pale ? 'text-slate-500 text-sm leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
