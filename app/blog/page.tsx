import Link from 'next/link'
import { and, asc, desc, eq } from 'drizzle-orm'
import { blogPost, db, service as serviceTable } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

export const revalidate = 300

const SITE_URL = getSiteOrigin()

export const metadata: Metadata = {
  title: 'وبلاگ — آنکو دیزاین',
  description:
    'مقالات تخصصی درباره طراحی سایت، سئو، فروشگاه اینترنتی، تولید محتوا و دیجیتال مارکتینگ با تمرکز بر روندهای مدرن سئو.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'وبلاگ — آنکو دیزاین',
    description: 'مقالات تخصصی دیجیتال مارکتینگ و سئو',
    url: `${SITE_URL}/blog`,
    locale: 'fa_IR',
    type: 'website',
  },
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: { service?: string }
}) {
  const services = await db
    .select({ slug: serviceTable.slug, fa: serviceTable.fa })
    .from(serviceTable)
    .where(eq(serviceTable.active, true))
    .orderBy(asc(serviceTable.sortOrder))
  const serviceSlugs = new Set(services.map((s) => s.slug))
  const serviceFilter =
    searchParams.service && serviceSlugs.has(searchParams.service) ? searchParams.service : undefined

  const whereCond = serviceFilter
    ? and(eq(blogPost.published, true), eq(blogPost.serviceCategory, serviceFilter))
    : eq(blogPost.published, true)

  const posts = await db
    .select()
    .from(blogPost)
    .where(whereCond)
    .orderBy(desc(blogPost.publishedAt), desc(blogPost.updatedAt))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
          <header className="mb-10 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">وبلاگ</h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              نکات به‌روز سئو، تجربه کاربری و رشد آنلاین کسب‌وکارها — دسته‌بندی‌شده بر اساس خدمات ما.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link
              href="/blog"
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                !serviceFilter
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
              }`}
            >
              همه
            </Link>
            {services.map((o) => (
              <Link
                key={o.slug}
                href={`/blog?service=${o.slug}`}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  serviceFilter === o.slug
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand'
                }`}
              >
                {o.fa}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">هنوز مطلبی در این بخش منتشر نشده است.</p>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 p-5 md:p-6 shadow-sm hover:border-brand/30 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-brand bg-brand-light px-2 py-0.5 rounded-full">
                        {services.find((x) => x.slug === post.serviceCategory)?.fa ?? post.serviceCategory}
                      </span>
                      {post.publishedAt && (
                        <time
                          dateTime={post.publishedAt.toISOString()}
                          className="text-xs text-gray-400"
                        >
                          {new Date(post.publishedAt).toLocaleDateString('fa-IR')}
                        </time>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <span className="inline-block mt-3 text-sm text-brand font-medium">ادامه مطلب ←</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
