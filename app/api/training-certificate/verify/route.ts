import { NextResponse } from 'next/server'
import {
  getTrainingCertificateByTrackingNumber,
  getTrainingCertificateVerifyUrl,
} from '@/lib/training-certificate'

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.trim()
  if (!code) {
    return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 })
  }

  const cert = await getTrainingCertificateByTrackingNumber(code)
  if (!cert) {
    return NextResponse.json({ valid: false, error: 'Certificate not found' }, { status: 404 })
  }

  return NextResponse.json({
    valid: true,
    type: 'training',
    certificate: {
      trackingNumber: cert.trackingNumber,
      studentName: cert.studentName,
      skillTitle: cert.skillTitle,
      teacherName: cert.teacherName,
      courseTitle: cert.courseTitle,
      durationText: cert.durationText,
      totalHours: cert.totalHours,
      sessionCount: cert.sessionCount,
      courseStartsAt: cert.courseStartsAt,
      courseEndsAt: cert.courseEndsAt,
      issuedAt: cert.issuedAt,
      verifyUrl: getTrainingCertificateVerifyUrl(cert.trackingNumber),
    },
  })
}
