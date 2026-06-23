import fs from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'
import { withFileLock } from '@/lib/file-lock'
import { getProjectRoot } from '@/lib/project-root'
import { useBlobStorage, getBlobDataFile, setBlobDataFile } from '@/lib/cms-blob'
import { isSafeHref } from '@/lib/url-utils'
import type { JsonValue } from '@/types/json'

const DATA_DIR = path.join(getProjectRoot(), 'data')
const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json')

export interface NavItem {
  label: string
  url: string
}

export interface HeaderSettings {
  showLogo: boolean
  showNav: boolean
  /** Optional custom HTML snippet for header (e.g. CTA button) */
  customHtml?: string
}

export interface FooterSettings {
  /** Main footer text or HTML */
  text?: string
  showCopyright: boolean
  copyrightText?: string
}

export interface SiteSettings {
  siteTitle: string
  tagline?: string
  logoUrl?: string
  /** Optional announcement bar above navbar (text + link) */
  announcementText?: string
  announcementUrl?: string
  header: HeaderSettings
  footer: FooterSettings
  navigation: { items: NavItem[] }
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'My Site',
  tagline: '',
  logoUrl: '',
  announcementText: '',
  announcementUrl: '',
  header: {
    showLogo: true,
    showNav: true,
    customHtml: ''
  },
  footer: {
    text: '',
    showCopyright: true,
    copyrightText: '© {year} All rights reserved.'
  },
  navigation: {
    items: [
      { label: 'Home', url: '/' },
      { label: 'Pages', url: '/pages' },
      { label: 'Posts', url: '/posts' }
    ]
  }
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function parseNavItem(raw: JsonValue): NavItem {
  if (raw && typeof raw === 'object' && 'label' in raw && 'url' in raw) {
    const o = raw as { label: JsonValue; url: JsonValue }
    const url = typeof o.url === 'string' ? o.url.trim() : '/'
    return {
      label: typeof o.label === 'string' ? o.label.trim() : '',
      url: isSafeHref(url) ? url : '/'
    }
  }
  return { label: '', url: '/' }
}

function parseHeader(raw: JsonValue): HeaderSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS.header
  const o = raw as Record<string, JsonValue>
  return {
    showLogo: o.showLogo !== false,
    showNav: o.showNav !== false,
    customHtml: typeof o.customHtml === 'string' ? o.customHtml : ''
  }
}

function parseFooter(raw: JsonValue): FooterSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS.footer
  const o = raw as Record<string, JsonValue>
  return {
    text: typeof o.text === 'string' ? o.text : '',
    showCopyright: o.showCopyright !== false,
    copyrightText: typeof o.copyrightText === 'string' ? o.copyrightText : DEFAULT_SETTINGS.footer.copyrightText
  }
}

/** Read settings from fs. Returns defaults if file missing or invalid. */
function getSettingsFromFs(): SiteSettings {
  if (!fs.existsSync(SETTINGS_PATH)) {
    return { ...DEFAULT_SETTINGS }
  }
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
    return parseSettingsRaw(raw)
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function parseSettingsRaw(raw: string): SiteSettings {
  const data = JSON.parse(raw) as Record<string, JsonValue>
  const siteTitle = typeof data.siteTitle === 'string' ? data.siteTitle.trim() : DEFAULT_SETTINGS.siteTitle
  const tagline = typeof data.tagline === 'string' ? data.tagline.trim() : DEFAULT_SETTINGS.tagline
  const logoUrl = typeof data.logoUrl === 'string' ? data.logoUrl.trim() : DEFAULT_SETTINGS.logoUrl
  const announcementText = typeof data.announcementText === 'string' ? data.announcementText.trim() : ''
  const rawAnnouncementUrl = typeof data.announcementUrl === 'string' ? data.announcementUrl.trim() : ''
  const announcementUrl = isSafeHref(rawAnnouncementUrl) ? rawAnnouncementUrl : ''
  const header = parseHeader(data.header)
  const footer = parseFooter(data.footer)
  const navRaw = data.navigation
  let items: NavItem[] = DEFAULT_SETTINGS.navigation.items
  if (navRaw && typeof navRaw === 'object' && Array.isArray((navRaw as { items?: JsonValue[] }).items)) {
    items = ((navRaw as { items: JsonValue[] }).items).map(parseNavItem).filter((i) => i.label || i.url)
  }
  return {
    siteTitle: siteTitle || DEFAULT_SETTINGS.siteTitle,
    tagline: tagline ?? '',
    logoUrl: logoUrl ?? '',
    announcementText: announcementText ?? '',
    announcementUrl: announcementUrl ?? '',
    header,
    footer,
    navigation: { items }
  }
}

async function getSettingsFromBlob(): Promise<SiteSettings> {
  const raw = await getBlobDataFile('settings.json')
  if (!raw) {
    const defaults = { ...DEFAULT_SETTINGS }
    await setBlobDataFile('settings.json', JSON.stringify(defaults, null, 2))
    return defaults
  }
  try {
    return parseSettingsRaw(raw)
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

const getSettingsCached = unstable_cache(
  async () => (useBlobStorage() ? getSettingsFromBlob() : getSettingsFromFs()),
  ['settings'],
  { revalidate: 60 }
)

export async function getSettings(): Promise<SiteSettings> {
  return getSettingsCached()
}

/** Validate and sanitize incoming settings from API. */
export function validateSettings(body: Record<string, JsonValue>): SiteSettings {
  const siteTitle = typeof body.siteTitle === 'string' ? body.siteTitle.trim() : DEFAULT_SETTINGS.siteTitle
  if (!siteTitle) {
    throw new Error('Site title is required.')
  }
  const tagline = typeof body.tagline === 'string' ? body.tagline.trim() : ''
  const logoUrl = typeof body.logoUrl === 'string' ? body.logoUrl.trim() : ''
  const announcementText = typeof body.announcementText === 'string' ? body.announcementText.trim() : ''
  const rawAnnouncementUrl = typeof body.announcementUrl === 'string' ? body.announcementUrl.trim() : ''
  const announcementUrl = isSafeHref(rawAnnouncementUrl) ? rawAnnouncementUrl : ''
  const header = parseHeader(body.header)
  const footer = parseFooter(body.footer)
  let items: NavItem[] = DEFAULT_SETTINGS.navigation.items
  if (body.navigation && typeof body.navigation === 'object' && Array.isArray((body.navigation as { items?: JsonValue[] }).items)) {
    items = ((body.navigation as { items: JsonValue[] }).items).map(parseNavItem).filter((i) => i.label || i.url)
  }
  return {
    siteTitle: siteTitle || DEFAULT_SETTINGS.siteTitle,
    tagline,
    logoUrl,
    announcementText,
    announcementUrl,
    header,
    footer,
    navigation: { items }
  }
}

/** Write settings to data/settings.json (or Blob on Vercel). */
export async function saveSettings(settings: SiteSettings): Promise<void> {
  if (useBlobStorage()) {
    await setBlobDataFile('settings.json', JSON.stringify(settings, null, 2))
    return
  }
  ensureDataDir()
  return withFileLock(SETTINGS_PATH, () => {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8')
  })
}
