'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { getApiUrl } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import type { MediaItem } from '@/lib/media'

type FeaturedImageValue = { url: string; alt?: string } | null

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (value: FeaturedImageValue) => void
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const { setDeployingTrue } = useDeployStatus()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch(`${getApiUrl()}/api/media`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [isOpen])

  // Capture focus on open, restore on close, and trap focus
  useEffect(() => {
    if (!isOpen) return
    previousActiveRef.current = document.activeElement as HTMLElement | null
    const el = dialogRef.current
    if (!el) return
    const focusables = el.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = focusables[0]
    if (first) {
      requestAnimationFrame(() => first.focus())
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !el.contains(document.activeElement)) return
      const list = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => (node as HTMLInputElement).type !== 'hidden' && !node.hasAttribute('disabled')
      )
      if (list.length === 0) return
      const i = list.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey) {
        if (i <= 0) {
          e.preventDefault()
          list[list.length - 1].focus()
        }
      } else {
        if (i === -1 || i >= list.length - 1) {
          e.preventDefault()
          list[0].focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveRef.current?.focus?.()
    }
  }, [isOpen, onClose])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${getApiUrl()}/api/media`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      const added = await res.json()
      if (added?.url) {
        setDeployingTrue()
        setItems((prev) => [...prev, added])
        onSelect({ url: added.url, alt: added.alt })
        onClose()
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-mist-950/60 dark:bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
      aria-label="Choose or upload image"
    >
      <div
        ref={dialogRef}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-mist-200 dark:border-mist-700 bg-white shadow-xl dark:bg-mist-900/50"
      >
        <div className="flex items-center justify-between border-b border-mist-200 dark:border-mist-700 px-6 py-4">
          <h2 id="media-picker-title" className="text-lg font-semibold text-mist-950 dark:text-white">Media library</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-mist-500 dark:text-mist-400 transition hover:bg-mist-100 hover:text-mist-800 dark:hover:bg-mist-800 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-mist-300 bg-mist-50 dark:bg-mist-800/30 px-4 py-3 text-sm font-medium text-mist-700 dark:text-mist-300 transition hover:border-mist-400 hover:bg-mist-100 hover:text-mist-800 dark:hover:text-white">
            <Upload className="h-4 w-4" />
            Upload image
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-mist-500 dark:text-mist-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-mist-600 dark:text-mist-400" />
              <p className="mt-2 text-sm text-mist-500 dark:text-mist-400">Loading media…</p>
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-mist-500 dark:text-mist-400">
              No images yet. Upload an image above.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect({ url: item.url, alt: item.alt })
                    onClose()
                  }}
                  className="group relative aspect-square overflow-hidden rounded-xl border-2 border-mist-200 dark:border-mist-700 bg-mist-100 dark:bg-mist-800 transition hover:border-mist-500 hover:shadow-md focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-500/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt ?? ''}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-mist-200 dark:border-mist-700 px-6 py-3">
          <button
            type="button"
            onClick={() => {
              onSelect(null)
              onClose()
            }}
            className="text-sm font-medium text-mist-600 hover:text-mist-950 dark:text-mist-400 dark:hover:text-white"
          >
            Remove featured image
          </button>
        </div>
      </div>
    </div>
  )
}
