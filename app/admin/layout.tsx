import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortalShell, type PortalNavItem } from '@/components/layout/PortalShell'

const navItems: PortalNavItem[] = [
  { href: '/admin', label: 'داشبورد', icon: '⊞' },
  { href: '/admin/customers', label: 'مشتریان', icon: '👤' },
  { href: '/admin/students', label: 'دانشجویان', icon: '🎓' },
  { href: '/admin/revenue', label: 'درآمد و تراکنش‌ها', icon: '💰' },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: '🧾' },
  { href: '/admin/support-tickets', label: 'تیکت پشتیبانی', icon: '🎫' },
  { href: '/admin/messages', label: 'پیام‌های تماس', icon: '✉️' },
  { href: '/admin/services', label: 'سرویس‌ها', icon: '🧩' },
  { href: '/admin/jobs', label: 'فرصت‌های شغلی', icon: '💼' },
  { href: '/admin/neighborhoods', label: 'محله‌ها', icon: '📍' },
  { href: '/admin/cities', label: 'شهرها', icon: '🏙' },
  { href: '/admin/industries', label: 'صنف‌ها', icon: '🏢' },
  { href: '/admin/pages', label: 'صفحات', icon: '📄' },
  { href: '/admin/blog', label: 'وبلاگ', icon: '📝' },
  { href: '/admin/settings', label: 'تنظیمات تماس و شبکه‌ها', icon: '⚙️' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  return (
    <PortalShell
      navItems={navItems}
      panelTitle="آنکو دیزاین"
      panelSubtitle="پنل مدیریت"
      headerTitle="پنل مدیریت آنکو دیزاین"
      userLabel={session.user?.email}
      signOutHref="/api/auth/signout"
      headerExtra={
        <Link
          href="/"
          target="_blank"
          className="text-xs text-gray-500 hover:text-brand transition-colors whitespace-nowrap"
        >
          <span className="hidden sm:inline">مشاهده سایت </span>←
        </Link>
      }
    >
      {children}
    </PortalShell>
  )
}
