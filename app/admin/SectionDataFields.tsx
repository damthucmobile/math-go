'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { inputClasses, labelClasses } from '@/lib/admin-utils'
import { MediaPickerModal } from '@/app/admin/MediaPickerModal'
import { parseSectionData as parseSectionDataLib } from '@/lib/section-data'
import type { JsonValue } from '@/types/json'

/** Matches ComponentContextData.sectionData – data for section components (CTA, Pricing, etc.) */
export type SectionDataShape = {
  stats?: { value: string; label: string }[]
  testimonials?: { quote: string; author: string; role?: string; avatarUrl?: string }[]
  team?: { name: string; role: string; imageUrl?: string; bio?: string }[]
  faqs?: { question: string; answer: string }[]
  pricing?: {
    name: string
    price: string
    description?: string
    features?: string[]
    ctaText?: string
    ctaUrl?: string
  }[]
  featured?: { headline?: string; description?: string; imageUrl?: string }
  hero?: { headline?: string; subtext?: string; imageUrl?: string }
  cta?: { headline?: string; subtext?: string; buttonText?: string; buttonUrl?: string }
  banner?: { text?: string; linkText?: string; linkUrl?: string; style?: 'info' | 'success' | 'warning' }
  /** Per-block data when page has multiple of same type. Key = block id. */
  blocks?: Record<string, Record<string, JsonValue>>
}

const SECTION_TYPES_THAT_NEED_DATA = ['hero', 'featured', 'cta', 'pricing', 'stats', 'testimonials', 'team', 'faqs', 'banners', 'twocolumn'] as const

export type ComponentBlockRef = { blockId: string; type: string }

interface SectionDataFieldsProps {
  /** Hero component selected at top of page/post – show Hero Section card */
  heroSelected?: boolean
  /** Component blocks in the body – one card per block with separate fields */
  componentBlocks?: ComponentBlockRef[]
  sectionData: SectionDataShape
  onChange: (data: SectionDataShape) => void
  /** Optional prefix for input ids */
  idPrefix?: string
}

/** Re-export from lib for admin; cast to SectionDataShape (empty object when undefined). */
export function parseSectionData(raw: string | undefined): SectionDataShape {
  return (parseSectionDataLib(raw) ?? {}) as SectionDataShape
}

function SectionCard({
  title,
  children,
  defaultOpen = true
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-mist-200 bg-mist-50/50 dark:bg-mist-800/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-mist-800 dark:text-mist-200 hover:bg-mist-100/80 dark:hover:bg-mist-800/50"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </button>
      {open && <div className="border-t border-mist-200 p-4 space-y-3">{children}</div>}
    </div>
  )
}

/** Reusable image field: picker (upload + media library) + optional URL input */
function ImageUrlField({
  value,
  onChange,
  onOpenPicker,
  label = 'Image',
  placeholder = 'Or paste image URL'
}: {
  value: string
  onChange: (url: string) => void
  onOpenPicker: () => void
  label?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      {value ? (
        <div className="space-y-2">
          <div className="relative flex h-20 w-full max-w-[200px] items-center justify-center overflow-hidden rounded-xl border border-mist-200 bg-mist-100 dark:bg-mist-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="max-h-full max-w-full object-contain p-2" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenPicker}
              className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 dark:bg-mist-800 text-sm font-medium text-mist-700 dark:text-mist-300 transition hover:bg-mist-100 dark:hover:bg-mist-800"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenPicker}
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-200 bg-mist-50/50 dark:bg-mist-800/30 py-6 text-sm font-medium text-mist-600 dark:text-mist-400 transition hover:border-mist-400 hover:bg-mist-100 hover:text-mist-800 dark:hover:text-mist-200"
        >
          <ImageIcon className="h-5 w-5" />
          Select or upload image
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses + ' mt-2'}
        placeholder={placeholder}
      />
    </div>
  )
}

function CtaBlockForm({ data, onChange }: { data: Record<string, JsonValue>; onChange: (d: Record<string, JsonValue>) => void }) {
  const d = data as { headline?: string; subtext?: string; buttonText?: string; buttonUrl?: string }
  return (
    <div className="grid gap-3 sm:grid-cols-1">
      <div>
        <label className={labelClasses}>Headline</label>
        <input type="text" value={d?.headline ?? ''} onChange={(e) => onChange({ ...data, headline: e.target.value })} className={inputClasses} placeholder="Call to action headline" />
      </div>
      <div>
        <label className={labelClasses}>Subtext</label>
        <textarea value={d?.subtext ?? ''} onChange={(e) => onChange({ ...data, subtext: e.target.value })} className={inputClasses + ' min-h-[80px]'} placeholder="Supporting text" rows={2} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Button text</label>
          <input type="text" value={d?.buttonText ?? ''} onChange={(e) => onChange({ ...data, buttonText: e.target.value })} className={inputClasses} placeholder="Get started" />
        </div>
        <div>
          <label className={labelClasses}>Button URL</label>
          <input type="text" value={d?.buttonUrl ?? ''} onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })} className={inputClasses} placeholder="/signup" />
        </div>
      </div>
    </div>
  )
}

