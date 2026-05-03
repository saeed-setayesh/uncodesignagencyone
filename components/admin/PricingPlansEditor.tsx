'use client'

import type { PricingPlan } from '@/types/pricing'

export default function PricingPlansEditor({
  plans,
  onChange,
}: {
  plans: PricingPlan[]
  onChange: (next: PricingPlan[]) => void
}) {
  function patch(i: number, patch: Partial<PricingPlan>) {
    const next = plans.map((p, j) => (j === i ? { ...p, ...patch } : p))
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {plans.map((plan, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
          <div className="text-sm font-semibold text-gray-800">پلن {i + 1}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">نام</label>
              <input
                value={plan.name}
                onChange={(e) => patch(i, { name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">برچسب قیمت</label>
              <input
                value={plan.priceLabel}
                onChange={(e) => patch(i, { priceLabel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">توضیح کوتاه</label>
            <input
              value={plan.description}
              onChange={(e) => patch(i, { description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">قیمت قبلی (اختیاری)</label>
            <input
              value={plan.originalPriceLabel ?? ''}
              onChange={(e) =>
                patch(i, { originalPriceLabel: e.target.value.trim() ? e.target.value : null })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ویژگی‌ها (هر خط یک مورد)</label>
            <textarea
              value={plan.features.join('\n')}
              onChange={(e) =>
                patch(i, {
                  features: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean),
                })
              }
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!plan.featured}
              onChange={(e) => patch(i, { featured: e.target.checked })}
              className="rounded border-gray-300"
            />
            پلن برجسته
          </label>
        </div>
      ))}
    </div>
  )
}
