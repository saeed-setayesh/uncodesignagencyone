import { randomBytes, randomUUID } from 'node:crypto'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import { desc, eq } from 'drizzle-orm'
import { db, trainingCertificate } from '@/lib/db'
import { getSiteOrigin } from '@/lib/site-url'

export type TrainingCertInput = {
  studentName: string
  skillTitle: string
  teacherName: string
  courseTitle: string
  totalHours?: number
  sessionCount?: number
  courseStartsAt?: Date | null
  courseEndsAt?: Date | null
  durationText?: string
}

export type TrainingCertData = TrainingCertInput & {
  durationText: string
  totalHours: number
  sessionCount: number
  courseStartsAt: Date | null
  courseEndsAt: Date | null
  trackingNumber: string
  issuedAt: Date
}

export const UNCODesign_CERT_REFERENCE = {
  name: 'Uncodesign',
  legalName: 'Uncodesign Training & Design',
  phone: '09031238349',
  telegram: '@uncodesignadmin',
  email: 'info@uncodesign.ir',
  postalCode: '1476933851',
  address:
    'Tehran, Punak North, Bahar St., Orchid Alley, No. 3, 5th Floor — Iran',
  addressFa:
    'تهران - مرکزی پونک شمالی خیابان بهار کوچه ارکیده پلاک ۳ طبقه ۵',
} as const

export function generateTrainingTrackingNumber(): string {
  const year = new Date().getFullYear()
  const suffix = randomBytes(4).toString('hex').toUpperCase()
  return `UCD-${year}-${suffix}`
}

export function getTrainingCertificateVerifyUrl(trackingNumber: string): string {
  const origin = getSiteOrigin()
  return `${origin}/certificate/verify/${encodeURIComponent(trackingNumber)}`
}

function formatDateEn(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateRange(start: Date | null, end: Date | null): string | null {
  if (!start && !end) return null
  if (start && end) return `${formatDateEn(start)} – ${formatDateEn(end)}`
  if (start) return `From ${formatDateEn(start)}`
  return `Until ${formatDateEn(end!)}`
}

export function buildDurationText(input: {
  totalHours: number
  sessionCount: number
  courseStartsAt: Date | null
  courseEndsAt: Date | null
}): string {
  const parts: string[] = []
  if (input.totalHours > 0) {
    parts.push(`${input.totalHours} hour${input.totalHours === 1 ? '' : 's'}`)
  }
  if (input.sessionCount > 0) {
    parts.push(`${input.sessionCount} session${input.sessionCount === 1 ? '' : 's'}`)
  }
  const range = formatDateRange(input.courseStartsAt, input.courseEndsAt)
  if (range) parts.push(range)
  return parts.join(' • ') || 'Completed training program'
}

async function uniqueTrackingNumber(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const trackingNumber = generateTrainingTrackingNumber()
    const [dup] = await db
      .select({ id: trainingCertificate.id })
      .from(trainingCertificate)
      .where(eq(trainingCertificate.trackingNumber, trackingNumber))
      .limit(1)
    if (!dup) return trackingNumber
  }
  throw new Error('Could not generate unique certificate ID')
}

export async function listTrainingCertificates(limit = 100) {
  return db
    .select()
    .from(trainingCertificate)
    .orderBy(desc(trainingCertificate.issuedAt))
    .limit(limit)
}

export async function getTrainingCertificateById(id: string) {
  const [row] = await db
    .select()
    .from(trainingCertificate)
    .where(eq(trainingCertificate.id, id))
    .limit(1)
  return row ?? null
}

export async function getTrainingCertificateByTrackingNumber(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  const [row] = await db
    .select()
    .from(trainingCertificate)
    .where(eq(trainingCertificate.trackingNumber, normalized))
    .limit(1)
  return row ?? null
}

function normalizeInput(input: TrainingCertInput) {
  const totalHours = Math.max(0, input.totalHours ?? 0)
  const sessionCount = Math.max(0, input.sessionCount ?? 0)
  const courseStartsAt = input.courseStartsAt ?? null
  const courseEndsAt = input.courseEndsAt ?? null
  const durationText =
    input.durationText?.trim() ||
    buildDurationText({ totalHours, sessionCount, courseStartsAt, courseEndsAt })

  return {
    studentName: input.studentName.trim(),
    skillTitle: input.skillTitle.trim(),
    teacherName: input.teacherName.trim(),
    courseTitle: input.courseTitle.trim(),
    durationText,
    totalHours,
    sessionCount,
    courseStartsAt,
    courseEndsAt,
  }
}

export async function createTrainingCertificate(
  input: TrainingCertInput
): Promise<typeof trainingCertificate.$inferSelect> {
  const values = normalizeInput(input)
  if (!values.studentName || !values.skillTitle || !values.teacherName || !values.courseTitle) {
    throw new Error('All certificate fields are required')
  }

  const now = new Date()
  const id = randomUUID()
  const trackingNumber = await uniqueTrackingNumber()

  await db.insert(trainingCertificate).values({
    id,
    enrollmentId: null,
    studentId: null,
    trackingNumber,
    ...values,
    issuedAt: now,
    createdAt: now,
  })

  const created = await getTrainingCertificateById(id)
  if (!created) throw new Error('Failed to create certificate')
  return created
}

