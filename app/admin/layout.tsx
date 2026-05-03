import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BrandMark } from '@/components/BrandMark'

const navItems = [
  { href: '/admin', label: 'داشبورد', icon: '⊞' },
  { href: '/admin/customers', label: 'مشتریان', icon: '👤' },
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
  { href: '/admin/settings', label: 'تنظیمات تماس', icon: '⚙️' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Login page: no sidebar, just render children
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar — fixed on the RIGHT for RTL */}
      <aside className="w-56 bg-white border-s border-gray-200 flex flex-col fixed inset-y-0 start-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
            <div>
              <div className="font-bold text-gray-900 text-sm">آنکو دیزاین</div>
              <div className="text-xs text-gray-500">پنل مدیریت</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-brand transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <span>↩</span>
            خروج از حساب
          </Link>
        </div>
      </aside>

      {/* Main content — offset from the right sidebar */}
      <div className="flex-1 ms-56">
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-semibold text-gray-800 text-sm">پنل مدیریت آنکو دیزاین</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{session.user?.email}</span>
            <Link
              href="/"
              target="_blank"
              className="text-xs text-gray-500 hover:text-brand transition-colors"
            >
              مشاهده سایت ←
            </Link>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
