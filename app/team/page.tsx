import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import { Monitor, Search, ShoppingCart, Share2, Smartphone, LifeBuoy, PenLine, Users, Target, Sparkles, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'

const DESC =
  'تیم ۷ نفرهٔ متخصصان فناوری آنکو دیزاین؛ طراحی سایت، سئو، فروشگاه، اپلیکیشن و خدمات دیجیتال با هدف یاری کسب‌وکارهای ایرانی.'

const WHAT_WE_DO = [
  {
    title: 'طراحی و توسعهٔ وب',
    text: 'سایت و لندینگ سریع، امن و مناسب برند شما — از ایده تا تحویل و پشتیبانی.',
    icon: Monitor,
  },
  {
    title: 'سئو و دیده‌شدن',
    text: 'به‌ینه‌سازی فنی و محتوا برای ورودی‌های بیشتر از جستجو و ترافیک پایدار.',
    icon: Search,
  },
  {
    title: 'فروش آنلاین',
    text: 'فروشگاه و فرایند پرداخت شفاف برای تبدیل بازدید به سفارش.',
    icon: ShoppingCart,
  },
  {
    title: 'شبکه‌های اجتماعی و برند',
    text: 'حضور حرفه‌ای در پلتفرم‌ها و پیام‌رسان‌ها، هم‌راستا با اهداف فروش.',
    icon: Share2,
  },
  {
    title: 'اپلیکیشن و محصول',
    text: 'تجربهٔ کاربری مناسب موبایل و وب‌اپ برای خدمت به مشتریان شما.',
    icon: Smartphone,
  },
  {
    title: 'پشتیبانی و ادامهٔ مسیر',
    text: 'بعد از راه‌اندازی هم کنار شماستیم: به‌روزرسانی، امنیت و رفع مسئله.',
    icon: LifeBuoy,
  },
  {
    title: 'تولید محتوا',
    text: 'متن و ساختار محتوا برای اعتماد، سئو و ارتباط بهتر با مخاطب.',
    icon: PenLine,
  },
] as const

export const metadata: Metadata = {
  title: 'تیم ما — آنکو دیزاین',
  description: DESC,
  alternates: {
    canonical: `${SITE}/team`,
  },
  openGraph: {
    title: 'تیم ما — آنکو دیزاین',
    description: DESC,
    locale: 'fa_IR',
    type: 'website',
  },
}

export const revalidate = 3600

export default function TeamPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'تیم ما — آنکو دیزاین',
    description: DESC,
    url: `${SITE}/team`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-brand-light/50 to-white border-b border-brand/10">
          <div className="max-w-4xl mx-auto px-4 py-14 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-brand/20 rounded-full px-4 py-1.5 text-sm text-brand-dark mb-6">
              <Users className="w-4 h-4" />
              تیم ما
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              متخصصان فناوری برای رشد کسب‌وکارهای ایرانی
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              در آنکو دیزاین، ما یک تیم <strong className="text-gray-900">۷ نفره</strong> از متخصصان حوزهٔ فناوری و دیجیتال
              هستیم. <strong className="text-gray-900">هدف اصلی ما</strong> یاری رساندن به کسب‌وکارهای ایرانی است تا
              با ابزار مناسب وب، سئو، فروش آنلاین و محتوا، دیده شوند و رشد پایدار داشته باشند.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors w-full sm:w-auto justify-center"
              >
                تماس با ما
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-brand/40 hover:text-brand transition-colors"
              >
                نمونه کارها
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/10 text-brand mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">دید کلی: چه می‌کنیم؟</h2>
            <p className="text-gray-600 leading-relaxed">
              از ایده و استراتژی تا اجرا و پشتیبانی — تمرکز ما روی نتیجۀ قابل اندازه‌گیری و همکاری شفاف با صاحبان کسب‌وکار
              در سراسر ایران است.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {WHAT_WE_DO.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.title}
                  className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-brand/20 hover:shadow-md transition-all"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <TestimonialsSection />

        <section className="bg-gray-50 border-y border-gray-100 py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 text-brand font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              مأموریت ما
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">کمک به کسب‌وکارهای ایرانی</p>
            <p className="text-gray-600 leading-relaxed">
              هر پروژه را با دقت اجرا می‌کنیم چون به رشد شما وابسته‌ایم. اگر به دنبال تیمی هستید که هم تخصص فنی دارد و هم
              زبان کسب‌وکار شما را می‌فهمد؛ از صفحهٔ تماس با ما یا تماس تلفنی با ما در ارتباط باشید.
            </p>
            <div className="mt-8">
              <Link
                href="/portfolio"
                className="text-brand font-semibold hover:underline"
              >
                ببینید چه نوع پروژه‌هایی انجام می‌دهیم — نمونه کارها
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
