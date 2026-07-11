/** Platform share of each student course payment (percent). */
export const STUDENT_PLATFORM_CUT_PERCENT = 15

export function calcStudentPlatformCut(amountToman: number): number {
  if (amountToman <= 0) return 0
  return Math.round((amountToman * STUDENT_PLATFORM_CUT_PERCENT) / 100)
}

export function calcStudentTeacherShare(amountToman: number): number {
  return Math.max(0, amountToman - calcStudentPlatformCut(amountToman))
}

export function formatPlatformCutLabel(): string {
  return `${STUDENT_PLATFORM_CUT_PERCENT.toLocaleString('fa-IR')}٪`
}