function TwoColumnBlockForm({ data, onChange }: { data: Record<string, JsonValue>; onChange: (d: Record<string, JsonValue>) => void }) {
  const left = (data.left as Record<string, JsonValue> | undefined) ?? {}
  const right = (data.right as Record<string, JsonValue> | undefined) ?? {}
  const updateSide = (side: 'left' | 'right', field: string, value: string) => {
    const next = side === 'left' ? { ...left, [field]: value } : { ...right, [field]: value }
    onChange({ ...data, [side]: next })
  }
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-mist-200 dark:border-mist-700 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-mist-800 dark:text-mist-200">Left column (e.g. Mission)</h4>
        <div>
          <label className={labelClasses}>Headline</label>
          <input type="text" value={(left.headline as string) ?? ''} onChange={(e) => updateSide('left', 'headline', e.target.value)} className={inputClasses} placeholder="Mission" />
        </div>
        <div>
          <label className={labelClasses}>Subtext</label>
          <textarea value={(left.subtext as string) ?? ''} onChange={(e) => updateSide('left', 'subtext', e.target.value)} className={inputClasses + ' min-h-[80px]'} rows={2} placeholder="Mission description" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Button text</label>
            <input type="text" value={(left.buttonText as string) ?? ''} onChange={(e) => updateSide('left', 'buttonText', e.target.value)} className={inputClasses} placeholder="View Services" />
          </div>
          <div>
            <label className={labelClasses}>Button URL</label>
            <input type="text" value={(left.buttonUrl as string) ?? ''} onChange={(e) => updateSide('left', 'buttonUrl', e.target.value)} className={inputClasses} placeholder="/pages/services" />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-mist-200 dark:border-mist-700 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-mist-800 dark:text-mist-200">Right column (e.g. Vision)</h4>
        <div>
          <label className={labelClasses}>Headline</label>
          <input type="text" value={(right.headline as string) ?? ''} onChange={(e) => updateSide('right', 'headline', e.target.value)} className={inputClasses} placeholder="Vision" />
        </div>
        <div>
          <label className={labelClasses}>Subtext</label>
          <textarea value={(right.subtext as string) ?? ''} onChange={(e) => updateSide('right', 'subtext', e.target.value)} className={inputClasses + ' min-h-[80px]'} rows={2} placeholder="Vision description" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Button text</label>
            <input type="text" value={(right.buttonText as string) ?? ''} onChange={(e) => updateSide('right', 'buttonText', e.target.value)} className={inputClasses} placeholder="Work With Me" />
          </div>
          <div>
            <label className={labelClasses}>Button URL</label>
            <input type="text" value={(right.buttonUrl as string) ?? ''} onChange={(e) => updateSide('right', 'buttonUrl', e.target.value)} className={inputClasses} placeholder="/pages/contact" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedBlockForm({
  data,
  onChange,
  openImagePicker
}: {
  data: Record<string, JsonValue>
  onChange: (d: Record<string, JsonValue>) => void
  openImagePicker: (setValue: (url: string) => void) => void
}) {
  const d = data as { headline?: string; description?: string; imageUrl?: string }
  return (
    <div className="space-y-3">
      <div>
        <label className={labelClasses}>Headline</label>
        <input type="text" value={d?.headline ?? ''} onChange={(e) => onChange({ ...data, headline: e.target.value })} className={inputClasses} />
      </div>
      <div>
        <label className={labelClasses}>Description</label>
        <textarea value={d?.description ?? ''} onChange={(e) => onChange({ ...data, description: e.target.value })} className={inputClasses + ' min-h-[80px]'} rows={2} />
      </div>
      <ImageUrlField
        value={d?.imageUrl ?? ''}
        onChange={(url) => onChange({ ...data, imageUrl: url })}
        onOpenPicker={() => openImagePicker((url) => onChange({ ...data, imageUrl: url }))}
        label="Image"
        placeholder="Or paste image URL"
      />
    </div>
  )
}

function BannerBlockForm({ data, onChange }: { data: Record<string, JsonValue>; onChange: (d: Record<string, JsonValue>) => void }) {
  const d = data as { text?: string; linkText?: string; linkUrl?: string; style?: string }
  return (
    <div className="space-y-3">
      <div>
        <label className={labelClasses}>Text</label>
        <input type="text" value={d?.text ?? ''} onChange={(e) => onChange({ ...data, text: e.target.value })} className={inputClasses} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Link text</label>
          <input type="text" value={d?.linkText ?? ''} onChange={(e) => onChange({ ...data, linkText: e.target.value })} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Link URL</label>
          <input type="text" value={d?.linkUrl ?? ''} onChange={(e) => onChange({ ...data, linkUrl: e.target.value })} className={inputClasses} />
        </div>
      </div>
      <div>
        <label className={labelClasses}>Style</label>
        <select value={d?.style ?? 'info'} onChange={(e) => onChange({ ...data, style: e.target.value })} className={inputClasses}>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
        </select>
      </div>
    </div>
  )
}

function StatsBlockForm({
  sectionData: _sectionData,
  blockId,
  getBlockData,
  updateBlock
}: {
  sectionData: SectionDataShape
  blockId: string
  getBlockData: (id: string) => Record<string, JsonValue>
  updateBlock: (id: string, d: Record<string, JsonValue>) => void
}) {
  const data = getBlockData(blockId)
  const stats = (data.stats as { value: string; label: string }[]) ?? []
  return (
    <>
      <div>
        <label className={labelClasses}>Section title</label>
        <input type="text" value={(data.headline as string) ?? ''} onChange={(e) => updateBlock(blockId, { ...data, headline: e.target.value })} className={inputClasses} placeholder="Optional (leave empty to use page title)" />
      </div>
      <p className="text-xs text-mist-500 dark:text-mist-400 mb-2">Add one or more stat rows (value + label).</p>
      {stats.map((stat, i) => (
        <div key={i} className="flex gap-2 items-start">
          <input
            type="text"
            value={stat.value}
            onChange={(e) => {
              const next = [...stats]
              next[i] = { ...next[i], value: e.target.value }
              updateBlock(blockId, { ...data, stats: next })
            }}
            className={inputClasses + ' flex-1'}
            placeholder="Value (e.g. 99%)"
          />
          <input
            type="text"
            value={stat.label}
            onChange={(e) => {
              const next = [...stats]
              next[i] = { ...next[i], label: e.target.value }
              updateBlock(blockId, { ...data, stats: next })
            }}
            className={inputClasses + ' flex-1'}
            placeholder="Label"
          />
          <button type="button" onClick={() => updateBlock(blockId, { ...data, stats: stats.filter((_, j) => j !== i) })} className="p-2 text-mist-400 hover:text-red-600" aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => updateBlock(blockId, { ...data, stats: [...stats, { value: '', label: '' }] })} className="inline-flex items-center gap-1 text-sm text-mist-700 hover:text-mist-800 dark:text-mist-300 dark:hover:text-white">
        <Plus className="h-4 w-4" /> Add stat
      </button>
    </>
  )
}

function PricingBlockForm({
  sectionData: _sectionData,
  blockId,
  getBlockData,
  updateBlock
}: {
  sectionData: SectionDataShape
  blockId: string
  getBlockData: (id: string) => Record<string, JsonValue>
  updateBlock: (id: string, d: Record<string, JsonValue>) => void
}) {
  const data = getBlockData(blockId)
  const pricing = (data.pricing as SectionDataShape['pricing']) ?? []
  return (
    <>
      <div>
        <label className={labelClasses}>Section title</label>
        <input type="text" value={(data.headline as string) ?? ''} onChange={(e) => updateBlock(blockId, { ...data, headline: e.target.value })} className={inputClasses} placeholder="e.g. Pricing (leave empty to use page title)" />
      </div>
      <p className="text-xs text-mist-500 dark:text-mist-400 mb-2">Add pricing plans.</p>
      {pricing.map((plan, i) => (
        <div key={i} className="rounded-lg border border-mist-200 p-3 space-y-2 bg-white dark:bg-mist-900/30 dark:border-mist-700">
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="text" value={plan.name} onChange={(e) => { const next = [...pricing]; next[i] = { ...next[i], name: e.target.value }; updateBlock(blockId, { ...data, pricing: next }) }} className={inputClasses} placeholder="Plan name" />
            <input type="text" value={plan.price} onChange={(e) => { const next = [...pricing]; next[i] = { ...next[i], price: e.target.value }; updateBlock(blockId, { ...data, pricing: next }) }} className={inputClasses} placeholder="Price (e.g. $10/mo)" />
          </div>
          <input type="text" value={plan.description ?? ''} onChange={(e) => { const next = [...pricing]; next[i] = { ...next[i], description: e.target.value }; updateBlock(blockId, { ...data, pricing: next }) }} className={inputClasses} placeholder="Short description" />
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="text" value={plan.ctaText ?? ''} onChange={(e) => { const next = [...pricing]; next[i] = { ...next[i], ctaText: e.target.value }; updateBlock(blockId, { ...data, pricing: next }) }} className={inputClasses} placeholder="Button text" />
            <input type="text" value={plan.ctaUrl ?? ''} onChange={(e) => { const next = [...pricing]; next[i] = { ...next[i], ctaUrl: e.target.value }; updateBlock(blockId, { ...data, pricing: next }) }} className={inputClasses} placeholder="Button URL" />
          </div>
          <button type="button" onClick={() => updateBlock(blockId, { ...data, pricing: pricing.filter((_, j) => j !== i) })} className="text-sm text-red-600 hover:text-red-700">Remove plan</button>
        </div>
      ))}
      <button type="button" onClick={() => updateBlock(blockId, { ...data, pricing: [...pricing, { name: '', price: '', description: '', ctaText: '', ctaUrl: '' }] })} className="inline-flex items-center gap-1 text-sm text-mist-700 hover:text-mist-800 dark:text-mist-300 dark:hover:text-white">
        <Plus className="h-4 w-4" /> Add plan
      </button>
    </>
  )
}

function TestimonialsBlockForm({
  sectionData: _sectionData,
  blockId,
  getBlockData,
  updateBlock,
  openImagePicker
}: {
  sectionData: SectionDataShape
  blockId: string
  getBlockData: (id: string) => Record<string, JsonValue>
  updateBlock: (id: string, d: Record<string, JsonValue>) => void
  openImagePicker: (setValue: (url: string) => void) => void
}) {
  const data = getBlockData(blockId)
  const testimonials = (data.testimonials as SectionDataShape['testimonials']) ?? []
  return (
    <>
      <div>
        <label className={labelClasses}>Section title</label>
        <input type="text" value={(data.headline as string) ?? ''} onChange={(e) => updateBlock(blockId, { ...data, headline: e.target.value })} className={inputClasses} placeholder="Optional (leave empty to use page title)" />
      </div>
      <p className="text-xs text-mist-500 dark:text-mist-400 mb-2">Add testimonial entries.</p>
      {testimonials.map((t, i) => (
        <div key={i} className="rounded-lg border border-mist-200 p-3 space-y-2 bg-white dark:bg-mist-900/30 dark:border-mist-700">
          <textarea value={t.quote} onChange={(e) => { const next = [...testimonials]; next[i] = { ...next[i], quote: e.target.value }; updateBlock(blockId, { ...data, testimonials: next }) }} className={inputClasses + ' min-h-[60px]'} placeholder="Quote" rows={2} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="text" value={t.author} onChange={(e) => { const next = [...testimonials]; next[i] = { ...next[i], author: e.target.value }; updateBlock(blockId, { ...data, testimonials: next }) }} className={inputClasses} placeholder="Author name" />
            <input type="text" value={t.role ?? ''} onChange={(e) => { const next = [...testimonials]; next[i] = { ...next[i], role: e.target.value }; updateBlock(blockId, { ...data, testimonials: next }) }} className={inputClasses} placeholder="Role / title" />
          </div>
          <ImageUrlField
            value={t.avatarUrl ?? ''}
            onChange={(url) => {
              const next = [...testimonials]
              next[i] = { ...next[i], avatarUrl: url }
              updateBlock(blockId, { ...data, testimonials: next })
            }}
            onOpenPicker={() =>
              openImagePicker((url) => {
                const next = [...testimonials]
                next[i] = { ...next[i], avatarUrl: url }
                updateBlock(blockId, { ...data, testimonials: next })
              })
            }
            label="Avatar image"
            placeholder="Or paste image URL"
          />
          <button type="button" onClick={() => updateBlock(blockId, { ...data, testimonials: testimonials.filter((_, j) => j !== i) })} className="text-sm text-red-600 hover:text-red-700">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => updateBlock(blockId, { ...data, testimonials: [...testimonials, { quote: '', author: '', role: '' }] })} className="inline-flex items-center gap-1 text-sm text-mist-700 hover:text-mist-800 dark:text-mist-300 dark:hover:text-white">
        <Plus className="h-4 w-4" /> Add testimonial
      </button>
    </>
  )
}

function TeamBlockForm({
  sectionData: _sectionData,
  blockId,
  getBlockData,
  updateBlock,
  openImagePicker
}: {
  sectionData: SectionDataShape
  blockId: string
  getBlockData: (id: string) => Record<string, JsonValue>
  updateBlock: (id: string, d: Record<string, JsonValue>) => void
  openImagePicker: (setValue: (url: string) => void) => void
}) {
  const data = getBlockData(blockId)
  const team = (data.team as SectionDataShape['team']) ?? []
  return (
    <>
      <div>
        <label className={labelClasses}>Section title</label>
        <input type="text" value={(data.headline as string) ?? ''} onChange={(e) => updateBlock(blockId, { ...data, headline: e.target.value })} className={inputClasses} placeholder="Optional (leave empty to use page title)" />
      </div>
      <p className="text-xs text-mist-500 dark:text-mist-400 mb-2">Add team members.</p>
      {team.map((m, i) => (
        <div key={i} className="rounded-lg border border-mist-200 p-3 space-y-2 bg-white dark:bg-mist-900/30 dark:border-mist-700">
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="text" value={m.name} onChange={(e) => { const next = [...team]; next[i] = { ...next[i], name: e.target.value }; updateBlock(blockId, { ...data, team: next }) }} className={inputClasses} placeholder="Name" />
            <input type="text" value={m.role} onChange={(e) => { const next = [...team]; next[i] = { ...next[i], role: e.target.value }; updateBlock(blockId, { ...data, team: next }) }} className={inputClasses} placeholder="Role" />
          </div>
          <ImageUrlField
            value={m.imageUrl ?? ''}
            onChange={(url) => {
              const next = [...team]
              next[i] = { ...next[i], imageUrl: url }
              updateBlock(blockId, { ...data, team: next })
            }}
            onOpenPicker={() =>
              openImagePicker((url) => {
                const next = [...team]
                next[i] = { ...next[i], imageUrl: url }
                updateBlock(blockId, { ...data, team: next })
              })
            }
            label="Photo"
            placeholder="Or paste image URL"
          />
          <textarea value={m.bio ?? ''} onChange={(e) => { const next = [...team]; next[i] = { ...next[i], bio: e.target.value }; updateBlock(blockId, { ...data, team: next }) }} className={inputClasses + ' min-h-[60px]'} placeholder="Short bio" rows={2} />
          <button type="button" onClick={() => updateBlock(blockId, { ...data, team: team.filter((_, j) => j !== i) })} className="text-sm text-red-600 hover:text-red-700">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => updateBlock(blockId, { ...data, team: [...team, { name: '', role: '', imageUrl: '', bio: '' }] })} className="inline-flex items-center gap-1 text-sm text-mist-700 hover:text-mist-800 dark:text-mist-300 dark:hover:text-white">
        <Plus className="h-4 w-4" /> Add member
      </button>
    </>
  )
}

function FaqsBlockForm({
  sectionData: _sectionData,
  blockId,
  getBlockData,
  updateBlock
}: {
  sectionData: SectionDataShape
  blockId: string
  getBlockData: (id: string) => Record<string, JsonValue>
  updateBlock: (id: string, d: Record<string, JsonValue>) => void
}) {
  const data = getBlockData(blockId)
  const faqs = (data.faqs as SectionDataShape['faqs']) ?? []
  return (
    <>
      <div>
        <label className={labelClasses}>Section title</label>
        <input
          type="text"
          value={(data.headline as string) ?? ''}
          onChange={(e) => updateBlock(blockId, { ...data, headline: e.target.value })}
          className={inputClasses}
          placeholder="e.g. Frequently Asked Questions (leave empty to use page title)"
        />
      </div>
      <p className="text-xs text-mist-500 dark:text-mist-400 mb-2">Add question/answer pairs.</p>
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-lg border border-mist-200 p-3 space-y-2 bg-white dark:bg-mist-900/30 dark:border-mist-700">
          <input type="text" value={faq.question} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], question: e.target.value }; updateBlock(blockId, { ...data, faqs: next }) }} className={inputClasses} placeholder="Question" />
          <textarea value={faq.answer} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], answer: e.target.value }; updateBlock(blockId, { ...data, faqs: next }) }} className={inputClasses + ' min-h-[60px]'} placeholder="Answer" rows={2} />
          <button type="button" onClick={() => updateBlock(blockId, { ...data, faqs: faqs.filter((_, j) => j !== i) })} className="text-sm text-red-600 hover:text-red-700">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => updateBlock(blockId, { ...data, faqs: [...faqs, { question: '', answer: '' }] })} className="inline-flex items-center gap-1 text-sm text-mist-700 hover:text-mist-800 dark:text-mist-300 dark:hover:text-white">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
    </>
  )
}

function sectionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hero: 'Hero Section',
    featured: 'Featured Section',
    cta: 'CTA Section',
    pricing: 'Pricing Section',
    stats: 'Stats',
    testimonials: 'Testimonials',
    team: 'Team Section',
    faqs: 'FAQs',
    banners: 'Banner',
    twocolumn: 'Two Column (Mission & Vision)'
  }
  return labels[type] ?? type
}

export function SectionDataFields({
  heroSelected,
  componentBlocks = [],
  sectionData,
  onChange,
  idPrefix: _idPrefix = 'section'
}: SectionDataFieldsProps) {
  const [pickerState, setPickerState] = useState<{ setValue: (url: string) => void } | null>(null)

  const update = (key: keyof SectionDataShape, value: SectionDataShape[keyof SectionDataShape]) => {
    onChange({ ...sectionData, [key]: value })
  }
  const getBlockData = (blockId: string): Record<string, JsonValue> => sectionData.blocks?.[blockId] ?? {}
  const updateBlock = (blockId: string, data: Record<string, JsonValue>) => {
    onChange({
      ...sectionData,
      blocks: { ...sectionData.blocks, [blockId]: { ...sectionData.blocks?.[blockId], ...data } }
    })
  }
  const getBlockTitle = (ref: ComponentBlockRef): string => {
    const sameType = componentBlocks.filter((b) => b.type === ref.type)
    const index = sameType.findIndex((b) => b.blockId === ref.blockId) + 1
    const label = sectionTypeLabel(ref.type)
    return sameType.length > 1 ? `${label} (${index})` : label
  }

  const openImagePicker = (setValue: (url: string) => void) => {
    setPickerState({
      setValue: (url: string) => {
        setValue(url)
        setPickerState(null)
      }
    })
  }

  const hasHero = Boolean(heroSelected)
  const blockTypes = componentBlocks.filter((r) =>
    SECTION_TYPES_THAT_NEED_DATA.includes(r.type as (typeof SECTION_TYPES_THAT_NEED_DATA)[number]) && r.type !== 'hero'
  )
  if (!hasHero && blockTypes.length === 0) return null

  return (
    <div className="space-y-4">
      <p className="text-xs text-mist-500 dark:text-mist-400">
        Fill in the data below for each section. Each component reference has its own fields. Save the post or page to see it on the frontend.
      </p>

      {heroSelected && (
        <SectionCard title="Hero Section (top of page)">
          <p className="text-xs text-mist-500 dark:text-mist-400 mb-3">
            Optional overrides for the hero at the top. Leave empty to use this page&apos;s Title, Body, and Featured image.
          </p>
          <div className="space-y-3">
            <div>
              <label className={labelClasses}>Headline</label>
              <input
                type="text"
                value={sectionData.hero?.headline ?? ''}
                onChange={(e) => update('hero', { ...sectionData.hero, headline: e.target.value })}
                className={inputClasses}
                placeholder="Uses page title if empty"
              />
            </div>
            <div>
              <label className={labelClasses}>Subtext / description</label>
              <textarea
                value={sectionData.hero?.subtext ?? ''}
                onChange={(e) => update('hero', { ...sectionData.hero, subtext: e.target.value })}
                className={inputClasses + ' min-h-[80px]'}
                placeholder="Uses page body if empty"
                rows={2}
              />
            </div>
            <ImageUrlField
              value={sectionData.hero?.imageUrl ?? ''}
              onChange={(url) => update('hero', { ...sectionData.hero, imageUrl: url })}
              onOpenPicker={() => openImagePicker((url) => update('hero', { ...sectionData.hero, imageUrl: url }))}
              label="Image"
              placeholder="Uses featured image if empty. Or paste image URL"
            />
          </div>
        </SectionCard>
      )}

      {blockTypes.map((ref) => (
        <SectionCard key={ref.blockId} title={getBlockTitle(ref)}>
          {ref.type === 'cta' && (
            <CtaBlockForm data={getBlockData(ref.blockId)} onChange={(d) => updateBlock(ref.blockId, d)} />
          )}
          {ref.type === 'twocolumn' && (
            <TwoColumnBlockForm data={getBlockData(ref.blockId)} onChange={(d) => updateBlock(ref.blockId, d)} />
          )}
          {ref.type === 'featured' && (
            <FeaturedBlockForm
              data={getBlockData(ref.blockId)}
              onChange={(d) => updateBlock(ref.blockId, d)}
              openImagePicker={openImagePicker}
            />
          )}
          {(ref.type === 'banner' || ref.type === 'banners') && (
            <BannerBlockForm data={getBlockData(ref.blockId)} onChange={(d) => updateBlock(ref.blockId, d)} />
          )}
          {ref.type === 'stats' && (
            <StatsBlockForm sectionData={sectionData} blockId={ref.blockId} getBlockData={getBlockData} updateBlock={updateBlock} />
          )}
          {ref.type === 'pricing' && (
            <PricingBlockForm sectionData={sectionData} blockId={ref.blockId} getBlockData={getBlockData} updateBlock={updateBlock} />
          )}
          {ref.type === 'testimonials' && (
            <TestimonialsBlockForm
              sectionData={sectionData}
              blockId={ref.blockId}
              getBlockData={getBlockData}
              updateBlock={updateBlock}
              openImagePicker={openImagePicker}
            />
          )}
          {ref.type === 'team' && (
            <TeamBlockForm
              sectionData={sectionData}
              blockId={ref.blockId}
              getBlockData={getBlockData}
              updateBlock={updateBlock}
              openImagePicker={openImagePicker}
            />
          )}
          {ref.type === 'faqs' && (
            <FaqsBlockForm sectionData={sectionData} blockId={ref.blockId} getBlockData={getBlockData} updateBlock={updateBlock} />
          )}
        </SectionCard>
      ))}

      <MediaPickerModal
        isOpen={pickerState !== null}
        onClose={() => setPickerState(null)}
        onSelect={(value) => {
          pickerState?.setValue(value?.url ?? '')
        }}
      />
    </div>
  )
}
