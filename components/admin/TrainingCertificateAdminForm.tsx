'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  certificateId?: string
  initial?: {
    studentName: string
    skillTitle: string
    teacherName: string
    courseTitle: string
    totalHours: number
    sessionCount: number
    courseStartsAt: string | null
    courseEndsAt: string | null
    durationText: string
    trackingNumber?: string
    verifyUrl?: string
  }
}

function toDateInput(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function TrainingCertificateAdminForm({ certificateId, initial }: Props) {
  const router = useRouter()
  const isEdit = !!certificateId

  const [studentName, setStudentName] = useState(initial?.studentName ?? '')
  const [skillTitle, setSkillTitle] = useState(initial?.skillTitle ?? '')
  const [teacherName, setTeacherName] = useState(initial?.teacherName ?? '')
  const [courseTitle, setCourseTitle] = useState(initial?.courseTitle ?? '')
  const [totalHours, setTotalHours] = useState(String(initial?.totalHours ?? ''))
  const [sessionCount, setSessionCount] = useState(String(initial?.sessionCount ?? ''))
  const [courseStartsAt, setCourseStartsAt] = useState(toDateInput(initial?.courseStartsAt))
  const [courseEndsAt, setCourseEndsAt] = useState(toDateInput(initial?.courseEndsAt))
  const [durationText, setDurationText] = useState(initial?.durationText ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [trackingNumber, setTrackingNumber] = useState(initial?.trackingNumber ?? '')
  const [verifyUrl, setVerifyUrl] = useState(initial?.verifyUrl ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      studentName,
      skillTitle,
      teacherName,
      courseTitle,
      totalHours: parseInt(totalHours.replace(/\D/g, ''), 10) || 0,
      sessionCount: parseInt(sessionCount.replace(/\D/g, ''), 10) || 0,
      courseStartsAt: courseStartsAt || null,
      courseEndsAt: courseEndsAt || null,
      durationText: durationText.trim() || undefined,
    }

    const url = isEdit ? `/api/admin/certificates/${certificateId}` : '/api/admin/certificates'
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error || 'خطا')
      return
    }

    if (isEdit) {
      setTrackingNumber(data.certificate.trackingNumber)
      setVerifyUrl(data.certificate.verifyUrl)
      router.refresh()
    } else {
      router.push(`/admin/certificates/${data.certificate.id}`)
    }
  }

  const inputCls =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">اطلاعات گواهی</h3>
          <p className="text-xs text-gray-500 mt-1">
            همه فیلدها را دستی پر کنید. این گواهی مستقل از پورتال دانشجو است و به‌صورت PDF
            انگلیسی صادر می‌شود.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام دانشجو</label>
            <input className={inputCls} value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مهارت / تخصص</label>
            <input className={inputCls} value={skillTitle} onChange={(e) => setSkillTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام مدرس</label>
            <input className={inputCls} value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام دوره</label>
            <input className={inputCls} value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تعداد ساعات</label>
            <input
              className={inputCls}
              inputMode="numeric"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تعداد جلسات</label>
            <input
              className={inputCls}
              inputMode="numeric"
              value={sessionCount}
              onChange={(e) => setSessionCount(e.target.value)}
              placeholder="8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ شروع</label>
            <input
              type="date"
              className={inputCls}
              value={courseStartsAt}
              onChange={(e) => setCourseStartsAt(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ پایان</label>
            <input
              type="date"
              className={inputCls}
              value={courseEndsAt}
              onChange={(e) => setCourseEndsAt(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              متن مدت دوره (اختیاری — در غیر این صورت خودکار ساخته می‌شود)
            </label>
            <input
              className={inputCls}
              value={durationText}
              onChange={(e) => setDurationText(e.target.value)}
              placeholder="32 hours • 8 sessions • January 5, 2026 – March 2, 2026"
              dir="ltr"
            />
          </div>
        </div>
      </section>

      {trackingNumber ? (
        <section className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm space-y-2">
          <p>
            <span className="text-gray-600">شماره گواهی: </span>
            <span className="font-mono font-semibold" dir="ltr">
              {trackingNumber}
            </span>
          </p>
          {verifyUrl ? (
            <p>
              <Link href={verifyUrl} target="_blank" className="text-brand hover:underline break-all" dir="ltr">
                {verifyUrl}
              </Link>
            </p>
          ) : null}
        </section>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60"
        >
          {saving ? 'در حال ذخیره...' : isEdit ? 'به‌روزرسانی گواهی' : 'صدور گواهی'}
        </button>
        {isEdit && certificateId ? (
          <a
            href={`/api/admin/certificates/${certificateId}/download`}
            className="inline-flex items-center border border-gray-200 px-6 py-2.5 rounded-lg font-semibold text-sm hover:border-brand"
          >
            دانلود PDF
          </a>
        ) : null}
      </div>
    </form>
  )
}
