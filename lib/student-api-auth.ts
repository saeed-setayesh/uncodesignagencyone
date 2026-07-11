import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function requireStudentSession(): Promise<
  | { ok: true; studentId: string; phone: string; name: string }
  | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'student') {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return {
    ok: true,
    studentId: session.user.id,
    phone: session.user.phone ?? '',
    name: session.user.name ?? '',
  }
}
