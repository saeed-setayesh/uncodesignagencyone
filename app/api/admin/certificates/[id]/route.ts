import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/admin-api-auth'
import {
  deleteTrainingCertificate,
  getTrainingCertificateById,
  getTrainingCertificateVerifyUrl,
  updateTrainingCertificate,
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

function toJson(cert: NonNullable<Awaited<ReturnType<typeof getTrainingCertificateById>>>) {
  return {
    id: cert.id,
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
  }
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id } = await context.params
  const cert = await getTrainingCertificateById(id)
  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ certificate: toJson(cert) })
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id } = await context.params
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const body = parsed.data
  try {
    const cert = await updateTrainingCertificate(id, {
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
    return NextResponse.json({ ok: true, certificate: toJson(cert) })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to update certificate' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const { id } = await context.params
  const cert = await getTrainingCertificateById(id)
  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await deleteTrainingCertificate(id)
  return NextResponse.json({ ok: true })
}
