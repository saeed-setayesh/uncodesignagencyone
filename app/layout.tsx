import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const vazir = localFont({
  src: [
    { path: '../public/fonts/Vazirmatn-Regular.woff2',   weight: '400', style: 'normal' },
    { path: '../public/fonts/Vazirmatn-Medium.woff2',    weight: '500', style: 'normal' },
    { path: '../public/fonts/Vazirmatn-SemiBold.woff2',  weight: '600', style: 'normal' },
    { path: '../public/fonts/Vazirmatn-Bold.woff2',      weight: '700', style: 'normal' },
    { path: '../public/fonts/Vazirmatn-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-vazir',
  display: 'swap',
})

export const metadata: Metadata = {
  applicationName: 'uncodesign',
  title: {
    default: 'طراحی سایت حرفه‌ای در ایران — آنکو دیزاین',
    template: '%s | آنکو دیزاین',
  },
  description:
    'طراحی سایت حرفه‌ای برای کسب‌وکارهای ایرانی. تحویل ۱۴ روزه، پشتیبانی ۶ ماهه رایگان.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.ir'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body className="font-vazir antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
