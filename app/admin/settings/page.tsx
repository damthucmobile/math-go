'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  Save,
  Loader2,
  Plus,
  Trash2,
  Layout,
  Menu,
  FileText,
  Image as ImageIcon,
  type LucideIcon
} from 'lucide-react'
import { getApiUrl, getAdminPath, inputClasses, labelClasses, btnPrimary, btnSecondary } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import type { SiteSettings, NavItem, HeaderSettings, FooterSettings } from '@/lib/settings'
import { MediaPickerModal } from '@/app/admin/MediaPickerModal'

export default function AdminSettingsPage() {
  const adminPath = getAdminPath()
  const api = getApiUrl()
  const { setDeployingTrue } = useDeployStatus()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [logoPickerOpen, setLogoPickerOpen] = useState(false)

  useEffect(() => {
    fetch(`${api}/api/settings`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data: SiteSettings) => setSettings(data))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false))
  }, [api])

  const update = (partial: Partial<SiteSettings>) => {
    if (!settings) return
    setSettings((prev) => (prev ? { ...prev, ...partial } : null))
  }

  const updateHeader = (partial: Partial<HeaderSettings>) => {
    if (!settings) return
    setSettings((prev) =>
      prev ? { ...prev, header: { ...prev.header, ...partial } } : null
    )
  }

  const updateFooter = (partial: Partial<FooterSettings>) => {
    if (!settings) return
    setSettings((prev) =>
      prev ? { ...prev, footer: { ...prev.footer, ...partial } } : null
    )
  }

  const setNavItems = (items: NavItem[]) => {
    if (!settings) return
    setSettings((prev) =>
      prev ? { ...prev, navigation: { items } } : null
    )
  }

  const addNavItem = () => {
    setNavItems([...(settings?.navigation.items ?? []), { label: '', url: '/' }])
  }

  const removeNavItem = (index: number) => {
    const items = [...(settings?.navigation.items ?? [])]
    items.splice(index, 1)
    setNavItems(items)
  }

  const updateNavItem = (index: number, field: 'label' | 'url', value: string) => {
    const items = [...(settings?.navigation.items ?? [])]
    if (!items[index]) return
    items[index] = { ...items[index], [field]: value }
    setNavItems(items)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`${api}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        credentials: 'include'
      })
      if (!res.ok) {
        const err = await res.json()
        setMessage({ type: 'error', text: err.error ?? 'Save failed' })
        return
      }
      setDeployingTrue()
      setMessage({ type: 'success', text: 'Settings saved.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-mist-700" />
        <p className="mt-4 text-sm text-mist-500">Loading settings…</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-mist-600">Failed to load settings.</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
          <Link href={adminPath} className="text-mist-500 transition hover:text-mist-950 dark:text-mist-400 dark:hover:text-white">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-mist-400" />
          <span className="font-medium text-mist-950 dark:text-white">Settings</span>
        </nav>

        <div className="rounded-2xl border border-mist-200 bg-white shadow-sm overflow-hidden dark:border-mist-700 dark:bg-mist-900/30">
          <div className="border-b border-mist-100 bg-gradient-to-b from-mist-50 to-white px-6 py-8 dark:border-mist-800 dark:from-mist-900/50 dark:to-mist-900/30">
            <h1 className="text-2xl font-bold tracking-normal text-mist-950 dark:text-white">Site settings</h1>
            <p className="mt-1 text-mist-600 dark:text-mist-400">
              Configure header, footer, and navigation for your site. Required fields are marked with *.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-10">
            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-mist-200/50 text-mist-800 dark:bg-mist-700/30 dark:text-mist-200'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Site identity */}
            <Section title="Site identity" icon={Layout}>
              <div className="grid gap-4 sm:grid-cols-1">
                <div>
                  <label htmlFor="siteTitle" className={labelClasses}>
                    Site title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="siteTitle"
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => update({ siteTitle: e.target.value })}
                    className={inputClasses}
                    placeholder="My Site"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="announcementText" className={labelClasses}>
                    Announcement bar text
                  </label>
                  <input
                    id="announcementText"
                    type="text"
                    value={settings.announcementText ?? ''}
                    onChange={(e) => update({ announcementText: e.target.value })}
                    className={inputClasses}
                    placeholder="e.g. New feature launch — check it out"
                  />
                  <p className="mt-1 text-xs text-mist-500">
                    Optional. Shown above the header when both text and link are set.
                  </p>
                </div>
                <div>
                  <label htmlFor="announcementUrl" className={labelClasses}>
                    Announcement bar link
                  </label>
                  <input
                    id="announcementUrl"
                    type="text"
                    value={settings.announcementUrl ?? ''}
                    onChange={(e) => update({ announcementUrl: e.target.value })}
                    className={inputClasses}
                    placeholder="/features or https://..."
                  />
                </div>
                <div>
                  <label htmlFor="tagline" className={labelClasses}>
                    Tagline
                  </label>
                  <input
                    id="tagline"
                    type="text"
                    value={settings.tagline ?? ''}
                    onChange={(e) => update({ tagline: e.target.value })}
                    className={inputClasses}
                    placeholder="A short description"
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Logo
                  </label>
                  {settings.logoUrl ? (
                    <div className="space-y-2">
                      <div className="relative flex h-20 w-full max-w-[200px] items-center justify-center overflow-hidden rounded-xl border border-mist-200 bg-mist-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={settings.logoUrl}
                          alt="Site logo"
                          className="max-h-full max-w-full object-contain p-2"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setLogoPickerOpen(true)}
                          className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm font-medium text-mist-700 transition hover:bg-mist-100 dark:border-mist-700 dark:bg-mist-800 dark:text-mist-300 dark:hover:bg-mist-700"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => update({ logoUrl: '' })}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLogoPickerOpen(true)}
                      className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-200 bg-mist-50/50 py-8 text-sm font-medium text-mist-600 transition hover:border-mist-400 hover:bg-mist-100 hover:text-mist-800 dark:hover:text-mist-200"
                    >
                      <ImageIcon className="h-5 w-5" />
                      Select or upload logo
                    </button>
                  )}
                  <p className="mt-2 text-xs text-mist-500">
                    Leave empty to show site title as text. You can also paste a URL below.
                  </p>
                  <input
                    id="logoUrl"
                    type="text"
                    value={settings.logoUrl ?? ''}
                    onChange={(e) => update({ logoUrl: e.target.value })}
                    className={inputClasses + ' mt-2'}
                    placeholder="Or paste image URL (e.g. /uploads/logo.png)"
                  />
                </div>
              </div>
            </Section>

            <MediaPickerModal
              isOpen={logoPickerOpen}
              onClose={() => setLogoPickerOpen(false)}
              onSelect={(value) => {
                update({ logoUrl: value?.url ?? '' })
                setLogoPickerOpen(false)
              }}
            />

            {/* Header */}
            <Section title="Header" icon={Menu}>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.header.showLogo}
                    onChange={(e) => updateHeader({ showLogo: e.target.checked })}
                    className="h-4 w-4 rounded border-mist-300 text-mist-600 focus:ring-mist-500"
                  />
                  <span className="text-sm font-medium text-mist-700">Show logo / site title</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.header.showNav}
                    onChange={(e) => updateHeader({ showNav: e.target.checked })}
                    className="h-4 w-4 rounded border-mist-300 text-mist-600 focus:ring-mist-500"
                  />
                  <span className="text-sm font-medium text-mist-700">Show navigation menu</span>
                </label>
                <div>
                  <label htmlFor="headerCustomHtml" className={labelClasses}>
                    Custom header HTML (optional)
                  </label>
                  <textarea
                    id="headerCustomHtml"
                    value={settings.header.customHtml ?? ''}
                    onChange={(e) => updateHeader({ customHtml: e.target.value })}
                    className={inputClasses + ' min-h-[80px] resize-y'}
                    placeholder="e.g. &lt;a href=&quot;/contact&quot;&gt;Contact&lt;/a&gt;"
                    rows={3}
                  />
                </div>
              </div>
            </Section>

            {/* Footer */}
            <Section title="Footer" icon={FileText}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="footerText" className={labelClasses}>
                    Footer text
                  </label>
                  <textarea
                    id="footerText"
                    value={settings.footer.text ?? ''}
                    onChange={(e) => updateFooter({ text: e.target.value })}
                    className={inputClasses + ' min-h-[80px] resize-y'}
                    placeholder="Optional footer content"
                    rows={3}
                  />
                </div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.footer.showCopyright}
                    onChange={(e) => updateFooter({ showCopyright: e.target.checked })}
                    className="h-4 w-4 rounded border-mist-300 text-mist-600 focus:ring-mist-500"
                  />
                  <span className="text-sm font-medium text-mist-700">Show copyright line</span>
                </label>
                <div>
                  <label htmlFor="copyrightText" className={labelClasses}>
                    Copyright text
                  </label>
                  <input
                    id="copyrightText"
                    type="text"
                    value={settings.footer.copyrightText ?? ''}
                    onChange={(e) => updateFooter({ copyrightText: e.target.value })}
                    className={inputClasses}
                    placeholder="© {year} All rights reserved."
                  />
                  <p className="mt-1 text-xs text-mist-500">
                    Use {'{year}'} for current year.
                  </p>
                </div>
              </div>
            </Section>

            {/* Navigation */}
            <Section title="Navigation" icon={Menu}>
              <p className="mb-4 text-sm text-mist-600">
                Links shown in the header. Order determines display order. Label and URL are required for each link to appear.
              </p>
              <div className="space-y-3">
                {(settings.navigation.items ?? []).map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-mist-200 bg-mist-50/50 p-3"
                  >
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateNavItem(i, 'label', e.target.value)}
                      className={inputClasses + ' flex-1 min-w-[120px]'}
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateNavItem(i, 'url', e.target.value)}
                      className={inputClasses + ' flex-1 min-w-[140px]'}
                      placeholder="/ or /pages"
                    />
                    <button
                      type="button"
                      onClick={() => removeNavItem(i)}
                      className="rounded-lg p-2 text-mist-500 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addNavItem}
                  className="inline-flex items-center gap-2 rounded-xl border border-dashed border-mist-300 bg-white px-4 py-2.5 text-sm font-medium text-mist-600 transition hover:border-mist-500 hover:bg-mist-100 hover:text-mist-800 dark:border-mist-600 dark:bg-mist-800 dark:text-mist-300 dark:hover:bg-mist-700 dark:hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add link
                </button>
              </div>
            </Section>

            <div className="flex flex-wrap items-center gap-3 border-t border-mist-100 pt-6">
              <button type="submit" disabled={saving} className={btnPrimary}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save settings
                  </>
                )}
              </button>
              <Link href={adminPath} className={btnSecondary}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-mist-950 dark:text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist-200 text-mist-700 dark:bg-mist-800 dark:text-mist-300">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      <div className="ml-11">{children}</div>
    </section>
  )
}
