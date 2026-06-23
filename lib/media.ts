import fs from 'fs'
import path from 'path'
import { withFileLock } from '@/lib/file-lock'
import { getProjectRoot } from '@/lib/project-root'
import { useBlobStorage, getBlobDataFile, setBlobDataFile } from '@/lib/cms-blob'

const PROJECT_ROOT = getProjectRoot()
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const MEDIA_FILE = path.join(DATA_DIR, 'media.json')
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'public', 'uploads')

export interface MediaItem {
  id: number
  url: string
  alt?: string
  caption?: string
  filename: string
}

function getMediaListFromFs(): MediaItem[] {
  if (!fs.existsSync(MEDIA_FILE)) return []
  try {
    const raw = fs.readFileSync(MEDIA_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getMediaList:', err)
    }
    return []
  }
}

async function getMediaListFromBlob(): Promise<MediaItem[]> {
  const raw = await getBlobDataFile('media.json')
  if (!raw) {
    const empty: MediaItem[] = []
    await setBlobDataFile('media.json', JSON.stringify(empty, null, 2))
    return empty
  }
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function listMedia(): MediaItem[] {
  return getMediaListFromFs()
}

/** Async list for API when using Blob (Vercel read-only fs). */
export async function listMediaAsync(): Promise<MediaItem[]> {
  if (useBlobStorage()) return getMediaListFromBlob()
  return getMediaListFromFs()
}

export async function addMedia(item: Omit<MediaItem, 'id'>): Promise<MediaItem> {
  if (useBlobStorage()) {
    const list = await getMediaListFromBlob()
    const nextId = list.length > 0 ? Math.max(...list.map((m) => m.id)) + 1 : 1
    const newItem: MediaItem = { ...item, id: nextId }
    list.push(newItem)
    await setBlobDataFile('media.json', JSON.stringify(list, null, 2))
    return newItem
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  return withFileLock(MEDIA_FILE, () => {
    const list = getMediaListFromFs()
    const nextId = list.length > 0 ? Math.max(...list.map((m) => m.id)) + 1 : 1
    const newItem: MediaItem = { ...item, id: nextId }
    list.push(newItem)
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(list, null, 2))
    return newItem
  })
}

export function getUploadsDir(): string {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  return UPLOADS_DIR
}
