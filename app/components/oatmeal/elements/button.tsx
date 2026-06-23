import Link from 'next/link'
import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

const sizes = {
  md: 'px-3 py-1',
  lg: 'px-4 py-2',
}

/**
 * Primary CTA link for public pages. Uses design token --radius-button.
 * @example
 * <ButtonLink href="/signup" size="lg" color="dark/light">Get started</ButtonLink>
 */
export function ButtonLink({
  size = 'md',
  color = 'dark/light',
  className,
  href,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-1 rounded-[var(--radius-button)] text-sm/7 font-medium',
        color === 'dark/light' &&
          'bg-mist-950 text-white hover:bg-mist-800 dark:bg-mist-300 dark:text-mist-950 dark:hover:bg-mist-200',
        color === 'light' && 'bg-white text-mist-950 hover:bg-mist-100 dark:bg-mist-100 dark:hover:bg-white',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

/**
 * Secondary link (outline/ghost style) for public pages. Uses design token --radius-button.
 * @example
 * <PlainButtonLink href="/about" color="dark/light">Learn more</PlainButtonLink>
 */
export function PlainButtonLink({
  size = 'md',
  color = 'dark/light',
  href,
  className,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: 'dark/light' | 'light'
} & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] text-sm/7 font-medium',
        color === 'dark/light' && 'text-mist-950 hover:bg-mist-950/10 dark:text-white dark:hover:bg-white/10',
        color === 'light' && 'text-white hover:bg-white/15 dark:hover:bg-white/10',
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
