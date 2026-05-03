import Link from 'next/link'
import type { PageContent } from '@/types/content'

interface Props {
  heading: PageContent['ctaHeading']
  subtext: PageContent['ctaSubtext']
}

export default function BottomCta({ heading, subtext }: Props) {
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'

  return (
    <section className="bg-brand-dark py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{heading}</h2>
        <p className="text-white/85 text-lg mb-8 leading-relaxed">{subtext}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-white text-brand-dark font-bold px-8 py-3.5 rounded-xl hover:bg-brand-light transition-colors text-lg"
          >
            مشاوره رایگان
          </Link>
          <a
            href={`tel:${phone}`}
            className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-lg"
          >
            {phone}
          </a>
        </div>

        <p className="text-brand-light/80 text-sm mt-6">
          پاسخگویی ۷ روز هفته، ۹ صبح تا ۱۰ شب
        </p>
      </div>
    </section>
  )
}
