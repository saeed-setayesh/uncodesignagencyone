import { asc, eq } from 'drizzle-orm'
import { db, job, service } from '@/lib/db'
import NavbarClient from '@/components/layout/NavbarClient'
import { isAiLearningJob, isHiringJob } from '@/lib/learning-jobs'
import { isSoftwareProduct } from '@/lib/software-products'
import { shouldShowInServiceCatalog } from '@/lib/service-slug-canonical'

export default async function Navbar() {
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'

  const [allServices, allJobs] = await Promise.all([
    db
      .select({ slug: service.slug, fa: service.fa })
      .from(service)
      .where(eq(service.active, true))
      .orderBy(asc(service.sortOrder)),
    db
      .select({ slug: job.slug, fa: job.fa })
      .from(job)
      .where(eq(job.active, true))
      .orderBy(asc(job.sortOrder), asc(job.fa)),
  ])

  const services = allServices.filter((s) => shouldShowInServiceCatalog(s.slug))
  const jobs = allJobs.filter((j) => isHiringJob(j.slug))
  const learnTopics = allJobs.filter((j) => !isAiLearningJob(j.slug))
  const hasAiCourses = allJobs.some((j) => isAiLearningJob(j.slug))
  const hasSoftwareProducts = allServices.some((s) => isSoftwareProduct(s.slug))

  return (
    <NavbarClient
      services={services}
      jobs={jobs}
      learnTopics={learnTopics}
      hasAiCourses={hasAiCourses}
      hasSoftwareProducts={hasSoftwareProducts}
      phone={phone}
    />
  )
}
