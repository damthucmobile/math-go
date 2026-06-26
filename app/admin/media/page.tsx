'use client'

import { useEffect, useState } from 'react'
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { getApiUrl } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import type { MediaItem } from '@/lib/media'

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const api = getApiUrl()
  const { setDeployingTrue } = useDeployStatus()

  useEffect(() => {
    fetch(`${api}/api/media`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [api])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${api}/api/media`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      const added = await res.json()
      if (added?.url) {
        setDeployingTrue()
        setItems((prev) => [...prev, added])
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-mist-950">Media library</h1>
            <p className="mt-1 text-mist-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-mist-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-mist-800">
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
        </div>
        {uploading && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-mist-300 bg-mist-100 px-4 py-2 text-sm text-mist-800 dark:border-mist-600 dark:bg-mist-800/50 dark:text-mist-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-mist-200 bg-white py-24 dark:border-mist-700 dark:bg-mist-900/30">
            <Loader2 className="h-10 w-10 animate-spin text-mist-600" />
            <p className="mt-4 text-sm text-mist-500">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-mist-200 bg-white py-24 dark:border-mist-700 dark:bg-mist-900/30">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mist-100 text-mist-400">
              <ImageIcon className="h-8 w-8" />
            </div>
            <p className="mt-4 font-medium text-mist-700">No media yet</p>
            <p className="mt-1 text-sm text-mist-500">Upload an image to get started.</p>
            <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-mist-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-mist-800">
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
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-mist-200 bg-white shadow-sm transition hover:shadow-md dark:border-mist-700 dark:bg-mist-900/30"
              >
                <div className="aspect-square bg-mist-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt ?? ''}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs text-mist-500" title={item.filename}>
                    {item.filename}
                  </p>
                  {item.alt && (
                    <p className="mt-0.5 truncate text-xs text-mist-600" title={item.alt}>
                      {item.alt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
