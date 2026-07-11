import { NextResponse } from 'next/server'
import { getCertificateByTrackingNumber } from '@/lib/student-certificate'

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.trim()
  if (!code) {
    return NextResponse.json({ error: 'شماره پیگیری الزامی است' }, { status: 400 })
  }

  const cert = await getCertificateByTrackingNumber(code)
  if (!cert) {
    return NextResponse.json({ valid: false, error: 'گواهی یافت نشد' }, { status: 404 })
  }

  return NextResponse.json({
    valid: true,
    certificate: {
      trackingNumber: cert.trackingNumber,
      studentName: cert.studentName,
      courseTitle: cert.courseTitle,
      sessionCount: cert.sessionCount,
      issuedAt: cert.issuedAt,
    },
  })
}
