import Link from 'next/link'
import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

/**
 * Inline text link for public pages. Use for in-content links (e.g. "Learn more").
 * @example
 * <LinkEl href="/docs">Documentation</LinkEl>
 */
export function LinkEl({
  href,
  className,
  ...props
}: {
  href: string
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx('inline-flex items-center gap-2 text-sm/7 font-medium text-mist-950 dark:text-white', className)}
      {...props}
    />
  )
}
