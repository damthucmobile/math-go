import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

/**
 * Main content landmark. Use as the primary container for page content (e.g. in site layout).
 * @example
 * <Main id="main" className="flex-1">{children}</Main>
 */
export function Main({ children, className, ...props }: ComponentProps<'main'>) {
  return (
    <main className={clsx('isolate overflow-clip', className)} {...props}>
      {children}
    </main>
  )
}
