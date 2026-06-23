'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Loader2, ChevronRight, X } from 'lucide-react'
import { getApiUrl, getAdminPath, inputClasses, labelClasses, btnSecondary, linkMuted } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import type { TableConfig, ContentBlock } from '@/lib/cms'
import { htmlToSingleBlock, ourBlocksToHtml } from '@/lib/block-editor-adapter'
import { DocumentSidebar, type DocumentStatus, type FeaturedImageValue } from '@/app/admin/DocumentSidebar'
import { SectionDataFields, parseSectionData, type SectionDataShape } from '@/app/admin/SectionDataFields'
import { BlockEditorPlaceholder } from '@/app/components/BlockEditorPlaceholder'
import type { JsonValue } from '@/types/json'

const BlockEditor = dynamic(
  () => import('@/app/components/BlockEditor').then((m) => m.BlockEditor),
  { ssr: false, loading: BlockEditorPlaceholder }
)

function parseFeaturedImage(raw: JsonValue): FeaturedImageValue {
  if (raw == null) return null
  if (typeof raw === 'object' && raw !== null && 'url' in raw) {
    const o = raw as { url?: string; alt?: string }
    if (typeof o.url === 'string' && o.url.trim()) return { url: o.url.trim(), alt: typeof o.alt === 'string' ? o.alt : undefined }
  }
  return null
}

function parseStatus(raw: JsonValue): DocumentStatus {
  const s = String(raw ?? '').toLowerCase()
  if (s === 'draft' || s === 'published') return s
  return 'published'
}

