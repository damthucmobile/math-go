'use client'

import Link from 'next/link'
import { ExternalLink, LayoutGrid } from 'lucide-react'
import { getAdminPath } from '@/lib/admin-utils'

interface AdminTopBarProps {
  /** Optional: show "View site" as primary action (default true) */
  showViewSite?: boolean
  /** Optional: save status for edit screens - not used in Phase 1 but wired for Phase 2 */
  saveStatus?: 'saved' | 'saving' | 'unsaved'
}

export function AdminTopBar({ showViewSite = true, saveStatus }: AdminTopBarProps) {
  const adminPath = getAdminPath()

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-mist-800/50 bg-mist-950 px-4 shadow-lg sm:px-6"
      role="banner"
    >
      <div className="flex items-center gap-4">
        <Link
          href={adminPath}
          className="flex items-center gap-2.5 rounded-lg py-1.5 pr-2 text-mist-100 transition hover:bg-mist-800 hover:text-white"
          aria-label="Dashboard"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            <LayoutGrid className="h-4 w-4 text-mist-200" />
          </span>
          <span className="hidden text-sm font-semibold tracking-normal sm:inline">
            Site Admin
          </span>
        </Link>
        {saveStatus === 'saving' && (
          <span className="rounded-full bg-mist-600/40 px-2.5 py-0.5 text-xs font-medium text-mist-200">
            Saving…
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="rounded-full bg-mist-500/30 px-2.5 py-0.5 text-xs font-medium text-mist-100">
            Saved
          </span>
        )}
        {saveStatus === 'unsaved' && (
          <span className="rounded-full bg-mist-600 px-2.5 py-0.5 text-xs font-medium text-mist-200">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showViewSite && (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-mist-600 bg-mist-800/50 px-3 py-1.5 text-sm font-medium text-mist-200 transition hover:border-mist-500 hover:bg-mist-700 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            View site
          </a>
        )}
      </div>
    </header>
  )
}
