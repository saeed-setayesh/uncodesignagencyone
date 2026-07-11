import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/admin-api-auth'
import { db, studentEnrollment, studentUser } from '@/lib/db'
import { generateStudentPassword } from '@/lib/student-password'
import { normalizeStudentPhone } from '@/lib/student-phone'
import { replaceEnrollmentSessions, type SessionInput } from '@/lib/student-admin-save'
const sessionSchema = z.object({
  sessionNumber: z.number().int().positive(),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  note: z.string().optional(),
})

const postSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  active: z.boolean().optional(),
  password: z.string().min(6).optional(),
  courseTitle: z.string().min(1),
  courseDescription: z.string().optional(),
  priceToman: z.number().int().positive(),
  jobSlug: z.string().nullable().optional(),
  teacherName: z.string().optional(),
  teacherPhone: z.string().optional(),
  paymentCardNumber: z.string().optional(),
  paymentShaba: z.string().optional(),
  paymentCardHolder: z.string().optional(),
  paymentBankName: z.string().optional(),
  adminNotes: z.string().optional(),
  sessions: z.array(sessionSchema).min(1),
  initialStatus: z.enum(['draft', 'pending_contract']).optional(),
})

export async function GET() {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const rows = await db
    .select({
      studentId: studentUser.id,
      phone: studentUser.phone,
      name: studentUser.name,
      active: studentUser.active,
      enrollmentId: studentEnrollment.id,
      courseTitle: studentEnrollment.courseTitle,
      status: studentEnrollment.status,
      priceToman: studentEnrollment.priceToman,
      updatedAt: studentEnrollment.updatedAt,
    })
    .from(studentUser)
    .leftJoin(studentEnrollment, eq(studentEnrollment.studentId, studentUser.id))
    .orderBy(desc(studentUser.createdAt))

  return NextResponse.json({ students: rows })
}

export async function POST(req: Request) {
  const admin = await requireAdminSession()
  if (!admin.ok) return admin.response

  const parsed = postSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'ورودی نامعتبر', details: parsed.error.flatten() }, { status: 400 })
  }
  const body = parsed.data

  const phone = normalizeStudentPhone(body.phone)
  if (!phone) {
    return NextResponse.json({ error: 'شماره موبایل نامعتبر است' }, { status: 400 })
  }

  const [existingPhone] = await db.select().from(studentUser).where(eq(studentUser.phone, phone)).limit(1)
  if (existingPhone) {
    return NextResponse.json({ error: 'این شماره قبلاً ثبت شده است' }, { status: 409 })
  }

  const plainPassword = body.password ?? generateStudentPassword()
  const hashed = await bcrypt.hash(plainPassword, 10)
  const studentId = randomUUID()
  const enrollmentId = randomUUID()
  const now = new Date()

  await db.insert(studentUser).values({
    id: studentId,
    phone,
    password: hashed,
    name: body.name,
    active: body.active ?? true,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(studentEnrollment).values({
    id: enrollmentId,
    studentId,
    courseTitle: body.courseTitle,
    courseDescription: body.courseDescription ?? '',
    sessionCount: body.sessions.length,
    priceToman: body.priceToman,
    teacherName: body.teacherName ?? '',
    teacherPhone: body.teacherPhone ?? '',
    paymentCardNumber: body.paymentCardNumber ?? '',
    paymentShaba: body.paymentShaba ?? '',
    paymentCardHolder: body.paymentCardHolder ?? '',
    paymentBankName: body.paymentBankName ?? '',
    status: body.initialStatus ?? 'pending_contract',
    jobSlug: body.jobSlug ?? null,
    adminNotes: body.adminNotes ?? '',
    createdAt: now,
    updatedAt: now,
  })

  await replaceEnrollmentSessions(enrollmentId, body.sessions as SessionInput[])

  return NextResponse.json({
    ok: true,
    studentId,
    enrollmentId,
    generatedPassword: body.password ? undefined : plainPassword,
  })
}