export async function updateTrainingCertificate(
  id: string,
  input: TrainingCertInput
): Promise<typeof trainingCertificate.$inferSelect> {
  const existing = await getTrainingCertificateById(id)
  if (!existing) throw new Error('Certificate not found')

  const values = normalizeInput(input)
  if (!values.studentName || !values.skillTitle || !values.teacherName || !values.courseTitle) {
    throw new Error('All certificate fields are required')
  }

  await db
    .update(trainingCertificate)
    .set({ ...values, issuedAt: new Date() })
    .where(eq(trainingCertificate.id, id))

  const updated = await getTrainingCertificateById(id)
  if (!updated) throw new Error('Failed to update certificate')
  return updated
}

export async function deleteTrainingCertificate(id: string): Promise<void> {
  await db.delete(trainingCertificate).where(eq(trainingCertificate.id, id))
}

export function trainingCertificateToData(
  cert: typeof trainingCertificate.$inferSelect
): TrainingCertData {
  return {
    studentName: cert.studentName,
    skillTitle: cert.skillTitle,
    teacherName: cert.teacherName,
    courseTitle: cert.courseTitle,
    durationText: cert.durationText,
    totalHours: cert.totalHours,
    sessionCount: cert.sessionCount,
    courseStartsAt: cert.courseStartsAt ? new Date(cert.courseStartsAt) : null,
    courseEndsAt: cert.courseEndsAt ? new Date(cert.courseEndsAt) : null,
    trackingNumber: cert.trackingNumber,
    issuedAt: new Date(cert.issuedAt),
  }
}

