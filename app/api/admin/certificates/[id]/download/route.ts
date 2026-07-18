import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-api-auth'
import {
  getTrainingCertificateById,
  renderTrainingCertificatePdf,
  trainingCertificateToData,
} from '@/lib/training-certificate'

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id } = await context.params
  const cert = await getTrainingCertificateById(id)
  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const pdf = await renderTrainingCertificatePdf(trainingCertificateToData(cert))
  const filename = `uncodesign-certificate-${cert.trackingNumber}.pdf`

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
