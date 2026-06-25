import fs from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'
import { withFileLock } from '@/lib/file-lock'
import { getProjectRoot } from '@/lib/project-root'
import { useBlobStorage, getBlobDataFile, setBlobDataFile } from '@/lib/cms-blob'
import type { JsonValue } from '@/types/json'

const PROJECT_ROOT = getProjectRoot()
const CONFIG_PATH = path.join(PROJECT_ROOT, 'pages.json')
const DATA_DIR = path.join(PROJECT_ROOT, 'data')

export type FieldType = 'text' | 'textarea' | 'number' | 'richtext'

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  required?: boolean
}

export interface TableConfig {
  id: string
  name: string
  singularName: string
  description?: string
  file: string
  single: boolean
  fields: FieldConfig[]
}

export interface CmsConfig {
  tables: TableConfig[]
}

// Optional metadata (roadmap: document sidebar, block editor)
export type ContentBlock = {
  type: string
  id: string
  content?: string
  level?: number
  src?: string
  alt?: string
  caption?: string
  listType?: 'bullet' | 'ordered'
  items?: string[]
  /** When type is 'component', reference to a component template (data comes from page/post context). */
  componentId?: number
  [key: string]: string | number | string[] | undefined
}

export type FeaturedImage = { url: string; alt?: string } | null

const DEFAULT_CMS_CONFIG: CmsConfig = { tables: [] }

export function getCmsConfig(): CmsConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return DEFAULT_CMS_CONFIG
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as CmsConfig
    return parsed?.tables ? parsed : DEFAULT_CMS_CONFIG
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getCmsConfig:', err)
    }
    return DEFAULT_CMS_CONFIG
  }
}

/** Cached config for API; revalidates every 60s to reduce disk reads. */
export function getCmsConfigCached(): Promise<CmsConfig> {
  return unstable_cache(async () => getCmsConfig(), ['cms-config'], { revalidate: 60 })()
}

/** Async read: from Blob when on Vercel (no fs fallback); local = fs. */
export async function getTableDataAsync(tableId: string): Promise<Record<string, JsonValue>[] | Record<string, JsonValue> | null> {
  if (!useBlobStorage()) return getTableData(tableId)
  const table = getTableConfig(tableId)
  if (!table) return null
  const raw = await getBlobDataFile(table.file)
  if (raw === null) {
    const toReturn = table.single ? {} : []
    await setBlobDataFile(table.file, JSON.stringify(toReturn))
    return toReturn as Record<string, JsonValue>[] | Record<string, JsonValue>
  }
  try {
    return JSON.parse(raw) as Record<string, JsonValue>[] | Record<string, JsonValue>
  } catch {
    if (table.single) return {}
    return []
  }
}

/** Cached table data for API; revalidates every 30s. Uses Blob when on Vercel. */
export function getTableDataCached(tableId: string): Promise<Record<string, JsonValue>[] | Record<string, JsonValue> | null> {
  return unstable_cache(async () => getTableDataAsync(tableId), ['cms-table', tableId], { revalidate: 30 })()
}

export function getTableConfig(tableId: string): TableConfig | null {
  const config = getCmsConfig()
  return config.tables.find((t) => t.id === tableId) ?? null
}

/** Resolves table data file path and ensures it stays under DATA_DIR (path traversal safety). */
function getTableFilePath(fileName: string): string {
  if (!fileName || fileName.includes('..')) {
    throw new Error('Invalid file name')
  }
  const resolved = path.resolve(DATA_DIR, fileName)
  const dataDirResolved = path.resolve(DATA_DIR)
  if (!resolved.startsWith(dataDirResolved) || resolved === dataDirResolved) {
    throw new Error('Invalid file path')
  }
  return resolved
}

/** Read data for a table. Single = one object, list = array of { id, ... }. */
export function getTableData(tableId: string): Record<string, JsonValue>[] | Record<string, JsonValue> | null {
  const table = getTableConfig(tableId)
  if (!table) return null
  const filePath = getTableFilePath(table.file)
  if (!fs.existsSync(filePath)) {
    if (table.single) return {}
    return []
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as Record<string, JsonValue>[] | Record<string, JsonValue>
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getTableData:', tableId, err)
    }
    if (table.single) return {}
    return []
  }
}

