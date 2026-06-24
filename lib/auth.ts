import { createHmac, timingSafeEqual } from 'crypto'
import * as jose from 'jose'

const SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours
const DEFAULT_API_SECRET = 'dev-api-secret'
const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_PASSWORD = 'password'

function getSecret(): string {
  const secret = process.env.API_SECRET || process.env.SESSION_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('API_SECRET is not set')
  }
  return DEFAULT_API_SECRET
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = new TextEncoder().encode(getSecret())
  return new jose.SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(SESSION_MAX_AGE + 's')
    .sign(secret)
}

export { SESSION_COOKIE }

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
  if (username !== expectedUser || password.length === 0) return false
  const secret = getSecret()
  const a = createHmac('sha256', secret).update(password).digest()
  const b = createHmac('sha256', secret).update(expectedPass).digest()
  return a.length === b.length && timingSafeEqual(a, b)
}
