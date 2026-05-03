import Link from "next/link";
import type { PageContent } from "@/types/content";

interface Props {
  content: PageContent;
}

export default function HeroSection({ content }: Props) {
  return (
    <section className="bg-gray-50">
      {/* Urgency bar */}
      <div className="bg-brand-light border-b border-brand/20 py-2 px-4 text-center">
        <p className="text-brand-dark text-sm font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-brand rounded-full animate-pulse inline-block" />
          {content.urgencyText}
        </p>
      </div>

      {/* Hero content */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {content.h1}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          {content.heroSubtitle}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/contact"
            className="bg-brand text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
          >
            مشاوره رایگان
          </Link>
          <Link
            href="/portfolio"
            className="bg-white text-brand border-2 border-brand px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-brand-light transition-colors inline-block"
          >
            نمونه کارها
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            تحویل ۱۴ روزه
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            پشتیبانی ۶ ماهه رایگان
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            ضمانت بازگشت وجه
          </span>
        </div>
      </div>
    </section>
  );
}
