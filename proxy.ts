import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth-edge'

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin'
const ADMIN_LOGIN = `${ADMIN_PATH}/login`

export async function proxy(req: NextRequest) {
  const session = await getSessionFromCookie(req.headers.get('cookie'))

  // Protect admin routes (except login)
  if (req.nextUrl.pathname.startsWith(ADMIN_PATH)) {
    if (req.nextUrl.pathname === ADMIN_LOGIN) {
      if (session) {
        return NextResponse.redirect(new URL(ADMIN_PATH, req.url))
      }
      return NextResponse.next()
    }
    if (!session) {
      const loginUrl = new URL(ADMIN_LOGIN, req.url)
      loginUrl.searchParams.set('from', req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Protect API mutating routes (POST, PUT, PATCH, DELETE)
  const isMediaMutate = req.nextUrl.pathname === '/api/media' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
  const isSettingsMutate = req.nextUrl.pathname === '/api/settings' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
  const isCmsMutate =
    req.nextUrl.pathname.startsWith('/api/cms/') &&
    req.nextUrl.pathname !== '/api/cms/config' &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
  if (isMediaMutate || isSettingsMutate || isCmsMutate) {
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    const validApiSecret = process.env.API_SECRET && bearerToken === process.env.API_SECRET
    if (!session && !validApiSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/media', '/api/settings', '/api/cms/:path*']
}
