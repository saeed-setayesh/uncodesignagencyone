import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import {
  db,
  studentEnrollment,
  studentPayment,
  studentSession,
  type StudentEnrollment,
} from '@/lib/db'
import { computeCourseDates } from '@/lib/student-payment'
import { maybeCompleteEnrollment } from '@/lib/student-certificate'

export type SessionInput = {
  sessionNumber: number
  date: string
  startTime: string
  endTime: string
  note?: string
}

export function parseSessionDatetime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`)
}

export async function replaceEnrollmentSessions(
  enrollmentId: string,
  sessions: SessionInput[]
): Promise<{ courseStartsAt: Date | null; courseEndsAt: Date | null }> {
  await db.delete(studentSession).where(eq(studentSession.enrollmentId, enrollmentId))

  const rows = sessions.map((s) => {
    const startsAt = parseSessionDatetime(s.date, s.startTime)
    const endsAt = parseSessionDatetime(s.date, s.endTime)
    return {
      id: randomUUID(),
      enrollmentId,
      sessionNumber: s.sessionNumber,
      startsAt,
      endsAt,
      note: s.note ?? '',
      createdAt: new Date(),
    }
  })

  if (rows.length > 0) {
    await db.insert(studentSession).values(rows)
  }

  const dates = computeCourseDates(rows)
  const [current] = await db
    .select({ sessionsCompletedCount: studentEnrollment.sessionsCompletedCount })
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)

  await db
    .update(studentEnrollment)
    .set({
      sessionCount: rows.length,
      sessionsCompletedCount: Math.min(current?.sessionsCompletedCount ?? 0, rows.length),
      courseStartsAt: dates.courseStartsAt,
      courseEndsAt: dates.courseEndsAt,
      updatedAt: new Date(),
    })
    .where(eq(studentEnrollment.id, enrollmentId))

  return dates
}

export async function getEnrollmentBundle(enrollmentId: string) {
  const [enrollment] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.id, enrollmentId))
    .limit(1)
  if (!enrollment) return null

  const sessions = await db
    .select()
    .from(studentSession)
    .where(eq(studentSession.enrollmentId, enrollmentId))
    .orderBy(studentSession.sessionNumber)

  const payments = await db
    .select()
    .from(studentPayment)
    .where(eq(studentPayment.enrollmentId, enrollmentId))
    .orderBy(studentPayment.sequence)

  return { enrollment, sessions, payments }
}

export type EnrollmentBundle = NonNullable<Awaited<ReturnType<typeof getEnrollmentBundle>>>

export function enrollmentToJson(
  bundle: EnrollmentBundle,
  student?: { id: string; phone: string; name: string; active: boolean }
) {
  return {
    student,
    enrollment: bundle.enrollment,
    sessions: bundle.sessions,
    payments: bundle.payments,
  }
}

export function canAdminEditEnrollment(enrollment: StudentEnrollment): boolean {
  return enrollment.status === 'draft' || enrollment.status === 'pending_contract'
}
