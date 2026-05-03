import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BrandMark } from '@/components/BrandMark'

const navItems = [
  { href: '/customer', label: 'داشبورد', icon: '⊞' },
  { href: '/customer/plans', label: 'خرید پلن', icon: '💳' },
  { href: '/customer/orders', label: 'سفارش‌ها', icon: '📦' },
  { href: '/customer/tickets', label: 'تیکت پشتیبانی', icon: '✉️' },
]

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isCustomerShell = session?.user?.role === 'customer'

  if (!isCustomerShell) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-56 bg-white border-s border-gray-200 flex flex-col fixed inset-y-0 start-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" />
            <div>
              <div className="font-bold text-gray-900 text-sm">پنل مشتری</div>
              <div className="text-xs text-gray-500">آنکو دیزاین</div>
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
        <div className="p-3 border-t border-gray-200 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-brand hover:bg-gray-50"
          >
            ← سایت
          </Link>
          <Link
            href="/api/auth/signout?callbackUrl=/customer/login"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 w-full"
          >
            خروج
          </Link>
        </div>
      </aside>
      <div className="flex-1 ms-56">
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-semibold text-gray-800 text-sm">حساب کاربری</h1>
          <span className="text-xs text-gray-400 truncate max-w-[200px]">{session.user?.email}</span>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
