import { desc, eq } from 'drizzle-orm'
import { db, studentEnrollment } from '@/lib/db'

export async function getLatestEnrollmentForStudent(studentId: string) {
  const [row] = await db
    .select()
    .from(studentEnrollment)
    .where(eq(studentEnrollment.studentId, studentId))
    .orderBy(desc(studentEnrollment.updatedAt))
    .limit(1)
  return row ?? null
}
