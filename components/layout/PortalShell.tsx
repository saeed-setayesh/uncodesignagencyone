'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'

export type PortalNavItem = {
  href: string
  label: string
  icon: string
}

type PortalShellProps = {
  navItems: PortalNavItem[]
  panelTitle: string
  panelSubtitle: string
  headerTitle: string
  userLabel?: string | null
  headerExtra?: React.ReactNode
  signOutHref: string
  signOutLabel?: string
  footerLinks?: { href: string; label: string }[]
  children: React.ReactNode
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block w-5 h-4" aria-hidden>
      <span
        className={`absolute start-0 h-0.5 w-5 bg-gray-700 transition-all ${
          open ? 'top-1.5 rotate-45' : 'top-0'
        }`}
      />
      <span
        className={`absolute start-0 top-1.5 h-0.5 w-5 bg-gray-700 transition-opacity ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute start-0 h-0.5 w-5 bg-gray-700 transition-all ${
          open ? 'top-1.5 -rotate-45' : 'top-3'
        }`}
      />
    </span>
  )
}

export function PortalShell({
  navItems,
  panelTitle,
  panelSubtitle,
  headerTitle,
  userLabel,
  headerExtra,
  signOutHref,
  signOutLabel = 'خروج از حساب',
  footerLinks = [],
  children,
}: PortalShellProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeMenu])

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="بستن منو"
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 start-0 z-40 flex w-[min(17rem,88vw)] flex-col border-s border-gray-200 bg-white shadow-xl transition-transform duration-200 ease-out md:pointer-events-auto md:w-56 md:translate-x-0 md:shadow-none ${
          menuOpen
            ? 'translate-x-0 pointer-events-auto'
            : 'translate-x-full pointer-events-none md:pointer-events-auto'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-4">
          <div className="flex min-w-0 items-center gap-2">
            <BrandLogo size="sm" showWordmark={false} />
            <div className="min-w-0">
              <div className="truncate font-bold text-gray-900 text-sm">{panelTitle}</div>
              <div className="truncate text-xs text-gray-500">{panelSubtitle}</div>
            </div>
          </div>
          <button
            type="button"
            className="md:hidden shrink-0 rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="بستن منو"
            onClick={closeMenu}
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 overscroll-contain">
          {navItems.map((item) => {
            const active =
              item.href === '/admin' || item.href === '/student'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-brand/10 text-brand font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-brand'
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-3 space-y-1">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-brand w-full"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={signOutHref}
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <span aria-hidden>↩</span>
            {signOutLabel}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen min-w-0 flex-col md:ms-56">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="md:hidden shrink-0 rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="باز کردن منو"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon open={menuOpen} />
          </button>

          <h1 className="min-w-0 flex-1 truncate font-semibold text-gray-800 text-sm">{headerTitle}</h1>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {userLabel ? (
              <span className="hidden max-w-[120px] truncate text-xs text-gray-400 sm:inline md:max-w-[200px]" dir="ltr">
                {userLabel}
              </span>
            ) : null}
            {headerExtra}
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
