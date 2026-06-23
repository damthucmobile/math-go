import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { listMedia, listMediaAsync, addMedia, getUploadsDir } from '@/lib/media'
import { useBlobStorage } from '@/lib/cms-blob'
import { triggerVercelDeploy } from '@/lib/deploy-hook'

export async function GET() {
  try {
    const items = useBlobStorage() ? await listMediaAsync() : listMedia()
    return NextResponse.json(items)
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    if (process.env.NODE_ENV === 'production') {
      console.error('GET /api/media:', err.message)
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

function safeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
  const ext = path.extname(base) || ''
  const stem = base.slice(0, base.length - ext.length) || 'upload'
  return `${stem}-${Date.now()}${ext}`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing or invalid file' }, { status: 400 })
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }
    const alt = (formData.get('alt') as string)?.trim() || undefined
    const caption = (formData.get('caption') as string)?.trim() || undefined
    const filename = safeFilename(file.name)

    let url: string
    if (useBlobStorage()) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`uploads/${filename}`, file, {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false,
        allowOverwrite: true,
      })
      url = blob.url
    } else {
      const dir = getUploadsDir()
      const filePath = path.join(dir, filename)
      const bytes = await file.arrayBuffer()
      fs.writeFileSync(filePath, Buffer.from(bytes))
      url = `/uploads/${filename}`
    }

    const item = await addMedia({ url, alt, caption, filename })
    await triggerVercelDeploy()
    return NextResponse.json(item)
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    if (process.env.NODE_ENV === 'production') {
      console.error('POST /api/media:', err.message)
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