/** List records (for list tables). Returns array. Sync; use listRecordsAsync when on Vercel. */
export function listRecords(tableId: string): Record<string, JsonValue>[] {
  const data = getTableData(tableId)
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && !Array.isArray(data)) return [data]
  return []
}

/** Async list: uses Blob on Vercel (with seed from repo if empty). Use for frontend + admin on Vercel. */
export async function listRecordsAsync(tableId: string): Promise<Record<string, JsonValue>[]> {
  const data = await getTableDataAsync(tableId)
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && !Array.isArray(data)) return [data]
  return []
}

/** Get one record by id (list tables) or the single record (single tables). Sync; use getRecordAsync when on Vercel. */
export function getRecord(tableId: string, id?: string): Record<string, JsonValue> | null {
  const table = getTableConfig(tableId)
  if (!table) return null
  const data = getTableData(tableId)
  if (table.single) return data as Record<string, JsonValue> | null
  if (!Array.isArray(data)) return null
  const record = data.find((r) => String(r.id) === String(id))
  return record ?? null
}

/** Async get: uses Blob on Vercel (with seed from repo if empty). Use for frontend + admin on Vercel. */
export async function getRecordAsync(tableId: string, id?: string): Promise<Record<string, JsonValue> | null> {
  const table = getTableConfig(tableId)
  if (!table) return null
  const data = await getTableDataAsync(tableId)
  if (table.single) return data as Record<string, JsonValue> | null
  if (!Array.isArray(data)) return null
  const record = data.find((r) => String(r.id) === String(id))
  return record ?? null
}

const ALLOWED_BLOCK_TYPES = new Set([
  'paragraph', 'heading', 'image', 'list', 'quote', 'code', 'embed', 'separator', 'component'
])

function validateContentBlocks(raw: JsonValue): ContentBlock[] | undefined {
  if (raw === undefined || raw === null) return undefined
  if (!Array.isArray(raw)) throw new Error('content_blocks must be an array')
  return raw.map((item, i) => {
    if (!item || typeof item !== 'object') throw new Error(`content_blocks[${i}]: expected object`)
    const obj = item as Record<string, JsonValue>
    const type = obj.type
    const id = obj.id
    if (typeof type !== 'string' || !type.trim()) throw new Error(`content_blocks[${i}]: missing or invalid type`)
    if (typeof id !== 'string' || !id.trim()) throw new Error(`content_blocks[${i}]: missing or invalid id`)
    if (!ALLOWED_BLOCK_TYPES.has(type)) throw new Error(`content_blocks[${i}]: unknown block type "${type}"`)
    const block: ContentBlock = { type: type.trim(), id: String(id).trim() }
    if (typeof obj.content === 'string') block.content = obj.content
    if (typeof obj.level === 'number' && obj.level >= 1 && obj.level <= 6) block.level = obj.level
    if (typeof obj.src === 'string') block.src = obj.src
    if (typeof obj.alt === 'string') block.alt = obj.alt
    if (typeof obj.caption === 'string') block.caption = obj.caption
    if (obj.listType === 'bullet' || obj.listType === 'ordered') block.listType = obj.listType
    if (Array.isArray(obj.items)) block.items = obj.items.map((x) => String(x))
    if (type === 'embed') {
      if (typeof obj.service === 'string') block.service = obj.service
      if (typeof obj.embed === 'string') block.embed = obj.embed
      if (typeof obj.source === 'string') block.source = obj.source
    }
    if (type === 'component') {
      const n = typeof obj.componentId === 'number' ? obj.componentId : Number(obj.componentId)
      if (Number.isFinite(n) && n > 0) block.componentId = n
    }
    return block
  })
}

function validateFeaturedImage(raw: JsonValue): FeaturedImage | undefined {
  if (raw === undefined) return undefined
  if (raw === null) return null
  if (typeof raw !== 'object' || raw === null) throw new Error('featuredImage must be an object or null')
  const obj = raw as Record<string, JsonValue>
  const url = obj.url
  if (typeof url !== 'string' || !url.trim()) throw new Error('featuredImage.url must be a non-empty string')
  const result: FeaturedImage = { url: url.trim() }
  if (typeof obj.alt === 'string') result.alt = obj.alt
  return result
}

