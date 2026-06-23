/**
 * Renders an image from a CMS-driven or external URL using getSafeImageSrc.
 * Use for user uploads and unknown origins so you don't need to configure remote
 * domains in next.config. For static or known-origin assets (e.g. logo, CDN),
 * use next/image with sizes and priority instead.
 */

import type { ComponentProps } from 'react'
import { getSafeImageSrc } from '@/lib/url-utils'
import { clsx } from 'clsx'

export interface SafeImageProps extends Omit<ComponentProps<'img'>, 'src' | 'alt'> {
  src: string | null | undefined
  alt: string
}

export function SafeImage({ src, alt, className, ...props }: SafeImageProps) {
  const safeSrc = getSafeImageSrc(src)
  if (!safeSrc) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={safeSrc} alt={alt} className={clsx(className)} {...props} />
  )
}
