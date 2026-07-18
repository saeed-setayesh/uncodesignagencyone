import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/admin-api-auth'
import {
  createTrainingCertificate,
  getTrainingCertificateVerifyUrl,
  listTrainingCertificates,
} from '@/lib/training-certificate'

const bodySchema = z.object({
  studentName: z.string().min(1),
  skillTitle: z.string().min(1),
  teacherName: z.string().min(1),
  courseTitle: z.string().min(1),
  totalHours: z.number().int().min(0).optional(),
  sessionCount: z.number().int().min(0).optional(),
  courseStartsAt: z.string().nullable().optional(),
  courseEndsAt: z.string().nullable().optional(),
  durationText: z.string().optional(),
})

function parseDate(raw?: string | null): Date | null {
  if (!raw?.trim()) return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

export async function GET() {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const rows = await listTrainingCertificates()
  return NextResponse.json({
    certificates: rows.map((c) => ({
      id: c.id,
      trackingNumber: c.trackingNumber,
      studentName: c.studentName,
      skillTitle: c.skillTitle,
      teacherName: c.teacherName,
      courseTitle: c.courseTitle,
      durationText: c.durationText,
      issuedAt: c.issuedAt,
      verifyUrl: getTrainingCertificateVerifyUrl(c.trackingNumber),
    })),
  })
}

export async function POST(req: Request) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const body = parsed.data
  try {
    const cert = await createTrainingCertificate({
      studentName: body.studentName,
      skillTitle: body.skillTitle,
      teacherName: body.teacherName,
      courseTitle: body.courseTitle,
      totalHours: body.totalHours,
      sessionCount: body.sessionCount,
      courseStartsAt: parseDate(body.courseStartsAt),
      courseEndsAt: parseDate(body.courseEndsAt),
      durationText: body.durationText,
    })

    return NextResponse.json({
      ok: true,
      certificate: {
        id: cert.id,
        trackingNumber: cert.trackingNumber,
        studentName: cert.studentName,
        skillTitle: cert.skillTitle,
        teacherName: cert.teacherName,
        courseTitle: cert.courseTitle,
        durationText: cert.durationText,
        issuedAt: cert.issuedAt,
        verifyUrl: getTrainingCertificateVerifyUrl(cert.trackingNumber),
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create certificate' },
      { status: 500 }
    )
  }
}
