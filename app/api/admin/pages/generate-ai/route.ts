import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { generateContentWithAI } from '@/lib/content'

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { industrySlug, citySlug, service } = await req.json()

  if (!industrySlug || !citySlug || !service) {
    return NextResponse.json({ error: 'industrySlug, citySlug and service are required' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured on the server' }, { status: 500 })
  }

  try {
    const content = await generateContentWithAI(industrySlug, citySlug, String(service))
    return NextResponse.json({ content })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'AI generation failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
