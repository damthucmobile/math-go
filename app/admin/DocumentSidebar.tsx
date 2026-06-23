'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  Trash2,
  Loader2,
  Eye,
  Image as ImageIcon,
  Globe,
  FileEdit
} from 'lucide-react'
import { MediaPickerModal } from './MediaPickerModal'

export type DocumentStatus = 'draft' | 'published'
export type FeaturedImageValue = { url: string; alt?: string } | null

interface DocumentSidebarProps {
  /** Primary submit label */
  submitLabel: string
  onSubmit: () => void
  saving: boolean
  isNew?: boolean
  onDelete?: () => void
  /** Visibility / status */
  status: DocumentStatus
  onStatusChange: (status: DocumentStatus) => void
  /** Permalink (slug) - only show if table has slug */
  slug?: string
  onSlugChange?: (slug: string) => void
  slugLabel?: string
  /** Featured image */
  featuredImage: FeaturedImageValue
  onFeaturedImageChange: (value: FeaturedImageValue) => void
  /** Optional: link to view on front (e.g. /pages/[slug]) */
  viewUrl?: string
}

export function DocumentSidebar({
  submitLabel,
  onSubmit,
  saving,
  isNew,
  onDelete,
  status,
  onStatusChange,
  slug,
  onSlugChange,
  slugLabel = 'Permalink',
  featuredImage,
  onFeaturedImageChange,
  viewUrl
}: DocumentSidebarProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  return (
    <>
      <aside
        className="w-full shrink-0 lg:w-80"
        aria-label="Document settings"
      >
        <div className="sticky top-24 space-y-6 rounded-2xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-900/30">
          {/* Publish / Update */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
              {isNew ? 'Publish' : 'Update'}
            </h3>
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-mist-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-mist-800 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {submitLabel}
            </button>
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>

          {/* Visibility */}
          <div className="space-y-3 border-t border-mist-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
              Visibility
            </h3>
            <div className="flex rounded-xl border border-mist-200 bg-mist-50/50 dark:bg-mist-800/30 p-1">
              <button
                type="button"
                onClick={() => onStatusChange('draft')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
                  status === 'draft'
                    ? 'bg-white text-mist-950 shadow-sm dark:bg-mist-800 dark:text-white'
                    : 'text-mist-600 hover:text-mist-950 dark:text-mist-400 dark:hover:text-white'
                }`}
              >
                <FileEdit className="h-3.5 w-3.5" />
                Draft
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('published')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
                  status === 'published'
                    ? 'bg-white text-mist-950 shadow-sm dark:bg-mist-800 dark:text-white'
                    : 'text-mist-600 hover:text-mist-950 dark:text-mist-400 dark:hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                Published
              </button>
            </div>
          </div>

          {/* Permalink */}
          {onSlugChange != null && (
            <div className="space-y-3 border-t border-mist-100 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
                {slugLabel}
              </h3>
              <div className="rounded-xl border border-mist-200 bg-mist-50/30 dark:bg-mist-800/30 px-3 py-2.5">
                <input
                  type="text"
                  value={slug ?? ''}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="e.g. about-us"
                  className="w-full bg-transparent text-sm text-mist-950 dark:text-white placeholder:text-mist-500 focus:outline-none"
                  aria-label={slugLabel}
                />
              </div>
              {viewUrl && status === 'published' && slug && (
                <Link
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-mist-700 hover:text-mist-800 dark:text-mist-300 dark:hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View page
                </Link>
              )}
            </div>
          )}

          {/* Featured image */}
          <div className="space-y-3 border-t border-mist-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
              Featured image
            </h3>
            {featuredImage?.url ? (
              <div className="space-y-2">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-mist-200 bg-mist-100 dark:bg-mist-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage.url}
                    alt={featuredImage.alt ?? ''}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm font-medium text-mist-700 transition hover:bg-mist-100 dark:text-mist-300 dark:hover:bg-mist-800"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onFeaturedImageChange(null)}
                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-200 bg-mist-50/50 py-8 text-sm font-medium text-mist-600 transition hover:border-mist-400 hover:bg-mist-100 hover:text-mist-800 dark:bg-mist-800/30 dark:text-mist-400 dark:hover:text-mist-200"
              >
                <ImageIcon className="h-5 w-5" />
                Set featured image
              </button>
            )}
          </div>
        </div>
      </aside>

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(value) => {
          onFeaturedImageChange(value)
          setMediaPickerOpen(false)
        }}
      />
    </>
  )
}
