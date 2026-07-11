'use client'

import type { ServiceDeliverables, WhatWeDoItem, OutcomeItem } from '@/types/service-deliverables'

type Props = {
  value: ServiceDeliverables
  onChange: (v: ServiceDeliverables) => void
}

function emptyWhatWeDo(): WhatWeDoItem {
  return { title: '', description: '', icon: 'CheckCircle2' }
}

function emptyOutcome(): OutcomeItem {
  return { metric: '', description: '' }
}

export default function DeliverablesEditor({ value, onChange }: Props) {
  function update(partial: Partial<ServiceDeliverables>) {
    onChange({ ...value, ...partial })
  }

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
      <h3 className="font-bold text-gray-900">تحویل‌ها — ما چه می‌کنیم</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">خلاصه (یک پاراگراف)</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm min-h-[80px]"
          value={value.summary}
          onChange={(e) => update({ summary: e.target.value })}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">فعالیت‌ها (whatWeDo)</span>
          <button
            type="button"
            className="text-xs text-brand font-semibold"
            onClick={() => update({ whatWeDo: [...value.whatWeDo, emptyWhatWeDo()] })}
          >
            + ردیف
          </button>
        </div>
        {value.whatWeDo.map((item, i) => (
          <div key={i} className="grid gap-2 mb-3 p-3 bg-white rounded-lg border">
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="عنوان"
              value={item.title}
              onChange={(e) => {
                const next = [...value.whatWeDo]
                next[i] = { ...item, title: e.target.value }
                update({ whatWeDo: next })
              }}
            />
            <textarea
              className="border rounded px-2 py-1 text-sm"
              placeholder="توضیح"
              rows={2}
              value={item.description}
              onChange={(e) => {
                const next = [...value.whatWeDo]
                next[i] = { ...item, description: e.target.value }
                update({ whatWeDo: next })
              }}
            />
            <input
              className="border rounded px-2 py-1 text-sm"
              placeholder="نام آیکون Lucide (مثلاً Search)"
              value={item.icon}
              onChange={(e) => {
                const next = [...value.whatWeDo]
                next[i] = { ...item, icon: e.target.value }
                update({ whatWeDo: next })
              }}
            />
            <button
              type="button"
              className="text-xs text-red-600 text-left"
              onClick={() => update({ whatWeDo: value.whatWeDo.filter((_, j) => j !== i) })}
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ابزارها (هر خط یک مورد)</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm min-h-[60px]"
          value={value.tools.join('\n')}
          onChange={(e) =>
            update({
              tools: e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">نتایج (outcomes)</span>
          <button
            type="button"
            className="text-xs text-brand font-semibold"
            onClick={() => update({ outcomes: [...value.outcomes, emptyOutcome()] })}
          >
            + نتیجه
          </button>
        </div>
        {value.outcomes.map((o, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="border rounded px-2 py-1 text-sm w-24"
              placeholder="متریک"
              value={o.metric}
              onChange={(e) => {
                const next = [...value.outcomes]
                next[i] = { ...o, metric: e.target.value }
                update({ outcomes: next })
              }}
            />
            <input
              className="border rounded px-2 py-1 text-sm flex-1"
              placeholder="توضیح"
              value={o.description}
              onChange={(e) => {
                const next = [...value.outcomes]
                next[i] = { ...o, description: e.target.value }
                update({ outcomes: next })
              }}
            />
            <button
              type="button"
              className="text-xs text-red-600"
              onClick={() => update({ outcomes: value.outcomes.filter((_, j) => j !== i) })}
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">خارج از بسته (هر خط)</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm min-h-[50px]"
          value={(value.notIncluded ?? []).join('\n')}
          onChange={(e) =>
            update({
              notIncluded: e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    </div>
  )
}
