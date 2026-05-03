import { STATIC_TESTIMONIALS } from '@/lib/static-testimonials'

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          مشتریان ما چه می‌گویند؟
        </h2>
        <p className="text-center text-gray-500 text-sm md:text-base mb-8 max-w-2xl mx-auto">
          تجربه واقعی کسب‌وکارهایی که به ما اعتماد کردند
        </p>

        <div className="relative -mx-4 sm:mx-0">
          <div
            className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {STATIC_TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[min(86vw,320px)] sm:w-80 snap-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <StarRating />
                <blockquote className="text-gray-700 leading-relaxed mb-5 text-sm">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2 md:hidden">← بکشید تا بقیه را ببینید →</p>
      </div>
    </section>
  )
}
