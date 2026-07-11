import { randomBytes, randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db, studentCertificate, studentEnrollment, studentUser } from '@/lib/db'

export type CertificateLang = 'fa' | 'en'

export function generateTrackingNumber(): string {
  const year = new Date().getFullYear()
  const suffix = randomBytes(4).toString('hex').toUpperCase()
  return `UC-${year}-${suffix}`
}

export async function getCertificateByEnrollmentId(enrollmentId: string) {
  const [row] = await db
    .select()
    .from(studentCertificate)
    .where(eq(studentCertificate.enrollmentId, enrollmentId))
    .limit(1)
  return row ?? null
}

export async function getCertificateByTrackingNumber(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  const [row] = await db
    .select()
    .from(studentCertificate)
    .where(eq(studentCertificate.trackingNumber, normalized))
    .limit(1)
  return row ?? null
}

export async function issueCertificateIfNeeded(enrollmentId: string): Promise<typeof studentCertificate.$inferSelect | null> {
  const existing = await getCertificateByEnrollmentId(enrollmentId)
  if (existing) return existing

  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment || enrollment.status !== 'completed') return null

  const [student] = await db
    .select()
    .from(studentUser)
    .where(eq(studentUser.id, enrollment.studentId))
    .limit(1)
  if (!student) return null

  const now = new Date()
  let trackingNumber = generateTrackingNumber()
  for (let attempt = 0; attempt < 5; attempt++) {
    const [dup] = await db
      .select({ id: studentCertificate.id })
      .from(studentCertificate)
      .where(eq(studentCertificate.trackingNumber, trackingNumber))
      .limit(1)
    if (!dup) break
    trackingNumber = generateTrackingNumber()
  }

  const id = randomUUID()
  await db.insert(studentCertificate).values({
    id,
    enrollmentId,
    trackingNumber,
    studentName: student.name,
    courseTitle: enrollment.courseTitle,
    sessionCount: enrollment.sessionCount,
    issuedAt: now,
    createdAt: now,
  })

  const [created] = await db
    .select()
    .from(studentCertificate)
    .where(eq(studentCertificate.id, id))
    .limit(1)
  return created ?? null
}

export async function maybeCompleteEnrollment(
  enrollmentId: string,
  sessionsCompletedCount: number,
  sessionCount: number
): Promise<void> {
  if (sessionCount <= 0 || sessionsCompletedCount < sessionCount) return

  const now = new Date()
  await db
    .update(studentEnrollment)
    .set({ status: 'completed', updatedAt: now })
    .where(eq(studentEnrollment.id, enrollmentId))

  await issueCertificateIfNeeded(enrollmentId)
}

type CertData = {
  studentName: string
  courseTitle: string
  sessionCount: number
  trackingNumber: string
  issuedAt: Date
}

function formatDateFa(d: Date): string {
  return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateEn(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function renderCertificateHtml(data: CertData, lang: CertificateLang): string {
  const isFa = lang === 'fa'
  const dir = isFa ? 'rtl' : 'ltr'
  const align = isFa ? 'right' : 'left'
  const issued = isFa ? formatDateFa(data.issuedAt) : formatDateEn(data.issuedAt)

  const title = isFa ? 'گواهی تکمیل دوره' : 'Certificate of Completion'
  const subtitle = isFa ? 'آنکو دیزاین — Uncodesign' : 'Uncodesign — آنکو دیزاین'
  const nameLabel = isFa ? 'نام دانشجو' : 'Student name'
  const courseLabel = isFa ? 'عنوان دوره' : 'Course title'
  const sessionsLabel = isFa ? 'تعداد جلسات' : 'Sessions completed'
  const dateLabel = isFa ? 'تاریخ صدور' : 'Issue date'
  const trackingLabel = isFa ? 'شماره پیگیری' : 'Tracking number'
  const body = isFa
    ? 'بدین‌وسیله تأیید می‌شود که دانشجوی نام‌برده دوره فوق را با موفقیت به پایان رسانده است.'
    : 'This certifies that the named student has successfully completed the course listed above.'

  return `<!DOCTYPE html>
<html lang="${isFa ? 'fa' : 'en'}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${title} — ${data.trackingNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${isFa ? 'Tahoma, Arial, sans-serif' : 'Georgia, "Times New Roman", serif'};
      background: #f3f4f6;
      padding: 2rem;
      color: #111827;
    }
    .cert {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 3px solid #16a34a;
      border-radius: 16px;
      padding: 3rem;
      box-shadow: 0 10px 40px rgba(0,0,0,.08);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .brand { color: #16a34a; font-size: .875rem; font-weight: 700; letter-spacing: .05em; }
    h1 { font-size: 2rem; margin: .75rem 0 .25rem; color: #111827; }
    .subtitle { color: #6b7280; font-size: .95rem; }
    .body-text { text-align: ${align}; line-height: 1.8; color: #374151; margin-bottom: 2rem; font-size: 1.05rem; }
    dl { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 2rem; text-align: ${align}; }
    dt { font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; color: #9ca3af; margin-bottom: .25rem; }
    dd { font-size: 1.1rem; font-weight: 600; color: #111827; }
    .tracking {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px dashed #d1d5db;
      text-align: center;
    }
    .tracking code {
      display: inline-block;
      font-size: 1.25rem;
      letter-spacing: .12em;
      color: #16a34a;
      font-weight: 700;
      direction: ltr;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .cert { box-shadow: none; border-width: 2px; }
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="header">
      <div class="brand">UNCODESIGN</div>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <p class="body-text">${body}</p>
    <dl>
      <div><dt>${nameLabel}</dt><dd>${escapeHtml(data.studentName)}</dd></div>
      <div><dt>${courseLabel}</dt><dd>${escapeHtml(data.courseTitle)}</dd></div>
      <div><dt>${sessionsLabel}</dt><dd>${data.sessionCount.toLocaleString(isFa ? 'fa-IR' : 'en-US')}</dd></div>
      <div><dt>${dateLabel}</dt><dd>${issued}</dd></div>
    </dl>
    <div class="tracking">
      <dt style="margin-bottom:.5rem">${trackingLabel}</dt>
      <code>${data.trackingNumber}</code>
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function certificateToDownloadData(cert: typeof studentCertificate.$inferSelect): CertData {
  return {
    studentName: cert.studentName,
    courseTitle: cert.courseTitle,
    sessionCount: cert.sessionCount,
    trackingNumber: cert.trackingNumber,
    issuedAt: new Date(cert.issuedAt),
  }
}
