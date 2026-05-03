import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { blogPost, db, service as serviceTable } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import BlogMarkdown from '@/components/blog/BlogMarkdown'
import type { Metadata } from 'next'
import { getSiteOrigin } from '@/lib/site-url'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const postRows = await db
    .select()
    .from(blogPost)
    .where(and(eq(blogPost.slug, slug), eq(blogPost.published, true)))
    .limit(1)
  const post = postRows[0]
  if (!post) return {}

  const title = post.metaTitle?.trim() || `${post.title} | وبلاگ آنکو دیزاین`
  const description = (post.metaDescription?.trim() || post.excerpt).slice(0, 200)
  const url = `${getSiteOrigin()}/blog/${post.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      locale: 'fa_IR',
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const postRows = await db
    .select()
    .from(blogPost)
    .where(and(eq(blogPost.slug, slug), eq(blogPost.published, true)))
    .limit(1)
  const post = postRows[0]
  if (!post) notFound()

  const svcRows = await db
    .select({ fa: serviceTable.fa })
    .from(serviceTable)
    .where(and(eq(serviceTable.slug, post.serviceCategory), eq(serviceTable.active, true)))
    .limit(1)
  const section = svcRows[0]?.fa ?? post.serviceCategory
  const publishedIso = (post.publishedAt ?? post.createdAt).toISOString()
  const modifiedIso = post.updatedAt.toISOString()
  const origin = getSiteOrigin()
  const pageUrl = `${origin}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: (post.metaDescription?.trim() || post.excerpt).slice(0, 500),
    inLanguage: 'fa-IR',
    datePublished: publishedIso,
    dateModified: modifiedIso,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    articleSection: section,
    publisher: {
      '@type': 'Organization',
      name: 'آنکو دیزاین',
      url: origin,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <article className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/blog" className="hover:text-brand">
              وبلاگ
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/blog?service=${post.serviceCategory}`} className="hover:text-brand">
              {section}
            </Link>
          </nav>

          <header className="mb-8">
            <p className="text-sm font-medium text-brand mb-2">{section}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <time dateTime={publishedIso}>{new Date(publishedIso).toLocaleDateString('fa-IR')}</time>
              {modifiedIso !== publishedIso && (
                <span className="text-xs">به‌روز: {new Date(modifiedIso).toLocaleDateString('fa-IR')}</span>
              )}
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed text-base border-s-4 border-brand/40 ps-4">
              {post.excerpt}
            </p>
          </header>

          <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm mb-10">
            <BlogMarkdown source={post.body} />
          </div>

          <section className="rounded-xl bg-brand-light/50 border border-brand/20 p-5 md:p-6">
            <h2 className="text-base font-bold text-gray-900 mb-2">خدمت مرتبط</h2>
            <p className="text-sm text-gray-600 mb-4">
              این مطلب در دستهٔ «{section}» است. برای دیدن صفحهٔ اصلی این سرویس و نمونه صفحات صنف‌ها، لینک زیر را
              ببینید.
            </p>
            <Link
              href={`/${post.serviceCategory}`}
              className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-dark"
            >
              رفتن به {section} ←
            </Link>
          </section>
        </article>

        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
