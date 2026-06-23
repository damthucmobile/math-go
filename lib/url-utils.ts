/**
 * Safe URL handling to prevent javascript:, data:, vbscript: and other dangerous schemes.
 * Use for any user- or admin-editable href or iframe src.
 */

const SAFE_HREF_PREFIXES = ['/', '#', 'http://', 'https://']

function trimLower(s: string): string {
  return String(s).trim().toLowerCase()
}

/** Returns true if url is safe for use in href or iframe src (relative path, hash, or http/https). */
export function isSafeHref(url: string | null | undefined): boolean {
  if (url == null || typeof url !== 'string') return false
  const u = trimLower(url)
  if (u === '') return false
  return SAFE_HREF_PREFIXES.some((p) => u === p || (p !== '#' && u.startsWith(p)))
}

/**
 * Returns url if safe, otherwise '#' so links never point to javascript: or data:.
 * Use for <a href={...}> and similar.
 */
export function getSafeHref(url: string | null | undefined): string {
  if (url == null || typeof url !== 'string') return '#'
  const u = url.trim()
  if (u === '' || u === '#') return u || '#'
  const lower = u.toLowerCase()
  if (lower.startsWith('https://') || lower.startsWith('http://') || lower.startsWith('/')) return u
  if (lower.startsWith('#')) return u
  return '#'
}

/**
 * Returns url if safe for img src (https or relative /). Otherwise empty string (omit src).
 */
export function getSafeImageSrc(url: string | null | undefined): string {
  if (url == null || typeof url !== 'string') return ''
  const u = url.trim()
  if (u === '') return ''
  const lower = u.toLowerCase()
  if (lower.startsWith('https://') || lower.startsWith('/')) return u
  return ''
}
