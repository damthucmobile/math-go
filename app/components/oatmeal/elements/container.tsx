import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

/**
 * Max-width wrapper for page content. Use inside Section for consistent layout.
 * @example
 * <Section><Container className="flex flex-col gap-10">...</Container></Section>
 */
export function Container({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={clsx('mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10', className)} {...props}>
      {children}
    </div>
  )
}
