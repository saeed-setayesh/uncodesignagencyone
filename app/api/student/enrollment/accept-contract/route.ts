import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireStudentSession } from '@/lib/student-api-auth'
import { db, studentContractAcceptance, studentEnrollment } from '@/lib/db'
import { getLatestEnrollmentForStudent } from '@/lib/student-enrollment-query'
import { STUDENT_CONTRACT_VERSION } from '@/lib/student-course-contract'

export async function POST(req: Request) {
  const auth = await requireStudentSession()
  if (!auth.ok) return auth.response

  let body: { accepted?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.accepted) {
    return NextResponse.json({ error: 'پذیرش قرارداد الزامی است' }, { status: 400 })
  }

  const enrollment = await getLatestEnrollmentForStudent(auth.studentId)
  if (!enrollment) {
    return NextResponse.json({ error: 'دوره‌ای یافت نشد' }, { status: 404 })
  }
  if (enrollment.status !== 'pending_contract') {
    return NextResponse.json({ error: 'در این مرحله امکان پذیرش قرارداد نیست' }, { status: 400 })
  }

  const [existing] = await db
    .select({ id: studentContractAcceptance.id })
    .from(studentContractAcceptance)
    .where(eq(studentContractAcceptance.enrollmentId, enrollment.id))
    .limit(1)

  if (!existing) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? ''
    const userAgent = req.headers.get('user-agent') ?? ''
    await db.insert(studentContractAcceptance).values({
      id: randomUUID(),
      enrollmentId: enrollment.id,
      termsVersion: STUDENT_CONTRACT_VERSION,
      acceptedAt: new Date(),
      ip,
      userAgent,
    })
  }

  await db
    .update(studentEnrollment)
    .set({ status: 'pending_payment_plan', updatedAt: new Date() })
    .where(eq(studentEnrollment.id, enrollment.id))

  return NextResponse.json({ ok: true })
}
