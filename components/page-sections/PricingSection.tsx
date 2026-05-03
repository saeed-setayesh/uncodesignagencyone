import Link from "next/link";
import type { Industry } from '@/lib/db'
import type { PricingPlan } from "@/types/pricing";

interface Props {
  industry: Industry;
  serviceFa: string;
  plans: PricingPlan[];
  /** صفحه ریشه سرویس: فقط «تعرفه [سرویس]» بدون نام صنف دمو */
  serviceRootPage?: boolean;
}

export default function PricingSection({ industry, serviceFa, plans, serviceRootPage }: Props) {
  const gridCols =
    plans.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  const title = serviceRootPage
    ? `تعرفه ${serviceFa}`
    : `تعرفه ${serviceFa} ${industry.fa}`;

  return (
    <section className="py-16 bg-white" aria-label="تعرفه">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-5">شفاف، بدون هزینه پنهان</p>

        <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col relative ${
                plan.featured
                  ? "border-2 border-brand shadow-xl shadow-brand/10"
                  : "border border-gray-200"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 start-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  محبوب‌ترین
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-gray-900 text-xl mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="mb-5">
                {plan.originalPriceLabel && (
                  <div className="text-sm text-gray-400 line-through mb-1">
                    {plan.originalPriceLabel}
                  </div>
                )}
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {plan.priceLabel}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <svg
                      className="w-4 h-4 text-brand flex-shrink-0"
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
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.featured
                    ? "bg-brand text-white hover:bg-brand-dark"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                تماس با ما
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
