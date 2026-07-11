import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { db, job } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSiteOrigin } from '@/lib/site-url'
import { isAiLearningJob } from '@/lib/learning-jobs'
import { GraduationCap, Sparkles, Users, Star, Brain } from 'lucide-react'

const SITE = getSiteOrigin()
const LEARN_DESC =
  'آموزش خصوصی فناوری‌های روز: طراحی وب، فرانت‌اند، بک‌اند، موبایل، دیتاساینس و... — کلاس یک‌به‌یک با مربی شاغل صنعت، پروژه‌محور و آماده‌سازی برای ورود به بازار کار ایران.'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'آموزش خصوصی فناوری — کلاس یک‌به‌یک با مربی صنعتی | آنکو دیزاین',
  description: LEARN_DESC,
  alternates: { canonical: `${SITE}/learn` },
  openGraph: {
    title: 'آموزش خصوصی فناوری — آنکو دیزاین',
    description: LEARN_DESC,
    url: `${SITE}/learn`,
    locale: 'fa_IR',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function LearnIndexPage() {
  const allJobs = await db
    .select({
      id: job.id,
      slug: job.slug,
      fa: job.fa,
      metaDescription: job.metaDescription,
    })
    .from(job)
    .where(eq(job.active, true))
    .orderBy(asc(job.sortOrder), asc(job.fa))

  const aiJobs = allJobs.filter((j) => isAiLearningJob(j.slug))
  const techJobs = allJobs.filter((j) => !isAiLearningJob(j.slug))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'آموزش‌های خصوصی آنکو دیزاین',
    description: LEARN_DESC,
    itemListElement: allJobs.map((j, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/learn/${j.slug}`,
      name: `آموزش ${j.fa}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-light/50 via-white to-slate-50" />
          <div className="max-w-4xl mx-auto px-4 py-14 md:py-20 text-center" dir="rtl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-4 py-1.5 text-sm text-brand-dark mb-5 shadow-sm">
              <GraduationCap className="w-4 h-4" />
              کلاس یک‌به‌یک — مربی صنعتی واقعی
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              مهارت بازار کار را با آموزش خصوصی یاد بگیرید
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              نه ویدئوی پسیو، نه کلاس انبوه. کلاس‌های شخصی با مربی شاغل، پروژهٔ واقعی و آماده‌سازی برای مصاحبه و
              ورود به بازار. مهارت مورد علاقه‌تان را انتخاب کنید.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
              <Stat icon={<Users className="w-5 h-5" />} value="+۸۰" label="دانشجوی موفق" />
              <Stat icon={<Star className="w-5 h-5" />} value="۹۸٪" label="رضایت دانشجو" />
              <Stat icon={<Sparkles className="w-5 h-5" />} value="۱:۱" label="کلاس خصوصی" />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" aria-label="فهرست آموزش‌ها">
          <div className="max-w-5xl mx-auto px-4" dir="rtl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">آموزش‌های خصوصی فعال</h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                روی هر تخصص بزنید تا برنامهٔ هفته‌به‌هفته، پلن‌ها و فرآیند ثبت‌نام را ببینید.
              </p>
            </div>

            {aiJobs.length > 0 && (
              <Link
                href="/learn/ai"
                className="group block mb-10 rounded-2xl border-2 border-violet-200 bg-gradient-to-l from-violet-50 to-white p-6 hover:border-violet-400 hover:shadow-md transition"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100 text-violet-700">
                    <Brain className="w-7 h-7" />
                  </span>
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-800">
                      دوره‌های هوش مصنوعی ({aiJobs.length.toLocaleString('fa-IR')} دوره)
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Prompt Engineering، ML، تولید محتوا، Agent، RAG و کاربرد AI در کسب‌وکار
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-violet-700">مشاهده همه ←</span>
                </div>
              </Link>
            )}

            {techJobs.length === 0 && aiJobs.length === 0 ? (
              <p className="text-center text-slate-500">در حال حاضر آموزشی فعال نیست.</p>
            ) : techJobs.length > 0 ? (
              <>
                {aiJobs.length > 0 && (
                  <h3 className="text-lg font-bold text-gray-900 mb-4">سایر مهارت‌های فناوری</h3>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {techJobs.map((j) => (
                  <li key={j.id}>
                    <Link
                      href={`/learn/${j.slug}`}
                      className="group block h-full rounded-2xl border border-slate-200 bg-slate-50/40 p-5 hover:border-brand hover:bg-white hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand/10 text-brand">
                          <GraduationCap className="w-5 h-5" />
                        </span>
                        <span className="text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition">
                          ثبت‌نام ←
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base group-hover:text-brand transition-colors">
                        آموزش خصوصی {j.fa}
                      </h3>
                      {j.metaDescription?.trim() ? (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {j.metaDescription.trim()}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500">یک‌به‌یک با مربی صنعتی، پروژه‌محور.</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              </>
            ) : null}
          </div>
        </section>

        <section className="py-16 bg-brand-dark text-white">
          <div className="max-w-3xl mx-auto px-4 text-center" dir="rtl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">مطمئن نیستید کدام مهارت برای شما مناسب است؟</h2>
            <p className="text-white/85 mb-8">یک تماس کوتاه برای راهنمایی مسیر شغلی — بدون هزینه.</p>
            <Link
              href="/contact?learn=consult"
              className="inline-flex items-center justify-center bg-white text-brand-dark px-8 py-3.5 rounded-xl font-bold hover:bg-brand-light transition"
            >
              مشاورهٔ رایگان مسیر یادگیری
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 py-4 px-2 shadow-sm">
      <div className="flex justify-center text-brand mb-1">{icon}</div>
      <div className="text-xl md:text-2xl font-black text-slate-900">{value}</div>
      <div className="text-[11px] text-slate-500 mt-1">{label}</div>
    </div>
  )
}
