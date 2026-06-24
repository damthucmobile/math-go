/**
 * Edge-compatible auth helpers (no Node crypto). Use in middleware.
 */
import * as jose from 'jose'

const SESSION_COOKIE = 'admin_session'
const DEFAULT_API_SECRET = 'dev-api-secret'

function getSecret(): string {
  const secret = process.env.API_SECRET || process.env.SESSION_SECRET
  if (secret) return secret
  return process.env.NODE_ENV === 'production' ? '' : DEFAULT_API_SECRET
}

export async function verifySessionToken(token: string): Promise<{ username: string } | null> {
  const secret = getSecret()
  if (!secret) return null
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jose.jwtVerify(token, key)
    const username = payload.username as string
    return username ? { username } : null
  } catch {
    return null
  }
}

export async function getSessionFromCookie(cookieHeader: string | null): Promise<{ username: string } | null> {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const value = match?.[1]
  if (!value) return null
  return verifySessionToken(decodeURIComponent(value))
}
