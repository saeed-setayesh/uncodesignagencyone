import Link from 'next/link'
import { asc, count, eq } from 'drizzle-orm'
import { city, db, industry, service as serviceTable } from '@/lib/db'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import { getHomeServiceIcon } from '@/lib/home-service-icons'
import { parseServicePricingPlans } from '@/lib/parse-pricing-plans'
import { Phone, Zap, Shield, HeadphonesIcon, Target, Check, ArrowDownLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'آنکو دیزاین — طراحی سایت، فروشگاه، اپ، سئو و خدمات دیجیتال',
  description: 'طراحی سایت، فروشگاه اینترنتی، اپلیکیشن موبایل، سئو، شبکه‌های اجتماعی، پشتیبانی سایت، تولید محتوا و ربات برای کسب‌وکارهای ایرانی.',
}

export const revalidate = 3600

const SERVICE_ICON_BOX = 'bg-brand/10 text-brand ring-1 ring-inset ring-brand/20'

const EXPERTISE = [
  { title: 'طراحی وب و لندینگ', level: 96, subtitle: 'Next.js · React · UI سیستم' },
  { title: 'فروشگاه و تجارت آنلاین', level: 93, subtitle: 'ووکامرس · درگاه · انبارداری' },
  { title: 'اپلیکیشن موبایل', level: 90, subtitle: 'Flutter · اندروید · iOS' },
  { title: 'سئو و رشد ارگانیک', level: 88, subtitle: 'فنی · محتوا · تحلیل' },
  { title: 'شبکه‌های اجتماعی', level: 91, subtitle: 'استراتژی · تولید · انتشار' },
  { title: 'تولید محتوا و کپی', level: 89, subtitle: 'بلاگ · محصول · کمپین' },
  { title: 'ربات و اتوماسیون', level: 86, subtitle: 'API · وب‌هوک · پیام‌رسان' },
  { title: 'عملیات و امنیت', level: 87, subtitle: 'وردپرس · بک‌آپ · مانیتورینگ' },
]

const TECH_PILL_CLASS = 'border border-brand/25 bg-brand-light/90 text-brand-dark font-semibold'

const TECH_LABELS = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Drizzle',
  'WooCommerce',
  'WordPress',
  'Flutter',
  'Tailwind CSS',
  'Docker',
  'Git',
]

const WHY_US = [
  { Icon: Zap, title: 'تحویل به موقع', desc: 'هر پروژه در بازه زمانی دقیق تحویل می‌شود. بدون تأخیر، بدون توجیه.' },
  { Icon: Target, title: 'نتیجه‌محور', desc: 'هدف ما رشد کسب‌وکار شماست، نه فقط تحویل فایل. نتایج واقعی قابل اندازه‌گیری.' },
  { Icon: Shield, title: 'کد تمیز و استاندارد', desc: 'کدنویسی اصولی، قابل نگهداری، با مستندات کامل. مالکیت کامل کد با شما.' },
  { Icon: HeadphonesIcon, title: 'پشتیبانی واقعی', desc: 'تیم پشتیبانی ما در ساعات کاری همیشه پاسخگوست. نه ربات، بلکه انسان واقعی.' },
]

