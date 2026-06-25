import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getProjectRoot } from '@/lib/project-root'

const PROJECT_ROOT = getProjectRoot()
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const RECEIVER_FILE = path.join(DATA_DIR, 'contact-receiver-log.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readItems(): Array<Record<string, unknown>> {
  if (!fs.existsSync(RECEIVER_FILE)) return []

  try {
    const raw = fs.readFileSync(RECEIVER_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeItems(items: Array<Record<string, unknown>>) {
  ensureDataDir()
  fs.writeFileSync(RECEIVER_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

async function readPayload(request: Request) {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      return await request.json()
    } catch {
      return null
    }
  }

  try {
    const formData = await request.formData()
    const result: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        result[key] = value
      }
    })
    return result
  } catch {
    return null
  }
}

export async function GET() {
  const items = readItems()
  return NextResponse.json({ success: true, count: items.length, items: items.slice(-10) })
}

export async function POST(request: Request) {
  try {
    const payload = await readPayload(request)
    const entry = {
      ...(payload && typeof payload === 'object' ? payload : {}),
      receivedAt: new Date().toISOString(),
      source: '/api/contact-receiver'
    }

    const items = readItems()
    items.push(entry)
    writeItems(items)

    return NextResponse.json({ success: true, received: true, savedTo: 'data/contact-receiver-log.json' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể nhận dữ liệu'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