function validateStatus(raw: JsonValue): 'draft' | 'published' | undefined {
  if (raw === undefined || raw === null) return undefined
  const s = String(raw).toLowerCase()
  if (s === 'draft' || s === 'published') return s
  throw new Error('status must be "draft" or "published"')
}

/** Validate and sanitize body against table fields: only allowed keys, required present, basic types. */
function validateBody(
  body: Record<string, JsonValue>,
  table: TableConfig
): Record<string, JsonValue> {
  const out: Record<string, JsonValue> = {}
  for (const field of table.fields) {
    const raw = body[field.key]
    if (field.required && (raw === undefined || raw === null || String(raw).trim() === '')) {
      throw new Error(`Missing required field: ${field.label}`)
    }
    if (raw === undefined || raw === null) {
      out[field.key] = field.type === 'number' ? 0 : ''
      continue
    }
    switch (field.type) {
      case 'number':
        out[field.key] = Number(raw) || 0
        break
      case 'text':
        out[field.key] = typeof raw === 'string' ? raw : String(raw)
        break
      case 'textarea':
        out[field.key] = parseTextareaValue(raw)
        break
      case 'richtext':
        out[field.key] = typeof raw === 'string' ? raw : String(raw)
        break
      default:
        out[field.key] = String(raw)
    }
  }
  // Optional metadata (content_blocks, featuredImage, status, timestamps)
  const contentBlocks = validateContentBlocks(body.content_blocks)
  if (contentBlocks !== undefined) out.content_blocks = contentBlocks as JsonValue[]
  const featuredImage = validateFeaturedImage(body.featuredImage)
  if (featuredImage !== undefined) out.featuredImage = featuredImage
  const status = validateStatus(body.status)
  if (status !== undefined) out.status = status
  if (typeof body.createdAt === 'string' && body.createdAt.trim()) out.createdAt = body.createdAt.trim()
  if (typeof body.updatedAt === 'string' && body.updatedAt.trim()) out.updatedAt = body.updatedAt.trim()
  return out
}

function normalizeSlug(s: string): string {
  return String(s).trim().toLowerCase()
}

function parseTextareaValue(raw: JsonValue): JsonValue {
  if (typeof raw !== 'string') return raw
  const value = raw.trim()
  if (!value) return ''
  try {
    if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
      return JSON.parse(value)
    }
  } catch {
    // Keep the original string if it is not valid JSON.
  }
  return raw
}

/** Ensure slug is unique among other records (for tables that have a slug field). */
function assertSlugUnique(
  table: TableConfig,
  list: Record<string, JsonValue>[],
  currentId: string | number | undefined,
  sanitized: Record<string, JsonValue>
): void {
  const slugField = table.fields.find((f) => f.key === 'slug')
  if (!slugField) return
  const slugValue = sanitized.slug
  if (slugValue === undefined || slugValue === null || String(slugValue).trim() === '') return
  const normalized = normalizeSlug(String(slugValue))
  const others = currentId == null
    ? list
    : list.filter((r) => String(r.id) !== String(currentId))
  const duplicate = others.some((r) => normalizeSlug(String(r.slug ?? '')) === normalized)
  if (duplicate) throw new Error('Another record already uses this slug. Slugs must be unique.')
}

