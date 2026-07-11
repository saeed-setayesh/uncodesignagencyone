import Link from 'next/link'
import { EnamadTrustSeal } from '@/components/EnamadTrustSeal'
import { BrandLogo } from '@/components/BrandLogo'
import SocialMediaLinks from '@/components/SocialMediaLinks'
import { asc, eq } from 'drizzle-orm'
import { db, service } from '@/lib/db'
import { isSoftwareProduct } from '@/lib/software-products'
import { shouldShowInServiceCatalog } from '@/lib/service-slug-canonical'
import { buildSocialMediaLinks, getSocialMediaSettings } from '@/lib/social-media'

export default async function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE ?? '02112345678'

  const [allServices, socialSettings] = await Promise.all([
    db
      .select({ slug: service.slug, fa: service.fa })
      .from(service)
      .where(eq(service.active, true))
      .orderBy(asc(service.sortOrder)),
    getSocialMediaSettings(),
  ])

  const services = allServices.filter((s) => shouldShowInServiceCatalog(s.slug))
  const hasSoftwareProducts = allServices.some((s) => isSoftwareProduct(s.slug))
  const socialLinks = buildSocialMediaLinks(socialSettings)

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              ارائه‌دهنده خدمات طراحی سایت حرفه‌ای برای کسب‌وکارهای ایرانی. تحویل ۱۴ روزه، پشتیبانی ۶ ماهه رایگان.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  نمونه کارها
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  تیم ما
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  وبلاگ
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-white transition-colors">
                  آموزش برنامه‌نویسی
                </Link>
              </li>
              {hasSoftwareProducts ? (
                <li>
                  <Link href="/software" className="hover:text-white transition-colors">
                    نرم‌افزار اختصاصی
                  </Link>
                </li>
              ) : null}
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="hover:text-white transition-colors">
                    {s.fa}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="hover:text-white transition-colors font-medium">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${phone}`} className="hover:text-white transition-colors" dir="ltr">
                  {phone}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full sm:w-auto min-w-[10rem] bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-dark transition-colors"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
            {socialLinks.length > 0 ? (
              <div className="mt-6">
                <SocialMediaLinks links={socialLinks} variant="footer" />
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-start">© {new Date().getFullYear()} آنکو دیزاین. تمامی حقوق محفوظ است.</p>
          <EnamadTrustSeal className="shrink-0 inline-flex opacity-90 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  )
}
