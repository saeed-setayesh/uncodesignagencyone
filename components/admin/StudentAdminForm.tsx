'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildEvenInstallments, getPaymentProgress } from '@/lib/student-payment'

type SessionRow = {
  sessionNumber: number
  date: string
  startTime: string
  endTime: string
  note: string
}

type PaymentRow = {
  id?: string
  sequence: number
  amountToman: number
  status: string
}

type JobOption = { slug: string; fa: string }

type Props = {
  studentId?: string
}

function defaultSessions(n: number): SessionRow[] {
  return Array.from({ length: n }, (_, i) => ({
    sessionNumber: i + 1,
    date: '',
    startTime: '10:00',
    endTime: '12:00',
    note: '',
  }))
}

export default function StudentAdminForm({ studentId }: Props) {
  const router = useRouter()
  const isEdit = !!studentId

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [jobs, setJobs] = useState<JobOption[]>([])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [active, setActive] = useState(true)
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [priceToman, setPriceToman] = useState('')
  const [jobSlug, setJobSlug] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [teacherPhone, setTeacherPhone] = useState('')
  const [paymentCardNumber, setPaymentCardNumber] = useState('')
  const [paymentShaba, setPaymentShaba] = useState('')
  const [paymentCardHolder, setPaymentCardHolder] = useState('')
  const [paymentBankName, setPaymentBankName] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [status, setStatus] = useState('pending_contract')
  const [paymentPlan, setPaymentPlan] = useState('')
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [installmentDrafts, setInstallmentDrafts] = useState<PaymentRow[]>([])
  const [installmentCount, setInstallmentCount] = useState(1)
  const [sessionCount, setSessionCount] = useState(4)
  const [sessionsCompletedCount, setSessionsCompletedCount] = useState(0)
  const [sessions, setSessions] = useState<SessionRow[]>(defaultSessions(4))

  useEffect(() => {
    fetch('/api/admin/jobs')
      .then((r) => r.json())
      .then((d) => {
        const list = (d.jobs ?? []).filter((j: { active?: boolean }) => j.active !== false)
        setJobs(list.map((j: { slug: string; fa: string }) => ({ slug: j.slug, fa: j.fa })))
      })
      .catch(() => {})
  }, [])

  const loadStudent = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    const res = await fetch(`/api/admin/students/${studentId}`)
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'خطا')
      return
    }
    const s = data.student
    const e = data.enrollment
    setName(s.name)
    setPhone(s.phone)
    setActive(s.active)
    if (e) {
      setCourseTitle(e.courseTitle)
      setCourseDescription(e.courseDescription)
      setPriceToman(String(e.priceToman))
      setJobSlug(e.jobSlug ?? '')
      setTeacherName(e.teacherName)
      setTeacherPhone(e.teacherPhone)
      setPaymentCardNumber(e.paymentCardNumber)
      setPaymentShaba(e.paymentShaba ?? '')
      setPaymentCardHolder(e.paymentCardHolder)
      setPaymentBankName(e.paymentBankName)
      setAdminNotes(e.adminNotes)
      setStatus(e.status)
      setPaymentPlan(e.paymentPlan ?? '')
      setSessionsCompletedCount(e.sessionsCompletedCount ?? 0)
      const loadedPayments: PaymentRow[] = (data.payments ?? []).map(
        (p: { id: string; sequence: number; amountToman: number; status: string }) => ({
          id: p.id,
          sequence: p.sequence,
          amountToman: p.amountToman,
          status: p.status,
        })
      )
      setPayments(loadedPayments)
      if (loadedPayments.length > 0) {
        setInstallmentDrafts(loadedPayments)
        setInstallmentCount(loadedPayments.length)
      } else {
        const price = Number(e.priceToman) || 0
        const defaults =
          price > 0
            ? buildEvenInstallments(price, 1)
            : [{ sequence: 1, amountToman: 0 }]
        setInstallmentDrafts(defaults.map((d) => ({ ...d, status: 'pending' })))
        setInstallmentCount(1)
      }
      const mapped: SessionRow[] = (data.sessions ?? []).map(
        (row: { sessionNumber: number; startsAt: string; endsAt: string; note: string }) => {
          const start = new Date(row.startsAt)
          const end = new Date(row.endsAt)
          const pad = (n: number) => String(n).padStart(2, '0')
          return {
            sessionNumber: row.sessionNumber,
            date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
            startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
            endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
            note: row.note ?? '',
          }
        }
      )
      if (mapped.length > 0) {
        setSessionCount(mapped.length)
        setSessions(mapped)
      }
    }
  }, [studentId])

  const installmentTotal = useMemo(
    () => installmentDrafts.reduce((sum, row) => sum + (row.amountToman || 0), 0),
    [installmentDrafts]
  )

  const coursePrice = useMemo(() => parseInt(priceToman.replace(/\D/g, ''), 10) || 0, [priceToman])

  const waitingInstallment = useMemo(() => {
    const progress = getPaymentProgress(payments)
    return progress.phase === 'waiting' ? progress.sequence : null
  }, [payments])

  function resizeInstallments(count: number) {
    const n = Math.max(1, Math.min(12, count))
    setInstallmentCount(n)
    setInstallmentDrafts((prev) => {
      const price = parseInt(priceToman.replace(/\D/g, ''), 10) || installmentTotal || 0
      const even = buildEvenInstallments(price, n)
      return even.map((row) => {
        const existing = prev.find((p) => p.sequence === row.sequence)
        if (existing && existing.status === 'confirmed') {
          return existing
        }
        return {
          id: existing?.id,
          sequence: row.sequence,
          amountToman: existing?.amountToman ?? row.amountToman,
          status: existing?.status ?? 'pending',
        }
      })
    })
  }

  function splitInstallmentsEvenly() {
    const price = coursePrice || installmentTotal
    if (!price) return
    setInstallmentDrafts((prev) => {
      const even = buildEvenInstallments(price, prev.length || installmentCount)
      return even.map((row) => {
        const existing = prev.find((p) => p.sequence === row.sequence)
        if (existing && existing.status === 'confirmed') {
          return existing
        }
        return {
          ...existing,
          sequence: row.sequence,
          amountToman: row.amountToman,
          status: existing?.status ?? 'pending',
        }
      })
    })
  }

  function updateInstallmentAmount(sequence: number, raw: string) {
    const amount = parseInt(raw.replace(/\D/g, ''), 10)
    setInstallmentDrafts((prev) =>
      prev.map((row) => {
        if (row.sequence !== sequence) return row
        if (row.status === 'confirmed') return row
        return { ...row, amountToman: amount || 0 }
      })
    )
  }

  useEffect(() => {
    loadStudent()
  }, [loadStudent])

  function resizeSessions(n: number) {
    const count = Math.max(1, Math.min(52, n))
    setSessionCount(count)
    setSessionsCompletedCount((prev) => Math.min(prev, count))
    setSessions((prev) => {
      if (prev.length === count) return prev
      if (prev.length < count) {
        return [
          ...prev,
          ...defaultSessions(count - prev.length).map((s, i) => ({
            ...s,
            sessionNumber: prev.length + i + 1,
          })),
        ]
      }
      return prev.slice(0, count).map((s, i) => ({ ...s, sessionNumber: i + 1 }))
    })
  }

  async function handleRegeneratePassword() {
    if (!studentId) return
    setError('')
    const res = await fetch(`/api/admin/students/${studentId}/regenerate-password`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'خطا')
      return
    }
    setGeneratedPassword(data.generatedPassword)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const price = parseInt(priceToman.replace(/\D/g, ''), 10)
    if (!price || price <= 0) {
      setSaving(false)
      setError('مبلغ دوره نامعتبر است')
      return
    }

    if (isEdit) {
      for (const row of installmentDrafts) {
        if (!row.amountToman || row.amountToman <= 0) {
          setSaving(false)
          setError(`مبلغ قسط ${row.sequence} نامعتبر است`)
          return
        }
      }
    }

    const payload = {
      name,
      phone,
      active,
      courseTitle,
      courseDescription,
      priceToman: price,
      jobSlug: jobSlug || null,
      teacherName,
      teacherPhone,
      paymentCardNumber,
      paymentShaba,
      paymentCardHolder,
      paymentBankName,
      adminNotes,
      status: isEdit ? status : undefined,
      sessionsCompletedCount: isEdit ? Math.min(sessionsCompletedCount, sessions.length) : undefined,
      sessions: sessions.map((s) => ({
        sessionNumber: s.sessionNumber,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        note: s.note || undefined,
      })),
      installments: isEdit
        ? installmentDrafts.map((row) => ({
            sequence: row.sequence,
            amountToman: row.amountToman,
          }))
        : undefined,
      initialStatus: 'pending_contract',
    }

    const url = isEdit ? `/api/admin/students/${studentId}` : '/api/admin/students'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error || 'خطا در ذخیره')
      return
    }

    if (data.generatedPassword) {
      setGeneratedPassword(data.generatedPassword)
    }

    if (!isEdit && data.studentId) {
      router.push(`/admin/students/${data.studentId}`)
    } else {
      await loadStudent()
      router.refresh()
    }
  }

  async function confirmPayment(paymentId: string) {
    if (!studentId) return
    await runPaymentAction({ action: 'confirm', paymentId })
  }

  async function runPaymentAction(body: Record<string, string>) {
    if (!studentId) return
    setError('')
    const res = await fetch(`/api/admin/students/${studentId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'خطا')
      return
    }
    loadStudent()
    router.refresh()
  }

  const PAYMENT_STATUS_LABELS: Record<string, string> = {
    pending: 'پرداخت نشده',
    reported: 'گزارش شده',
    confirmed: 'پرداخت شده',
  }

  if (loading) {
    return <p className="text-sm text-gray-500">در حال بارگذاری...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl" dir="rtl">
      {generatedPassword && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-amber-900 mb-1">رمز عبور (فقط یک‌بار نمایش داده می‌شود)</p>
          <code dir="ltr" className="block bg-white px-3 py-2 rounded border text-base select-all">
            {generatedPassword}
          </code>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">حساب دانشجو</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">نام</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">موبایل</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              dir="ltr"
              className="w-full border rounded-lg px-3 py-2 text-sm text-left"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          حساب فعال
        </label>
        {isEdit && (
          <button
            type="button"
            onClick={handleRegeneratePassword}
            className="text-sm text-brand font-medium hover:underline"
          >
            تولید رمز عبور جدید
          </button>
        )}
      </section>

      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">دوره</h3>
        <div>
          <label className="block text-sm text-gray-600 mb-1">عنوان دوره</label>
          <input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">توضیحات</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">مبلغ (تومان)</label>
            <input
              value={priceToman}
              onChange={(e) => setPriceToman(e.target.value)}
              required
              dir="ltr"
              className="w-full border rounded-lg px-3 py-2 text-sm text-left"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">صفحه آموزش (اختیاری)</label>
            <select
              value={jobSlug}
              onChange={(e) => setJobSlug(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {jobs.map((j) => (
                <option key={j.slug} value={j.slug}>
                  {j.fa} ({j.slug})
                </option>
              ))}
            </select>
          </div>
        </div>
        {isEdit && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">وضعیت ثبت‌نام</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="draft">پیش‌نویس</option>
              <option value="pending_contract">قرارداد</option>
              <option value="pending_payment_plan">انتخاب پلن</option>
              <option value="pending_payment_1">پرداخت ۱</option>
              <option value="payment_1_review">بررسی پرداخت ۱</option>
              <option value="pending_payment_2">پرداخت ۲</option>
              <option value="payment_2_review">بررسی پرداخت ۲</option>
              <option value="active">فعال</option>
              <option value="completed">تکمیل</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm text-gray-600 mb-1">یادداشت داخلی</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">مربی و پرداخت</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="نام مربی"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="موبایل مربی"
            value={teacherPhone}
            onChange={(e) => setTeacherPhone(e.target.value)}
            dir="ltr"
            className="border rounded-lg px-3 py-2 text-sm text-left"
          />
          <input
            placeholder="شماره کارت"
            value={paymentCardNumber}
            onChange={(e) => setPaymentCardNumber(e.target.value)}
            dir="ltr"
            className="border rounded-lg px-3 py-2 text-sm text-left md:col-span-2"
          />
          <input
            placeholder="شماره شبا"
            value={paymentShaba}
            onChange={(e) => setPaymentShaba(e.target.value)}
            dir="ltr"
            className="border rounded-lg px-3 py-2 text-sm text-left md:col-span-2"
          />
          <input
            placeholder="به نام"
            value={paymentCardHolder}
            onChange={(e) => setPaymentCardHolder(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="بانک"
            value={paymentBankName}
            onChange={(e) => setPaymentBankName(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900">جلسات</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <label>تعداد جلسات</label>
              <input
                type="number"
                min={1}
                max={52}
                value={sessionCount}
                onChange={(e) => resizeSessions(parseInt(e.target.value, 10) || 1)}
                className="w-16 border rounded px-2 py-1"
              />
            </div>
            {isEdit && (
              <div className="flex items-center gap-2">
                <label htmlFor="sessions-completed">جلسات برگزار شده</label>
                <input
                  id="sessions-completed"
                  type="number"
                  min={0}
                  max={sessions.length}
                  value={sessionsCompletedCount}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10)
                    setSessionsCompletedCount(
                      Number.isFinite(n) ? Math.max(0, Math.min(sessions.length, n)) : 0
                    )
                  }}
                  className="w-16 border rounded px-2 py-1"
                />
                <span className="text-gray-500 text-xs">از {sessions.length}</span>
              </div>
            )}
          </div>
        </div>
        {isEdit && sessionsCompletedCount > 0 && (
          <p className="text-xs text-brand bg-brand/5 border border-brand/20 rounded-lg px-3 py-2">
            جلسات ۱ تا {sessionsCompletedCount.toLocaleString('fa-IR')} به‌عنوان برگزارشده علامت‌گذاری می‌شوند.
          </p>
        )}
        <div className="space-y-3">
          {sessions.map((s, idx) => (
            <div
              key={s.sessionNumber}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-sm items-end rounded-lg border border-gray-100 p-3 md:border-0 md:p-0"
            >
              <span className="font-medium text-gray-700">جلسه {s.sessionNumber}</span>
              <input
                type="date"
                value={s.date}
                onChange={(e) => {
                  const next = [...sessions]
                  next[idx] = { ...s, date: e.target.value }
                  setSessions(next)
                }}
                required
                className="border rounded-lg px-2 py-1.5"
              />
              <input
                type="time"
                value={s.startTime}
                onChange={(e) => {
                  const next = [...sessions]
                  next[idx] = { ...s, startTime: e.target.value }
                  setSessions(next)
                }}
                required
                className="border rounded-lg px-2 py-1.5"
              />
              <input
                type="time"
                value={s.endTime}
                onChange={(e) => {
                  const next = [...sessions]
                  next[idx] = { ...s, endTime: e.target.value }
                  setSessions(next)
                }}
                required
                className="border rounded-lg px-2 py-1.5"
              />
              <input
                placeholder="یادداشت"
                value={s.note}
                onChange={(e) => {
                  const next = [...sessions]
                  next[idx] = { ...s, note: e.target.value }
                  setSessions(next)
                }}
                className="border rounded-lg px-2 py-1.5 md:col-span-1 col-span-2"
              />
            </div>
          ))}
        </div>
      </section>

      {isEdit && (
        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">اقساط و مبالغ</h3>
              <p className="text-xs text-gray-500 mt-1">
                تعداد بخش‌های پرداخت و مبلغ هر قسط را می‌توانید تغییر دهید. فقط اقساط
                تأییدشده قفل هستند؛ برای «گزارش شده» مبلغ قابل ویرایش است.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                تعداد اقساط
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={installmentCount}
                  onChange={(e) => resizeInstallments(parseInt(e.target.value, 10) || 1)}
                  className="w-16 border rounded px-2 py-1 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={splitInstallmentsEvenly}
                className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:border-brand"
              >
                تقسیم مساوی
              </button>
              {waitingInstallment != null && (
                <button
                  type="button"
                  onClick={() => runPaymentAction({ action: 'trigger_second_payment' })}
                  className="text-sm bg-brand/10 text-brand px-3 py-1.5 rounded-lg font-medium hover:bg-brand/20"
                >
                  فعال‌سازی قسط {waitingInstallment.toLocaleString('fa-IR')}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {installmentDrafts.map((row) => {
              const amountLocked = row.status === 'confirmed'
              return (
                <div
                  key={row.sequence}
                  className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 items-center border border-gray-100 rounded-lg p-3"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    قسط {row.sequence.toLocaleString('fa-IR')}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">مبلغ (تومان)</label>
                    <input
                      value={row.amountToman ? row.amountToman.toLocaleString('fa-IR') : ''}
                      onChange={(e) => updateInstallmentAmount(row.sequence, e.target.value)}
                      disabled={amountLocked}
                      dir="ltr"
                      className="w-full border rounded-lg px-3 py-2 text-sm text-left disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {PAYMENT_STATUS_LABELS[row.status] ?? row.status}
                    {row.id && payments.find((p) => p.id === row.id) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {row.status !== 'confirmed' && row.id && (
                          <button
                            type="button"
                            onClick={() => confirmPayment(row.id!)}
                            className="text-brand font-medium hover:underline"
                          >
                            تأیید پرداخت
                          </button>
                        )}
                        {row.status === 'reported' && row.id && (
                          <button
                            type="button"
                            onClick={() => runPaymentAction({ action: 'mark_unpaid', paymentId: row.id! })}
                            className="text-amber-700 font-medium hover:underline"
                          >
                            لغو گزارش
                          </button>
                        )}
                        {row.status === 'confirmed' && row.id && (
                          <button
                            type="button"
                            onClick={() => runPaymentAction({ action: 'mark_unpaid', paymentId: row.id! })}
                            className="text-red-600 font-medium hover:underline"
                          >
                            علامت‌گذاری پرداخت نشده
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              جمع اقساط:{' '}
              <strong className="text-gray-800">{installmentTotal.toLocaleString('fa-IR')} تومان</strong>
            </span>
            {coursePrice > 0 && installmentTotal !== coursePrice && (
              <span className="text-amber-700">
                مبلغ دوره: {coursePrice.toLocaleString('fa-IR')} تومان (اختلاف{' '}
                {Math.abs(coursePrice - installmentTotal).toLocaleString('fa-IR')} تومان)
              </span>
            )}
            {paymentPlan && (
              <span>
                پلن فعلی:{' '}
                {paymentPlan === 'full'
                  ? 'یک‌جا'
                  : paymentPlan === 'split'
                    ? 'دو قسط'
                    : `${paymentPlan} قسط`}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            با ذخیره فرم، ساختار اقساط اعمال می‌شود. می‌توانید پرداخت را مستقیم تأیید کنید یا
            پرداخت تأییدشده را لغو کنید.
          </p>
        </section>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-brand text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
      >
        {saving ? 'در حال ذخیره...' : 'ذخیره'}
      </button>
    </form>
  )
}
