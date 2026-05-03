import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

function unauthorizedJson() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (pathname.startsWith('/api/admin')) {
    if (!token || token.role !== 'admin') {
      return unauthorizedJson()
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/customer')) {
    if (pathname === '/api/customer/register') {
      return NextResponse.next()
    }
    if (!token || token.role !== 'customer') {
      return unauthorizedJson()
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (token?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
    }
    if (!token || token.role !== 'admin') {
      const login = new URL('/admin/login', req.url)
      login.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(login)
    }
    if (token.role === 'customer') {
      return NextResponse.redirect(new URL('/customer', req.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/customer')) {
    if (pathname === '/customer/login' || pathname === '/customer/register') {
      if (token?.role === 'customer') {
        return NextResponse.redirect(new URL('/customer', req.url))
      }
      return NextResponse.next()
    }
    if (!token || token.role !== 'customer') {
      const login = new URL('/customer/login', req.url)
      login.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(login)
    }
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/customer/:path*', '/api/admin/:path*', '/api/customer/:path*'],
}
