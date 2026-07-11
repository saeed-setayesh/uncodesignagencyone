import { NextResponse } from 'next/server'
import { requireStudentSession } from '@/lib/student-api-auth'
import { getLatestEnrollmentForStudent } from '@/lib/student-enrollment-query'
import {
  certificateToDownloadData,
  getCertificateByEnrollmentId,
  renderCertificateHtml,
  type CertificateLang,
} from '@/lib/student-certificate'

export async function GET(req: Request) {
  const auth = await requireStudentSession()
  if (!auth.ok) return auth.response

  const langParam = new URL(req.url).searchParams.get('lang')
  const lang: CertificateLang = langParam === 'en' ? 'en' : 'fa'

  const enrollment = await getLatestEnrollmentForStudent(auth.studentId)
  if (!enrollment || enrollment.status !== 'completed') {
    return NextResponse.json({ error: 'گواهی برای این دوره صادر نشده است' }, { status: 404 })
  }

  const cert = await getCertificateByEnrollmentId(enrollment.id)
  if (!cert) {
    return NextResponse.json({ error: 'گواهی یافت نشد' }, { status: 404 })
  }

  const html = renderCertificateHtml(certificateToDownloadData(cert), lang)
  const filename = `uncodesign-certificate-${cert.trackingNumber}-${lang}.html`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
