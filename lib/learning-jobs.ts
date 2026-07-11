/** Job slugs prefixed with this are private tutoring pages only — not hiring/career pages. */
export const AI_LEARNING_SLUG_PREFIX = 'ai-'

export function isAiLearningJob(slug: string): boolean {
  return slug.startsWith(AI_LEARNING_SLUG_PREFIX)
}

export function isHiringJob(slug: string): boolean {
  return !isAiLearningJob(slug)
}
