/**
 * Shared admin URL helpers and form/button styles for consistent, accessible UI.
 *
 * API_SECRET (Bearer token): Use only for server-to-server or script access.
 * Do not use API_SECRET from the browser or expose it in client bundles.
 */

/** Base URL for API requests ('' = same-origin). Use for admin fetch URLs. */
export function getApiBase(): string {
  return typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : ''
}

/** @deprecated Use getApiBase() for clarity. Same behavior. */
export function getApiUrl(): string {
  return getApiBase()
}

export function getAdminPath(): string {
  return typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_PATH
    ? process.env.NEXT_PUBLIC_ADMIN_PATH
    : '/admin'
}

export const inputClasses =
  'w-full rounded-xl border border-mist-200 bg-mist-50/50 px-4 py-2.5 text-mist-950 transition dark:border-mist-700 dark:bg-mist-900/30 dark:text-white focus:border-mist-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mist-500/20 dark:focus:bg-mist-900/50 dark:focus:border-mist-500'
export const labelClasses = 'mb-1.5 block text-sm font-medium text-mist-700 dark:text-mist-300'
export const btnPrimary =
  'inline-flex items-center rounded-[var(--radius-button-admin)] bg-mist-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-mist-900 focus:outline-none focus:ring-2 focus:ring-mist-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-mist-700 dark:hover:bg-mist-600'
export const btnSecondary =
  'inline-flex items-center rounded-[var(--radius-button-admin)] border border-mist-200 bg-white px-4 py-2.5 text-sm font-medium text-mist-700 transition hover:bg-mist-100 focus:outline-none focus:ring-2 focus:ring-mist-500 focus:ring-offset-2 dark:border-mist-700 dark:bg-mist-900/30 dark:text-mist-300 dark:hover:bg-mist-800/50'
export const btnDanger =
  'inline-flex items-center rounded-[var(--radius-button-admin)] border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-800 dark:bg-mist-900/30 dark:hover:bg-red-950/30'
export const linkMuted = 'text-mist-500 transition hover:text-mist-950 dark:text-mist-400 dark:hover:text-white'