function wrapText(text: string, maxLen: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxLen && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function measureFieldBlock(
  value: string,
  w: number,
  options?: { maxLines?: number; valueSize?: number; lineHeight?: number; gapAfter?: number }
): number {
  const maxLines = options?.maxLines ?? 2
  const valueSize = options?.valueSize ?? 12
  const lineHeight = options?.lineHeight ?? 14
  const gapAfter = options?.gapAfter ?? 18
  const lines = wrapText(value, Math.max(24, Math.floor(w / (valueSize * 0.55))))
  const usedLines = Math.min(lines.length, maxLines)
  return 16 + usedLines * lineHeight + gapAfter
}

function drawTwoColumnRow(
  page: ReturnType<PDFDocument['addPage']>,
  left: { label: string; value: string },
  right: { label: string; value: string },
  y: number,
  regular: Awaited<ReturnType<PDFDocument['embedFont']>>,
  bold: Awaited<ReturnType<PDFDocument['embedFont']>>
): number {
  drawFieldBlock(page, left.label, left.value, 72, y, 330, regular, bold, { gapAfter: 0 })
  drawFieldBlock(page, right.label, right.value, 430, y, 330, regular, bold, { gapAfter: 0 })
  const leftH = measureFieldBlock(left.value, 330)
  const rightH = measureFieldBlock(right.value, 330)
  return y - Math.max(leftH, rightH) - 4
}

function drawFieldBlock(
  page: ReturnType<PDFDocument['addPage']>,
  label: string,
  value: string,
  x: number,
  y: number,
  w: number,
  regular: Awaited<ReturnType<PDFDocument['embedFont']>>,
  bold: Awaited<ReturnType<PDFDocument['embedFont']>>,
  options?: { maxLines?: number; valueSize?: number; lineHeight?: number; gapAfter?: number }
): number {
  const maxLines = options?.maxLines ?? 2
  const valueSize = options?.valueSize ?? 12
  const lineHeight = options?.lineHeight ?? 14
  const gapAfter = options?.gapAfter ?? 18
  const light = rgb(0.61, 0.64, 0.69)
  const dark = rgb(0.07, 0.09, 0.15)

  page.drawText(label, { x, y, size: 8, font: bold, color: light })
  const lines = wrapText(value, Math.max(24, Math.floor(w / (valueSize * 0.55))))
  let lineY = y - 16
  for (const line of lines.slice(0, maxLines)) {
    page.drawText(line, {
      x,
      y: lineY,
      size: valueSize,
      font: bold,
      color: dark,
      maxWidth: w,
    })
    lineY -= lineHeight
  }
  return lineY - gapAfter
}

function drawCenteredText(
  page: ReturnType<PDFDocument['addPage']>,
  text: string,
  y: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument['embedFont']>>,
  color: ReturnType<typeof rgb>
) {
  const pageWidth = 842
  const textWidth = font.widthOfTextAtSize(text, size)
  page.drawText(text, { x: (pageWidth - textWidth) / 2, y, size, font, color })
}

export async function renderTrainingCertificatePdf(data: TrainingCertData): Promise<Buffer> {
  const verifyUrl = getTrainingCertificateVerifyUrl(data.trackingNumber)
  const siteUrl = getSiteOrigin()
  const ref = UNCODesign_CERT_REFERENCE

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595])
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const green = rgb(0.09, 0.64, 0.29)
  const dark = rgb(0.07, 0.09, 0.15)
  const muted = rgb(0.42, 0.45, 0.5)

  const border = { x: 36, y: 36, w: 770, h: 523 }
  const innerTop = border.y + border.h
  const footerTop = border.y + 132

  page.drawRectangle({
    x: border.x,
    y: border.y,
    width: border.w,
    height: border.h,
    borderColor: green,
    borderWidth: 2,
    color: rgb(1, 1, 1),
  })

  const qrPng = await QRCode.toBuffer(verifyUrl, { width: 160, margin: 1, type: 'png' })
  const qrImage = await pdfDoc.embedPng(qrPng)
  const qrSize = 68
  const qrX = border.x + border.w - qrSize - 20
  const qrY = innerTop - qrSize - 22
  page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize })
  page.drawText('Scan to verify', {
    x: qrX - 4,
    y: qrY - 12,
    size: 7,
    font: regular,
    color: muted,
  })

  drawCenteredText(page, 'UNCODESIGN', innerTop - 38, 11, bold, green)
  drawCenteredText(page, 'Certificate of Training', innerTop - 70, 24, bold, dark)
  drawCenteredText(page, 'Official training completion certificate', innerTop - 98, 11, regular, muted)

  page.drawLine({
    start: { x: 96, y: innerTop - 118 },
    end: { x: 746, y: innerTop - 118 },
    thickness: 1,
    color: rgb(0.9, 0.91, 0.92),
  })

  page.drawText(
    'This is to certify that the named student has successfully completed the training program detailed below.',
    {
      x: 72,
      y: innerTop - 146,
      size: 11,
      font: regular,
      color: muted,
      maxWidth: 620,
      lineHeight: 14,
    }
  )

  let y = innerTop - 172
  y = drawTwoColumnRow(
    page,
    { label: 'STUDENT NAME', value: data.studentName },
    { label: 'INSTRUCTOR', value: data.teacherName },
    y,
    regular,
    bold
  )
  y = drawTwoColumnRow(
    page,
    { label: 'COURSE', value: data.courseTitle },
    { label: 'ISSUE DATE', value: formatDateEn(data.issuedAt) },
    y,
    regular,
    bold
  )

  y = drawFieldBlock(page, 'DURATION & SCHEDULE', data.durationText, 72, y, 688, regular, bold, {
    maxLines: 2,
    gapAfter: 12,
  })

  y = drawFieldBlock(page, 'CERTIFICATE ID', data.trackingNumber, 72, y, 688, regular, bold, {
    maxLines: 1,
    gapAfter: 8,
  })

  const skillMaxLines = Math.max(2, Math.min(5, Math.floor((y - footerTop - 12) / 13)))
  y = drawFieldBlock(page, 'SKILL / SPECIALIZATION', data.skillTitle, 72, y, 688, regular, bold, {
    maxLines: skillMaxLines,
    valueSize: 10,
    lineHeight: 13,
    gapAfter: 8,
  })

  page.drawLine({
    start: { x: 72, y: footerTop + 2 },
    end: { x: 770, y: footerTop + 2 },
    thickness: 1,
    color: rgb(0.9, 0.91, 0.92),
  })

  const compactRefLines = [
    `${ref.legalName}  •  Phone: ${ref.phone}  •  Telegram: ${ref.telegram}`,
    `${siteUrl}  •  Postal Code: ${ref.postalCode}`,
    ref.address,
  ]

  page.drawText('Issued by Uncodesign', {
    x: 72,
    y: footerTop - 6,
    size: 7,
    font: bold,
    color: green,
  })

  compactRefLines.forEach((line, i) => {
    page.drawText(line, {
      x: 72,
      y: footerTop - 16 - i * 8,
      size: 6.5,
      font: regular,
      color: muted,
      maxWidth: 688,
    })
  })

  const buttonWidth = 688
  const buttonPaddingX = 8
  const buttonPaddingY = 5
  const buttonTextSize = 6.5
  const urlLines = wrapText(verifyUrl, 108).slice(0, 2)
  const buttonTextHeight = urlLines.length * 8
  const buttonHeight = buttonTextHeight + buttonPaddingY * 2
  const buttonY = border.y + 44

  page.drawText('Verify this certificate online:', {
    x: 72,
    y: buttonY + buttonHeight + 6,
    size: 7,
    font: regular,
    color: muted,
  })

  page.drawRectangle({
    x: 72,
    y: buttonY,
    width: buttonWidth,
    height: buttonHeight,
    borderColor: green,
    borderWidth: 1,
    color: rgb(0.94, 0.99, 0.95),
  })

  urlLines.forEach((line, i) => {
    page.drawText(line, {
      x: 72 + buttonPaddingX,
      y: buttonY + buttonPaddingY + (urlLines.length - 1 - i) * 8,
      size: buttonTextSize,
      font: bold,
      color: green,
      maxWidth: buttonWidth - buttonPaddingX * 2,
    })
  })

  const bytes = await pdfDoc.save()
  return Buffer.from(bytes)
}