/** Create or update. For single table, id ignored. For list, id = update else create. Uses Blob on Vercel (read-only fs). */
export async function saveRecord(
  tableId: string,
  body: Record<string, JsonValue>,
  id?: string
): Promise<Record<string, JsonValue>> {
  const table = getTableConfig(tableId)
  if (!table) throw new Error('Table not found')
  const sanitized = validateBody(body, table)

  if (useBlobStorage()) {
    const data = await getTableDataAsync(tableId)
    if (table.single) {
      const payload = { id: 1, ...sanitized }
      await setBlobDataFile(table.file, JSON.stringify(payload, null, 2))
      return payload
    }
    let list: Record<string, JsonValue>[] = Array.isArray(data) ? data : data && typeof data === 'object' ? [data] : []
    const existingIndex = id ? list.findIndex((r) => String(r.id) === String(id)) : -1
    const nextId = list.length > 0 ? Math.max(...list.map((r) => Number(r.id) || 0)) + 1 : 1
    const now = new Date().toISOString()
    if (existingIndex >= 0) {
      const currentId = list[existingIndex].id as string | number | undefined
      assertSlugUnique(table, list, currentId, sanitized)
      const existing = list[existingIndex] as Record<string, JsonValue>
      const updated: Record<string, JsonValue> = {
        ...existing,
        ...sanitized,
        id: currentId,
        updatedAt: now
      }
      if (!existing.createdAt) updated.createdAt = now
      list[existingIndex] = updated
      await setBlobDataFile(table.file, JSON.stringify(list, null, 2))
      return list[existingIndex]
    }
    assertSlugUnique(table, list, undefined, sanitized)
    const newRecord: Record<string, JsonValue> = {
      id: nextId,
      ...sanitized,
      createdAt: now,
      updatedAt: now
    }
    list.push(newRecord)
    await setBlobDataFile(table.file, JSON.stringify(list, null, 2))
    return newRecord
  }

  const filePath = getTableFilePath(table.file)
  if (table.single) {
    const payload = { id: 1, ...sanitized }
    return withFileLock(filePath, () => {
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2))
      return payload
    })
  }

  return withFileLock(filePath, () => {
    let list: Record<string, JsonValue>[] = []
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const parsed = JSON.parse(raw) as Record<string, JsonValue>[]
        list = Array.isArray(parsed) ? parsed : []
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('saveRecord read:', filePath, err)
        }
      }
    }
    const existingIndex = id ? list.findIndex((r) => String(r.id) === String(id)) : -1
    const nextId = list.length > 0 ? Math.max(...list.map((r) => Number(r.id) || 0)) + 1 : 1
    const now = new Date().toISOString()
    if (existingIndex >= 0) {
      const currentId = list[existingIndex].id as string | number | undefined
      assertSlugUnique(table, list, currentId, sanitized)
      const existing = list[existingIndex] as Record<string, JsonValue>
      const updated: Record<string, JsonValue> = {
        ...existing,
        ...sanitized,
        id: currentId,
        updatedAt: now
      }
      if (!existing.createdAt) updated.createdAt = now
      list[existingIndex] = updated
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2))
      return list[existingIndex]
    }
    assertSlugUnique(table, list, undefined, sanitized)
    const newRecord: Record<string, JsonValue> = {
      id: nextId,
      ...sanitized,
      createdAt: now,
      updatedAt: now
    }
    list.push(newRecord)
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2))
    return newRecord
  })
}

/** Delete one record by id (list tables). For single table, clears to empty. Uses Blob on Vercel (read-only fs). */
export async function deleteRecord(tableId: string, id?: string): Promise<void> {
  const table = getTableConfig(tableId)
  if (!table) throw new Error('Table not found')

  if (useBlobStorage()) {
    if (table.single) {
      const empty: Record<string, JsonValue> = { id: 1 }
      table.fields.forEach((f) => (empty[f.key] = ''))
      await setBlobDataFile(table.file, JSON.stringify(empty, null, 2))
      return
    }
    if (!id) throw new Error('id required for list table')
    const data = await getTableDataAsync(tableId)
    let list: Record<string, JsonValue>[] = Array.isArray(data) ? data : []
    list = list.filter((r) => String(r.id) !== String(id))
    await setBlobDataFile(table.file, JSON.stringify(list, null, 2))
    return
  }

  const filePath = getTableFilePath(table.file)
  if (table.single) {
    const empty: Record<string, JsonValue> = { id: 1 }
    table.fields.forEach((f) => (empty[f.key] = ''))
    return withFileLock(filePath, () => {
      fs.writeFileSync(filePath, JSON.stringify(empty, null, 2))
    })
  }
  if (!id) throw new Error('id required for list table')
  return withFileLock(filePath, () => {
    let list: Record<string, JsonValue>[] = []
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8')
        const parsed = JSON.parse(raw) as Record<string, JsonValue>[]
        list = Array.isArray(parsed) ? parsed : []
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('deleteRecord read:', filePath, err)
        }
      }
    }
    list = list.filter((r) => String(r.id) !== String(id))
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2))
  })
}
