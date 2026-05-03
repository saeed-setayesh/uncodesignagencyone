import type { ReactNode } from 'react'
import { Phone, MessageCircle, Send, MapPin, Clock, Mail } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from '@/components/page-sections/TestimonialsSection'
import ContactForm from './_components/ContactForm'
import { getContactSettings } from '@/lib/settings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تماس با ما — آنکو دیزاین',
  description: 'برای مشاوره رایگان با ما تماس بگیرید. تلفن مستقیم، واتس‌اپ، تلگرام، بله، روبیکا و ایتا.',
}

export const revalidate = 300

type Messenger = {
  name: string
  href: string
  bg: string
  icon: ReactNode
}

/** فقط پیام‌رسان‌هایی که در تنظیمات مقدار دارند (بدون کارت خالی) */
function getMessengers(s: Awaited<ReturnType<typeof getContactSettings>>): Messenger[] {
  const out: Messenger[] = []
  const waDigits = (s.whatsapp || '').replace(/\D/g, '')
  if (waDigits.length >= 8) {
    out.push({
      name: 'واتس‌اپ',
      href: `https://wa.me/${waDigits}?text=سلام،+می‌خوام+مشاوره+رایگان+بگیرم`,
      bg: 'bg-[#25D366]',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      ),
    })
  }
  if (s.telegram?.trim()) {
    out.push({
      name: 'تلگرام',
      href: s.telegram.trim(),
      bg: 'bg-[#229ED9]',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    })
  }
  if (s.bale?.trim()) {
    out.push({
      name: 'بله',
      href: s.bale.trim(),
      bg: 'bg-[#1C6ECD]',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.535l-2.95-.924c-.641-.201-.654-.641.136-.953l11.57-4.461c.537-.194 1.006.131.326.951z" />
        </svg>
      ),
    })
  }
  if (s.rubika?.trim()) {
    out.push({
      name: 'روبیکا',
      href: s.rubika.trim(),
      bg: 'bg-[#FF5722]',
      icon: <MessageCircle className="w-6 h-6" />,
    })
  }
  if (s.eita?.trim()) {
    out.push({
      name: 'ایتا',
      href: s.eita.trim(),
      bg: 'bg-[#2CA890]',
      icon: <Send className="w-6 h-6" />,
    })
  }
  return out
}

export default async function ContactPage() {
  const s = await getContactSettings()
  const messengers = getMessengers(s)

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <section className="bg-gradient-to-bl from-brand-dark via-brand to-brand-dark py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">تماس با ما</h1>
            <p className="text-brand-light/95 text-lg">آماده پاسخگویی هستیم — سریع‌ترین راه تماس مستقیم است</p>
          </div>
        </section>

        {/* ── Primary: Direct call ── */}
        <section className="py-14 bg-white">
          <div className="max-w-xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand/10 rounded-full mb-6">
              <Phone className="w-10 h-10 text-brand" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">تماس مستقیم</h2>
            <p className="text-gray-500 mb-6">سریع‌ترین راه — همین الان زنگ بزنید</p>
            <a
              href={`tel:${s.phone}`}
              className="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white text-2xl font-extrabold px-10 py-5 rounded-2xl transition-colors shadow-lg shadow-brand/30 active:scale-95"
            >
              <Phone className="w-7 h-7" />
              {s.phone}
            </a>
            {s.hours && (
              <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {s.hours}
              </div>
            )}
          </div>
        </section>

        {/* ── Messengers (فقط اگر حداقل یک مقدار در تنظیمات باشد) ── */}
        {messengers.length > 0 && (
          <section className="py-14 bg-gray-50">
            <div className="max-w-2xl mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">پیام بدهید</h2>
                <p className="text-gray-500">در هر پیام‌رسانی که راحت‌ترید — ما آنجا هستیم</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {messengers.map((m) => (
                  <a
                    key={m.name}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 ${m.bg} text-white px-6 py-4 rounded-2xl font-semibold text-lg hover:opacity-90 active:scale-95 transition-all shadow-sm`}
                  >
                    {m.icon}
                    <span>ارسال پیام در {m.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Info strip ── */}
        {s.address && (
          <section className="py-8 bg-white border-y border-gray-100">
            <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row gap-6 items-center justify-center text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
                {s.address}
              </div>
              {s.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand flex-shrink-0" />
                  {s.hours}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Form (secondary) ── */}
        <section className="py-14 bg-gray-50">
          <div className="max-w-xl mx-auto px-4">
            <div className="text-center mb-8">
              <Mail className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">فرم تماس</h2>
              <p className="text-gray-400 text-sm">اگر ترجیح می‌دهید پیامتان را بنویسید — پاسخ می‌دهیم</p>
            </div>
            <ContactForm />
          </div>
        </section>

        <TestimonialsSection />

      </main>
      <Footer />
    </>
  )
}
