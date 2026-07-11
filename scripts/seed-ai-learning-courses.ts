import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadEnvFile()

async function main() {
  const { randomUUID } = await import('node:crypto')
  const { AI_LEARNING_COURSES } = await import('@/lib/ai-learning-courses-data')
  const { buildAiLearningSeoBodyMarkdown } = await import('@/lib/ai-learning-seo-body')
  const { AI_LEARNING_SLUG_PREFIX } = await import('@/lib/learning-jobs')
  const { db, job } = await import('@/lib/db')

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const now = new Date()
  let upserted = 0

  for (let i = 0; i < AI_LEARNING_COURSES.length; i++) {
    const course = AI_LEARNING_COURSES[i]!
    if (!course.slug.startsWith(AI_LEARNING_SLUG_PREFIX)) {
      throw new Error(`Invalid slug (must start with ${AI_LEARNING_SLUG_PREFIX}): ${course.slug}`)
    }

    const seoBody = buildAiLearningSeoBodyMarkdown({
      fa: course.fa,
      en: course.en,
      metaDescription: course.metaDescription,
    })
    const metaTitle = `آموزش خصوصی ${course.fa.replace(/^(دوره|آموزش|برنامه)\s+/u, '').slice(0, 50)}`.slice(0, 70)

    await db
      .insert(job)
      .values({
        id: randomUUID(),
        slug: course.slug,
        fa: course.fa,
        seoBody,
        metaTitle,
        metaDescription: course.metaDescription.slice(0, 165),
        sortOrder: 5000 + i,
        active: true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: job.slug,
        set: {
          fa: course.fa,
          seoBody,
          metaTitle,
          metaDescription: course.metaDescription.slice(0, 165),
          sortOrder: 5000 + i,
          active: true,
          updatedAt: new Date(),
        },
      })

    upserted++
  }

  console.log(`✓ Upserted ${upserted} AI learning courses (slug prefix: ${AI_LEARNING_SLUG_PREFIX})`)
  console.log(`  Hub: /learn/ai`)
  console.log(`  Example: /learn/${AI_LEARNING_COURSES[0]?.slug}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
