'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, MessageCircle, ChevronDown, Menu, X } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'

type ServiceItem = { slug: string; fa: string }

interface Props {
  services: ServiceItem[]
  /** موقعیت‌های شغلی فعال — لینک در هدر */
  jobs: ServiceItem[]
  phone: string
}

export default function NavbarClient({ services, jobs, phone }: Props) {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(true)
  const [jobsOpen, setJobsOpen] = useState(true)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0" onClick={() => setOpen(false)}>
          <BrandMark size="md" />
          <span className="font-bold text-gray-900 text-lg hidden sm:inline truncate">آنکو دیزاین</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm text-gray-600">
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
              aria-expanded="false"
              aria-haspopup="true"
            >
              خدمات
              <ChevronDown className="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform" />
            </button>
            <div
              className="absolute end-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[280px]"
              role="menu"
            >
              <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2 max-h-[70vh] overflow-y-auto">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-brand/5 hover:text-brand transition-colors"
                    role="menuitem"
                  >
                    {s.fa}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {jobs.length > 0 && (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
                aria-haspopup="true"
              >
                شغل‌ها
                <ChevronDown className="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute end-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[240px]">
                <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2 max-h-[50vh] overflow-y-auto" role="menu">
                  <Link
                    href="/careers"
                    className="block px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5"
                    role="menuitem"
                  >
                    همه موقعیت‌ها
                  </Link>
                  {jobs.map((j) => (
                    <Link
                      key={j.slug}
                      href={`/${j.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand/5 hover:text-brand"
                      role="menuitem"
                    >
                      {j.fa}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Link
            href="/portfolio"
            className="px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
          >
            نمونه کارها
          </Link>
          <Link
            href="/team"
            className="px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
          >
            تیم ما
          </Link>
          <Link
            href="/blog"
            className="px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
          >
            وبلاگ
          </Link>
          <Link
            href="/customer/login"
            className="px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
          >
            ورود مشتریان
          </Link>
          <Link
            href="/contact"
            className="px-2 py-1.5 rounded-lg hover:text-brand hover:bg-gray-50 transition-colors"
          >
            تماس با ما
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <a
            href={`tel:${phone}`}
            className="hidden lg:inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand transition-colors"
            dir="ltr"
          >
            <Phone className="w-4 h-4 shrink-0" aria-hidden />
            {phone}
          </a>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 bg-brand text-white text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
            <span className="whitespace-nowrap">مشاوره رایگان</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-xl text-gray-800 hover:bg-gray-100 -me-1 border border-gray-200"
            aria-label={open ? 'بستن فهرست' : 'باز کردن فهرست'}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" id="mobile-nav-menu" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="بستن منو"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute end-0 top-0 h-full w-[min(100%,20rem)] bg-white shadow-2xl flex flex-col border-s border-gray-100"
            dir="rtl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">فهرست</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 py-3 px-2">
              <div className="border-b border-gray-100 pb-2 mb-2">
                <button
                  type="button"
                  onClick={() => setServicesOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50"
                  aria-expanded={servicesOpen}
                >
                  خدمات
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {servicesOpen && (
                  <div className="pe-1 ps-1 pb-1">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/${s.slug}`}
                        className="block py-2.5 px-3 text-sm text-gray-600 rounded-lg hover:bg-brand/5 hover:text-brand"
                        onClick={() => setOpen(false)}
                      >
                        {s.fa}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {jobs.length > 0 && (
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setJobsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-3 text-gray-900 font-medium rounded-lg hover:bg-gray-50"
                    aria-expanded={jobsOpen}
                  >
                    شغل‌ها
                    <ChevronDown className={`w-4 h-4 transition-transform ${jobsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {jobsOpen && (
                    <div className="pe-1 ps-1 pb-1">
                      <Link
                        href="/careers"
                        className="block py-2.5 px-3 text-sm font-semibold text-brand rounded-lg hover:bg-brand/5"
                        onClick={() => setOpen(false)}
                      >
                        همه موقعیت‌ها
                      </Link>
                      {jobs.map((j) => (
                        <Link
                          key={j.slug}
                          href={`/${j.slug}`}
                          className="block py-2.5 px-3 text-sm text-gray-600 rounded-lg hover:bg-brand/5 hover:text-brand"
                          onClick={() => setOpen(false)}
                        >
                          {j.fa}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {[
                { href: '/portfolio', label: 'نمونه کارها' },
                { href: '/team', label: 'تیم ما' },
                { href: '/blog', label: 'وبلاگ' },
                { href: '/customer/login', label: 'ورود مشتریان' },
                { href: '/contact', label: 'تماس با ما' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 py-3 px-3 text-brand font-medium rounded-lg hover:bg-brand/5 mt-2"
                dir="ltr"
                onClick={() => setOpen(false)}
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>
            <div className="p-3 border-t border-gray-100">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="w-4 h-4" />
                مشاوره رایگان
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
