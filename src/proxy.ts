import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/', req.nextUrl))
    if ((req.auth?.user as any)?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  const isAuthPage = req.nextUrl.pathname === '/'
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
