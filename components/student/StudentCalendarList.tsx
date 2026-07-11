type Session = {
  sessionNumber: number
  startsAt: Date | string
  endsAt: Date | string
  note: string
}

export function StudentCalendarList({
  sessions,
  courseStartsAt,
  courseEndsAt,
  sessionsCompletedCount = 0,
}: {
  sessions: Session[]
  courseStartsAt: Date | string | null
  courseEndsAt: Date | string | null
  sessionsCompletedCount?: number
}) {
  const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString('fa-IR')
  const fmtTime = (d: Date | string) =>
    new Date(d).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })

  const completed = Math.max(0, Math.min(sessionsCompletedCount, sessions.length))

  return (
    <div dir="rtl">
      {completed > 0 && (
        <div className="mb-4 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-gray-700">
          <strong className="text-brand">
            {completed.toLocaleString('fa-IR')} از {sessions.length.toLocaleString('fa-IR')}
          </strong>{' '}
          جلسه برگزار شده است.
        </div>
      )}
      {(courseStartsAt || courseEndsAt) && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          {courseStartsAt && (
            <span>
              <strong className="text-gray-800">شروع دوره:</strong> {fmtDate(courseStartsAt)}
            </span>
          )}
          {courseEndsAt && (
            <span>
              <strong className="text-gray-800">پایان دوره:</strong> {fmtDate(courseEndsAt)}
            </span>
          )}
        </div>
      )}
      <ul className="space-y-3">
        {sessions.map((s) => {
          const passed = s.sessionNumber <= completed
          return (
            <li
              key={s.sessionNumber}
              className={`rounded-xl px-4 py-3 flex flex-wrap justify-between gap-2 shadow-sm border ${
                passed
                  ? 'bg-brand/5 border-brand/30'
                  : 'bg-white border-gray-100'
              }`}
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                جلسه {s.sessionNumber.toLocaleString('fa-IR')}
                {passed ? (
                  <span className="text-xs font-normal text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                    برگزار شد
                  </span>
                ) : null}
              </span>
              <span className="text-sm text-gray-600">
                {fmtDate(s.startsAt)} — {fmtTime(s.startsAt)} تا {fmtTime(s.endsAt)}
              </span>
              {s.note ? <span className="text-xs text-gray-400 w-full">{s.note}</span> : null}
            </li>
          )
        })}
      </ul>
      {sessions.length === 0 && (
        <p className="text-sm text-gray-500">جلسه‌ای ثبت نشده است.</p>
      )}
    </div>
  )
}
