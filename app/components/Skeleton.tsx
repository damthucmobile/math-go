/**
 * Reusable skeleton placeholders for consistent loading states in admin and site.
 */

import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={clsx('animate-pulse rounded-lg bg-mist-200 dark:bg-mist-800', className)}
      aria-hidden
      {...props}
    />
  )
}

/** Card-style skeleton: title bar + 2–3 lines. */
export function SkeletonCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={clsx('rounded-xl border border-mist-200 dark:border-mist-700 p-6', className)}>
      <Skeleton className="mb-4 h-5 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={i < lines - 1 ? 'mb-2 h-4 w-full' : 'h-4 w-2/3'} />
      ))}
    </div>
  )
}

/** List-style skeleton: repeated rows. */
export function SkeletonList({
  className,
  rows = 5,
  showHeader = true
}: { className?: string; rows?: number; showHeader?: boolean }) {
  return (
    <div className={clsx('rounded-xl border border-mist-200 dark:border-mist-700 overflow-hidden', className)}>
      {showHeader && (
        <div className="flex gap-4 border-b border-mist-200 dark:border-mist-700 bg-mist-50 dark:bg-mist-900/30 px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center px-4 py-3 border-b border-mist-100 dark:border-mist-800 last:border-0">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 flex-1 max-w-xs" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  )
}
