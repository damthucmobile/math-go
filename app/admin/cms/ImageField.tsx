'use client'

import { useState } from 'react'
import { Image as ImageIcon, Link2, UploadCloud } from 'lucide-react'
import { inputClasses, labelClasses } from '@/lib/admin-utils'
import { MediaPickerModal } from '@/app/admin/MediaPickerModal'

type CmsImageFieldProps = {
  id: string
  label: string
  value: string
  required?: boolean
  onChange: (value: string) => void
}

export function CmsImageField({ id, label, value, required, onChange }: CmsImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <>
      <div className="space-y-2">
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required ? ' *' : ''}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
            placeholder="https://example.com/image.jpg"
            required={required}
            aria-required={required}
          />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist-300 bg-white px-4 py-2 text-sm font-medium text-mist-700 transition hover:border-mist-400 hover:bg-mist-50 hover:text-mist-900 dark:border-mist-700 dark:bg-mist-900/40 dark:text-mist-200 dark:hover:bg-mist-800"
          >
            <ImageIcon className="h-4 w-4" />
            Chọn ảnh
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-mist-500 dark:text-mist-400">
          <span className="inline-flex items-center gap-1">
            <Link2 className="h-3.5 w-3.5" />
            Có thể dán URL trực tiếp
          </span>
          <span className="inline-flex items-center gap-1">
            <UploadCloud className="h-3.5 w-3.5" />
            Hoặc chọn từ thư viện/media
          </span>
        </div>
        {value && (
          <div className="overflow-hidden rounded-2xl border border-mist-200 bg-mist-50 p-2 dark:border-mist-700 dark:bg-mist-800/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-32 w-full rounded-xl object-cover" />
          </div>
        )}
      </div>
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(selected) => {
          onChange(selected?.url ?? '')
          setPickerOpen(false)
        }}
      />
    </>
  )
}
