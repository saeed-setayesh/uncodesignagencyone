import type { PageContent } from "@/types/content";

const icons = [
  // Speed
  <svg
    key="speed"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>,
  // Design
  <svg
    key="design"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
    />
  </svg>,
  // SEO
  <svg
    key="seo"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>,
  // Support
  <svg
    key="support"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>,
];

interface Props {
  benefits: PageContent["benefits"];
  title?: string;
  subheading?: string;
}

export default function BenefitsSection({ benefits, title, subheading }: Props) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          {title ?? "چرا آنکو دیزاین؟"}
        </h2>
        <p className="text-center text-gray-500 mb-10">
          {subheading ?? "مزایایی که ما را از رقبا متمایز می‌کند"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {benefits.slice(0, 4).map((benefit, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-xl bg-gray-50 hover:bg-brand-light transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                {icons[i % icons.length]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee box */}
        {/* <div className="bg-brand-light border border-brand/25 rounded-xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-brand/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark mb-1">ضمانت بازگشت وجه ۱۴ روزه</h3>
            <p className="text-sm text-brand-dark/90 leading-relaxed">
              اگر در ۱۴ روز اول از نتیجه راضی نبودید، مبلغ را به‌طور کامل بازگشت می‌دهیم. بدون سوال، بدون تاخیر.
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}
