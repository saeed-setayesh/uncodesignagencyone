import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function requireCustomerSession(): Promise<
  | { ok: true; customerId: string; email: string; name: string | null }
  | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'customer') {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return {
    ok: true,
    customerId: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? null,
  }
}
