import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PortalShell, type PortalNavItem } from '@/components/layout/PortalShell'

const navItems: PortalNavItem[] = [
  { href: '/student', label: 'داشبورد', icon: '⊞' },
  { href: '/student/course', label: 'دوره من', icon: '📚' },
  { href: '/student/calendar', label: 'تقویم', icon: '📅' },
  { href: '/student/payment', label: 'پرداخت', icon: '💳' },
  { href: '/student/certificate', label: 'گواهی', icon: '🎖' },
]

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isStudentShell = session?.user?.role === 'student'

  if (!isStudentShell) {
    return <>{children}</>
  }

  return (
    <PortalShell
      navItems={navItems}
      panelTitle="پنل دانشجو"
      panelSubtitle="آنکو دیزاین"
      headerTitle="پنل دانشجو"
      userLabel={session.user?.phone ?? session.user?.name}
      signOutHref="/api/auth/signout?callbackUrl=/student/login"
      signOutLabel="خروج"
      footerLinks={[{ href: '/', label: '← سایت' }]}
    >
      {children}
    </PortalShell>
  )
}
