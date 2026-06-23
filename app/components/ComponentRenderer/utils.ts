import { getSafeHref, getSafeImageSrc } from '@/lib/url-utils'

export { getSafeHref, getSafeImageSrc }

export function isInternalUrl(href: string): boolean {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
}
