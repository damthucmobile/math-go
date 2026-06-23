import { NextResponse } from 'next/server'
import {
  verifyAdminCredentials,
  createSessionToken,
  SESSION_COOKIE
} from '@/lib/auth'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry) return false
  if (now >= entry.resetAt) {
    loginAttempts.delete(ip)
    return false
  }
  return entry.count >= RATE_LIMIT_MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now >= entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return
  }
  entry.count += 1
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }
  try {
    const body = await req.json()
    const { username, password } = body
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }
    if (!verifyAdminCredentials(username, password)) {
      recordFailedAttempt(ip)
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    clearAttempts(ip)
    const token = await createSessionToken(username)
    const res = NextResponse.json({ success: true })
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookies.set(SESSION_COOKIE, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 60 * 60 * 24
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