export default async function HomePage() {
  const [industryCountRow, cityCountRow, services] = await Promise.all([
    db.select({ c: count() }).from(industry).where(eq(industry.active, true)),
    db.select({ c: count() }).from(city).where(eq(city.active, true)),
    db
      .select()
      .from(serviceTable)
      .where(eq(serviceTable.active, true))
      .orderBy(asc(serviceTable.sortOrder), asc(serviceTable.fa)),
  ])
  const industryCount = Number(industryCountRow[0]?.c ?? 0)
  const cityCount = Number(cityCountRow[0]?.c ?? 0)

  const stats = [
    { value: '+۱۴۰', label: 'پروژه تحویل‌شده' },
    { value: '۹۷٪', label: 'رضایت مشتریان' },
    { value: `+${industryCount}`, label: 'صنف تخصصی' },
    { value: `+${cityCount}`, label: 'شهر در سراسر ایران' },
  ]

  return (
    <>
      <Navbar />
      <main>
        <section className="relative text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50/40 to-slate-50" />
          <div className="max-w-3xl mx-auto px-4 pt-16 pb-5 md:pt-20 md:pb-7">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl leading-[1.2]">
              حضور آنلاین حرفه‌ای
            </h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              سایت، فروشگاه و سئو — از طراحی تا اجرا. مشاوره رایگان بگیرید.
            </p>
            <div className="mt-8 flex flex-col items-stretch sm:flex-row sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-dark"
              >
                <Phone className="h-4 w-4" />
                مشاوره رایگان
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-brand/40 hover:text-brand"
              >
                نمونه کارها
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium text-slate-600 hover:text-brand"
              >
                <ArrowDownLeft className="h-4 w-4" />
                خدمات
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-white/80">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold tabular-nums text-slate-900 md:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-500 md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="relative py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark ring-1 ring-brand/25">
                خدمات ما
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                هر آنچه برای حضور آنلاین نیاز دارید
              </h2>
              <p className="mt-4 text-slate-600 max-w-xl mx-auto leading-relaxed">
                از طراحی تا رشد — یک تیم، یک مسئولیت، یک نتیجهٔ قابل اتکا.
              </p>
            </div>

            {services.length === 0 ? (
              <p className="text-center text-slate-500">در حال حاضر سرویسی در پایگاه داده ثبت نشده.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
                {services.map((svc) => {
                  const plans = parseServicePricingPlans(svc.pricingPlans, svc.priceTier)
                  const p0 = plans[0]
                  const priceLabel = p0?.priceLabel ?? '—'
                  const priceNote = p0?.description ?? p0?.name ?? ''
                  const blurb = (svc.metaDescription?.trim() || p0?.description || '').replace(/\s+/g, ' ')
                  const featureLines = (p0?.features ?? []).slice(0, 5)
                  const Icon = getHomeServiceIcon(svc.slug)
                  const href = `/${svc.slug}`

                  return (
                    <div
                      key={svc.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10"
                    >
                      {p0?.featured && (
                        <div className="absolute top-4 start-4 z-10 text-xs font-bold px-3 py-1 rounded-full bg-brand text-white">
                          پیشنهادی
                        </div>
                      )}
                      <div className="p-6 md:p-7 flex-1">
                        <div
                          className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${SERVICE_ICON_BOX}`}
                        >
                          <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{svc.fa}</h3>
                        {blurb && <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">{blurb}</p>}
                        {featureLines.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {featureLines.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="border-t border-slate-100 bg-slate-50/80 p-6">
                        <div className="mb-4">
                          <span className="text-xl font-black text-slate-900 md:text-2xl">از {priceLabel}</span>
                          {priceNote && <span className="text-xs text-slate-500 block mt-1">{priceNote}</span>}
                        </div>
                        <Link
                          href={href}
                          className="block text-center rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
                        >
                          اطلاعات بیشتر
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-brand text-sm font-semibold uppercase tracking-wide">چرا ما؟</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">تفاوت آنکو دیزاین با بقیه</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHY_US.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-brand/30 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.Icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 bg-gradient-to-b from-brand-light/40 via-white to-white">
          <div className="pointer-events-none absolute -top-24 end-0 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 start-0 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark px-3 py-1 text-xs font-bold text-brand-light">
                تکنولوژی و توانمندی
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                زیرساخت و مهارت برای تمام خدمات
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 leading-relaxed">
                هر مورد زیر مستقیماً به بخشی از خدمات ما وصل است — از لندینگ و فروشگاه تا اپ، سئو، شبکه اجتماعی، محتوا، ربات و نگهداری.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {EXPERTISE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-brand/25 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
                        <span className="font-bold text-slate-900">{item.title}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 md:text-sm">{item.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-sm font-black tabular-nums text-brand-dark">{item.level}٪</span>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-light">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-brand to-brand-dark"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3">
              {TECH_LABELS.map((label) => (
                <span key={label} className={`rounded-lg px-3 py-1.5 text-xs md:text-sm ${TECH_PILL_CLASS}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsSection />

        <section className="py-20 bg-white" id="contact">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">آماده شروع هستید؟</h2>
            <p className="text-gray-500 mb-10 text-lg">اولین قدم یک مشاوره رایگان است. بدون تعهد، بدون فشار.</p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-brand/30"
            >
              <Phone className="w-5 h-5" />
              صفحه تماس و راه‌های ارتباطی
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
