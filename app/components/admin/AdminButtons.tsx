/**
 * Shared admin button primitives that consume btnPrimary / btnSecondary from admin-utils.
 * Use in admin pages and in error/not-found for consistent radius and focus styles.
 */

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { btnPrimary, btnSecondary } from '@/lib/admin-utils'
import { clsx } from 'clsx'

export function AdminButton({
  className,
  variant = 'primary',
  ...props
}: ComponentProps<'button'> & { variant?: 'primary' | 'secondary' }) {
  const base = variant === 'primary' ? btnPrimary : btnSecondary
  return <button type="button" className={clsx(base, className)} {...props} />
}

export function AdminButtonLink({
  href,
  className,
  variant = 'primary',
  ...props
}: ComponentProps<typeof Link> & { variant?: 'primary' | 'secondary' }) {
  const base = variant === 'primary' ? btnPrimary : btnSecondary
  return <Link href={href} className={clsx(base, className)} {...props} />
}
