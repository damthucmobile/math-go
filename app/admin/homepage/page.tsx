'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Loader2, ChevronRight } from 'lucide-react'
import { getApiUrl, getAdminPath, inputClasses, labelClasses, btnSecondary, linkMuted } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import type { ContentBlock } from '@/lib/cms'
import { SectionDataFields, parseSectionData, type SectionDataShape } from '@/app/admin/SectionDataFields'
import type { JsonValue } from '@/types/json'
import { BlockEditorPlaceholder } from '@/app/components/BlockEditorPlaceholder'

const BlockEditor = dynamic(
  () => import('@/app/components/BlockEditor').then((m) => m.BlockEditor),
  { ssr: false, loading: BlockEditorPlaceholder }
)

const HOMEPAGE_ID = '1'

export default function AdminHomepagePage() {
  const adminPath = getAdminPath()
  const api = getApiUrl()
  const { setDeployingTrue } = useDeployStatus()
  const [values, setValues] = useState<Record<string, string>>({ title: '', body: '', heroComponentId: '' })
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [components, setComponents] = useState<Record<string, JsonValue>[]>([])
  const [sectionData, setSectionData] = useState<SectionDataShape>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const heroComponents: { id: number; label?: string; title?: string }[] = (
    components.filter((c) => (c as { type?: string }).type === 'hero') as { id: number; label?: string; title?: string }[]
  )
  const selectedHeroComponentId = Number(values.heroComponentId) || 0
  const selectedHeroComponent = selectedHeroComponentId > 0
    ? (components.find((c) => Number((c as { id: number }).id) === selectedHeroComponentId) as { type?: string } | undefined)
    : undefined
  const heroSelected = selectedHeroComponent?.type === 'hero'
  const componentBlocks: { blockId: string; type: string }[] = contentBlocks
    .filter((b) => b.type === 'component')
    .map((b) => {
      const raw = (b as { componentId?: number | string }).componentId
      const n = typeof raw === 'number' ? raw : Number(raw)
      const cid = Number.isFinite(n) && n > 0 ? n : 0
      const c = cid > 0 ? (components.find((co) => Number((co as { id: number }).id) === cid) as { type?: string } | undefined) : undefined
      return { blockId: b.id, type: c?.type ?? 'paragraph' }
    })
    .filter((ref) => ref.type && ref.type !== 'hero')
  const showSectionPanel = heroSelected || componentBlocks.length > 0
  const hasComponentBlocks = contentBlocks.some((b) => {
    if (b.type !== 'component') return false
    const raw = (b as { componentId?: number | string }).componentId
    const n = typeof raw === 'number' ? raw : Number(raw)
    return Number.isFinite(n) && n > 0
  })

  useEffect(() => {
    Promise.all([
      fetch(`${api}/api/cms/homepage?id=${HOMEPAGE_ID}`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${api}/api/cms/components`, { credentials: 'include' }).then((r) => r.json())
    ])
      .then(([record, componentsData]) => {
        const rec = record as Record<string, JsonValue> | null
        const comps = Array.isArray(componentsData) ? componentsData : []
        setComponents(comps)
        if (rec) {
          setValues({
            title: String(rec.title ?? ''),
            body: String(rec.body ?? ''),
            heroComponentId: String(rec.heroComponentId ?? '0')
          })
          const blocks = rec.content_blocks as ContentBlock[] | undefined
          setContentBlocks(Array.isArray(blocks) ? blocks : [])
          setSectionData(parseSectionData(rec.sectionData as string | undefined))
        }
      })
      .finally(() => setLoading(false))
  }, [api])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload: Record<string, JsonValue> = {
        id: 1,
        title: values.title,
        body: contentBlocks.length > 0 ? '' : values.body,
        heroComponentId: values.heroComponentId ? Number(values.heroComponentId) : 0,
        sectionData: Object.keys(sectionData).length > 0 ? JSON.stringify(sectionData) : '',
        content_blocks: contentBlocks.length > 0 ? contentBlocks : undefined
      }
      const res = await fetch(`${api}/api/cms/homepage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })
      if (!res.ok) {
        const err = await res.json()
        setError(typeof err?.error === 'string' ? err.error : 'Save failed')
        return
      }
      setDeployingTrue()
      window.location.reload()
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-mist-600 dark:text-mist-400" />
        <p className="mt-4 text-sm text-mist-600 dark:text-mist-400">Loading homepage…</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
          <Link href={adminPath} className={linkMuted}>Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-mist-400" />
          <span className="font-medium text-mist-950 dark:text-white">Homepage</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-900/30 lg:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-mist-950 dark:text-white">Edit Homepage</h1>
              <p className="mt-1 text-mist-600 dark:text-mist-400">Update the content shown on your site’s homepage. Required fields are marked with *.</p>
              {error && (
                <div
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <div>
                  <label htmlFor="homepage-title" className={labelClasses}>Title *</label>
                  <input
                    id="homepage-title"
                    type="text"
                    value={values.title}
                    onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
                    className={inputClasses}
                    required
                    placeholder="Welcome"
                  />
                </div>

                <div>
                  <label htmlFor="homepage-hero" className={labelClasses}>Hero component</label>
                  <select
                    id="homepage-hero"
                    value={values.heroComponentId ?? '0'}
                    onChange={(e) => setValues((v) => ({ ...v, heroComponentId: e.target.value }))}
                    className={inputClasses + ' w-full max-w-xs'}
                    aria-label="Hero component"
                  >
                    <option value="0">None</option>
                    {heroComponents.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.label ?? c.title ?? `Component ${c.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Body</label>
                  <p className="text-xs text-mist-500 mb-1">
                    Use the + button to add blocks. Choose «Section component» to insert Hero, CTA, Pricing, Testimonials, etc.
                  </p>
                  <BlockEditor
                    key="block-editor-homepage-body"
                    holderId="block-editor-homepage-body"
                    value={contentBlocks}
                    onChange={setContentBlocks}
                    legacyHtml={values.body || undefined}
                    placeholder="Start writing or add a block…"
                    minHeight="320px"
                    componentOptions={components as { id: number; label?: string; type?: string }[]}
                  />
                </div>

                <div className="rounded-xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-900/20">
                  <h3 className="text-base font-semibold text-mist-950 dark:text-white mb-2">Section component data</h3>
                  {showSectionPanel ? (
                    <SectionDataFields
                      heroSelected={heroSelected}
                      componentBlocks={componentBlocks}
                      sectionData={sectionData}
                      onChange={setSectionData}
                      idPrefix="homepage"
                    />
                  ) : hasComponentBlocks ? (
                    <p className="text-sm text-mist-600">
                      Section components are in the body. Save and refresh to load data fields.
                    </p>
                  ) : (
                    <p className="text-sm text-mist-600">
                      Add a Section component block in the body above (click + and choose &quot;Section component&quot;) to fill data for CTA, Pricing, Testimonials, etc.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 border-t border-mist-100 dark:border-mist-800 pt-6">
                  <Link href={adminPath} className={btnSecondary}>
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-80" aria-label="Homepage actions">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-900/30">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">Update</h3>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-mist-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-mist-900 disabled:opacity-50 dark:bg-mist-700 dark:hover:bg-mist-600"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update Homepage
                </button>
              </div>
              <div className="border-t border-mist-100 pt-6 dark:border-mist-800">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-mist-700 hover:text-mist-950 dark:text-mist-300 dark:hover:text-white"
                >
                  View homepage
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