export default function CmsEditRecordPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = params.tableId as string
  const id = params.id as string
  const [table, setTable] = useState<TableConfig | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [richtextBlocks, setRichtextBlocks] = useState<Record<string, ContentBlock[]>>({})
  const [status, setStatus] = useState<DocumentStatus>('published')
  const [featuredImage, setFeaturedImage] = useState<FeaturedImageValue>(null)
  const [components, setComponents] = useState<Record<string, JsonValue>[]>([])
  const [sectionData, setSectionData] = useState<SectionDataShape>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const adminPath = getAdminPath()
  const api = getApiUrl()
  const { setDeployingTrue } = useDeployStatus()
  const hasSlug = table?.fields.some((f) => f.key === 'slug') ?? false
  const slug = hasSlug ? (values.slug ?? '') : undefined
  const viewUrl =
    tableId === 'pages' && slug ? `/pages/${encodeURIComponent(slug)}` : tableId === 'posts' ? `/posts/${id}` : undefined
  const heroComponents: { id: number; label?: string; title?: string }[] =
    tableId === 'posts' || tableId === 'pages'
      ? (components.filter((c) => c.type === 'hero') as { id: number; label?: string; title?: string }[])
      : []

  const hasComponentBlocks =
    (tableId === 'posts' || tableId === 'pages') &&
    Array.isArray(contentBlocks) &&
    contentBlocks.some((b) => {
      if (b.type !== 'component') return false
      const raw = (b as { componentId?: number | string }).componentId
      const n = typeof raw === 'number' ? raw : Number(raw)
      return Number.isFinite(n) && n > 0
    })
  const selectedHeroComponentId = (tableId === 'posts' || tableId === 'pages') ? Number(values.heroComponentId) : 0
  const selectedHeroComponent = selectedHeroComponentId > 0
    ? (components.find((c) => Number((c as { id: number }).id) === selectedHeroComponentId) as { type?: string } | undefined)
    : undefined
  const heroSelected = selectedHeroComponent?.type === 'hero'
  const componentBlocks: { blockId: string; type: string }[] =
    (tableId === 'posts' || tableId === 'pages') && Array.isArray(contentBlocks)
      ? contentBlocks
          .filter((b) => b.type === 'component')
          .map((b) => {
            const raw = (b as { componentId?: number | string }).componentId
            const n = typeof raw === 'number' ? raw : Number(raw)
            const cid = Number.isFinite(n) && n > 0 ? n : 0
            const c = cid > 0 ? (components.find((c) => Number((c as { id: number }).id) === cid) as { type?: string } | undefined) : undefined
            return { blockId: b.id, type: c?.type ?? 'paragraph' }
          })
          .filter((ref) => ref.type && ref.type !== 'hero')
      : []
  const showSectionPanel = heroSelected || componentBlocks.length > 0

  useEffect(() => {
    const fetches: Promise<JsonValue>[] = [
      fetch(`${api}/api/cms/config`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${api}/api/cms/${tableId}?id=${id}`, { credentials: 'include' }).then((r) => r.json())
    ]
    if (tableId === 'posts' || tableId === 'pages') {
      fetches.push(fetch(`${api}/api/cms/components`, { credentials: 'include' }).then((r) => r.json()))
    }
    Promise.all(fetches)
      .then((results) => {
        const config = results[0] as { tables?: TableConfig[] }
        const record = results[1] as Record<string, JsonValue> | null
        if ((tableId === 'posts' || tableId === 'pages') && results[2] != null) {
          const componentsData = results[2]
          setComponents(Array.isArray(componentsData) ? (componentsData as Record<string, JsonValue>[]) : [])
        }
        const t = config?.tables?.find((x) => x.id === tableId) ?? null
        setTable(t)
        if (t && record) {
          setValues(
            Object.fromEntries(t.fields.map((f) => [f.key, String(record[f.key] ?? '')]))
          )
          const blocks = record.content_blocks as ContentBlock[] | undefined
          setContentBlocks(Array.isArray(blocks) ? blocks : [])
          const isBlockField = (key: string) =>
            (tableId === 'posts' && key === 'content') || (tableId === 'pages' && key === 'body')
          const nextRichtext: Record<string, ContentBlock[]> = {}
          t.fields.forEach((f) => {
            if (f.type === 'richtext' && !isBlockField(f.key)) {
              const html = String(record[f.key] ?? '')
              nextRichtext[f.key] = html ? htmlToSingleBlock(html) : []
            }
          })
          setRichtextBlocks(nextRichtext)
          setStatus(parseStatus(record.status))
          setFeaturedImage(parseFeaturedImage(record.featuredImage))
          if (tableId === 'posts' || tableId === 'pages') {
            setSectionData(parseSectionData(record.sectionData as string | undefined))
          }
        }
      })
      .finally(() => setLoading(false))
  }, [tableId, id, api])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!table) return
    setError(null)
    setSaving(true)
    try {
      const payload: Record<string, JsonValue> = {
        ...values,
        id,
        status,
        featuredImage: featuredImage ?? null
      }
      if (contentBlocks.length > 0) {
        payload.content_blocks = contentBlocks
        if (tableId === 'pages') payload.body = ''
        if (tableId === 'posts') payload.content = ''
      }
      if (tableId === 'posts' || tableId === 'pages') {
        payload.sectionData = Object.keys(sectionData).length > 0 ? JSON.stringify(sectionData) : ''
      }
      const isBlockField = (key: string) =>
        (tableId === 'posts' && key === 'content') || (tableId === 'pages' && key === 'body')
      table.fields.forEach((f) => {
        if (f.type === 'richtext' && !isBlockField(f.key)) {
          payload[f.key] = ourBlocksToHtml(richtextBlocks[f.key] ?? [])
        }
      })
      const res = await fetch(`${api}/api/cms/${tableId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload }),
        credentials: 'include'
      })
      if (!res.ok) {
        const err = await res.json()
        setError(typeof err?.error === 'string' ? err.error : 'Save failed')
        return
      }
      setError(null)
      setDeployingTrue()
      router.push(`${adminPath}/cms/${tableId}`)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this record?')) return
    setError(null)
    const res = await fetch(`${api}/api/cms/${tableId}?id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (res.ok) {
      setDeployingTrue()
      router.push(`${adminPath}/cms/${tableId}`)
      router.refresh()
    } else {
      setError('Delete failed')
    }
  }

  if (loading || !table) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-mist-600" />
        <p className="mt-4 text-sm text-mist-500">
          {loading ? 'Loading…' : 'Record or table not found.'}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
          <Link href={adminPath} className={linkMuted}>Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-mist-400" />
          <Link href={`${adminPath}/cms/${tableId}`} className={linkMuted}>{table.name}</Link>
          <ChevronRight className="h-4 w-4 text-mist-400" />
          <span className="font-medium text-mist-950">Edit</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-sm lg:p-8 dark:border-mist-700 dark:bg-mist-900/30">
              <h1 className="text-2xl font-bold tracking-tight text-mist-950 dark:text-white">
                Edit {table.singularName}
              </h1>
              <p className="mt-1 text-mist-600 dark:text-mist-400">Update content below. Required fields are marked with *. Use the panel on the right to publish and set options.</p>
              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                {table.fields.map((field) => {
                  const inputId = `edit-${tableId}-${field.key}-${id}`
                  const isBlockField =
                    (tableId === 'posts' && field.key === 'content') || (tableId === 'pages' && field.key === 'body')
                  if ((tableId === 'posts' || tableId === 'pages') && field.key === 'sectionData') return null
                  if (field.type === 'richtext') {
                    const blocks = isBlockField ? contentBlocks : (richtextBlocks[field.key] ?? [])
                    const setBlocks = isBlockField
                      ? setContentBlocks
                      : (next: ContentBlock[]) => setRichtextBlocks((prev) => ({ ...prev, [field.key]: next }))
                    return (
                      <div key={field.key} className="space-y-2">
                        <label className={labelClasses}>{field.label}</label>
                        {isBlockField && (tableId === 'posts' || tableId === 'pages') && (
                          <p className="text-xs text-mist-500 mb-1">
                            Use the + button to add blocks. Choose «Section component» to insert Hero, CTA, Pricing, Testimonials, etc.; data is taken from this {tableId === 'posts' ? 'post' : 'page'}.
                          </p>
                        )}
                        <BlockEditor
                          key={`block-${tableId}-${id}-${field.key}`}
                          holderId={`block-editor-${tableId}-${id}-${field.key}`}
                          value={blocks}
                          onChange={setBlocks}
                          legacyHtml={values[field.key] || undefined}
                          placeholder="Start writing or add a block…"
                          minHeight="320px"
                          componentOptions={isBlockField && (tableId === 'posts' || tableId === 'pages') ? (components as { id: number; label?: string; type?: string }[]) : undefined}
                        />
                      </div>
                    )
                  }
                  if (field.key === 'heroComponentId' && (tableId === 'posts' || tableId === 'pages')) {
                    return (
                      <div key={field.key}>
                        <label htmlFor={inputId} className={labelClasses}>
                          {field.label}
                        </label>
                        <select
                          id={inputId}
                          value={values[field.key] ?? '0'}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                          className={inputClasses + ' w-full max-w-xs'}
                          aria-label={field.label}
                        >
                          <option value="0">None</option>
                          {heroComponents.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                              {c.label ?? c.title ?? `Component ${c.id}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  }
                  return (
                    <div key={field.key}>
                      <label htmlFor={inputId} className={labelClasses}>
                        {field.label}
                        {field.required && ' *'}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={inputId}
                          value={values[field.key] ?? ''}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                          className={inputClasses + ' min-h-[120px] resize-y'}
                          rows={5}
                          required={field.required}
                          aria-required={field.required}
                        />
                      ) : (
                        <input
                          id={inputId}
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={values[field.key] ?? ''}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                          className={inputClasses}
                          required={field.required}
                          aria-required={field.required}
                        />
                      )}
                    </div>
                  )
                })}
                {(tableId === 'posts' || tableId === 'pages') && (
                  <div className="rounded-xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-900/30">
                    <h3 className="text-base font-semibold text-mist-800 dark:text-mist-200 mb-2">Section component data</h3>
                    {showSectionPanel ? (
                      <SectionDataFields
                        heroSelected={heroSelected}
                        componentBlocks={componentBlocks}
                        sectionData={sectionData}
                        onChange={setSectionData}
                        idPrefix="edit"
                      />
                    ) : hasComponentBlocks ? (
                      <p className="text-sm text-mist-600">
                        Section components are in the body. Save and refresh to load data fields, or ensure each Section component block has a template selected.
                      </p>
                    ) : (
                      <p className="text-sm text-mist-600">
                        Add a Section component block in the body above (click + and choose &quot;Section component&quot;) to fill data for CTA, Pricing, Testimonials, etc.
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 border-t border-mist-100 dark:border-mist-800 pt-6">
                  <Link href={`${adminPath}/cms/${tableId}`} className={btnSecondary}>
                    <X className="mr-1.5 h-4 w-4" />
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Document sidebar */}
          <DocumentSidebar
            submitLabel="Update"
            onSubmit={() => handleSubmit()}
            saving={saving}
            isNew={false}
            onDelete={handleDelete}
            status={status}
            onStatusChange={setStatus}
            slug={slug}
            onSlugChange={hasSlug ? (s) => setValues((v) => ({ ...v, slug: s })) : undefined}
            slugLabel="Permalink"
            featuredImage={featuredImage}
            onFeaturedImageChange={setFeaturedImage}
            viewUrl={viewUrl}
          />
        </div>
      </div>
    </div>
  )
}
