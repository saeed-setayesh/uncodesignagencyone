const STEPS = [
  { key: 'contract', label: 'قرارداد' },
  { key: 'plan', label: 'روش پرداخت' },
  { key: 'pay', label: 'پرداخت' },
  { key: 'review', label: 'تأیید ادمین' },
  { key: 'active', label: 'دوره فعال' },
] as const

function stepIndex(status: string): number {
  if (status === 'pending_contract' || status === 'draft') return 0
  if (status === 'pending_payment_plan') return 1
  if (status === 'pending_payment_1' || status === 'pending_payment_2') return 2
  if (status === 'payment_1_review' || status === 'payment_2_review') return 3
  if (status === 'active' || status === 'completed') return 4
  return 0
}

export function StudentStepper({
  status,
  hasConfirmedPayment = false,
}: {
  status: string
  hasConfirmedPayment?: boolean
}) {
  let current = stepIndex(status)
  if (hasConfirmedPayment && current < 4) current = 4

  return (
    <ol className="flex flex-wrap gap-2 mb-8" dir="rtl">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li
            key={step.key}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              active
                ? 'bg-brand text-white border-brand'
                : done
                  ? 'bg-brand/10 text-brand border-brand/30'
                  : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-black/10 text-[10px]">
              {i + 1}
            </span>
            {step.label}
          </li>
        )
      })}
    </ol>
  )
}
