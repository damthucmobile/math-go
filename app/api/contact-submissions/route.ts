import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getProjectRoot } from '@/lib/project-root'

const PROJECT_ROOT = getProjectRoot()
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'contact-submissions.json')

const VALID_STATUSES = ['pending', 'replied', 'rejected'] as const

type SubmissionStatus = (typeof VALID_STATUSES)[number]

type ContactSubmission = {
  id: string
  name: string
  phone: string
  email: string
  message: string
  submittedAt: string
  source?: string
  status: SubmissionStatus
  updatedAt?: string
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function normalizeStatus(value: unknown): SubmissionStatus {
  return typeof value === 'string' && VALID_STATUSES.includes(value as SubmissionStatus)
    ? (value as SubmissionStatus)
    : 'pending'
}

function normalizeSubmission(item: Record<string, unknown>, index: number): ContactSubmission {
  const timestamp = typeof item.submittedAt === 'string' && item.submittedAt.trim()
    ? item.submittedAt
    : new Date().toISOString()

  return {
    id: typeof item.id === 'string' && item.id.trim()
      ? item.id.trim()
      : `submission-${index + 1}`,
    name: typeof item.name === 'string' ? item.name : '',
    phone: typeof item.phone === 'string' ? item.phone : '',
    email: typeof item.email === 'string' ? item.email : '',
    message: typeof item.message === 'string' ? item.message : '',
    submittedAt: timestamp,
    source: typeof item.source === 'string' ? item.source : '/contact',
    status: normalizeStatus(item.status),
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined
  }
}

function readSubmissions(): ContactSubmission[] {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return []

  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8')
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    return parsed.map((item, index) => normalizeSubmission((item ?? {}) as Record<string, unknown>, index))
  } catch {
    return []
  }
}

function writeSubmissions(items: ContactSubmission[]) {
  ensureDataDir()
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function GET() {
  const submissions = readSubmissions().sort((a, b) => {
    const aTime = new Date(a.submittedAt).getTime()
    const bTime = new Date(b.submittedAt).getTime()
    return bTime - aTime
  })

  return NextResponse.json(submissions)
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const id = typeof body?.id === 'string' ? body.id : ''
    const nextStatus = normalizeStatus(body?.status)

    if (!id || !VALID_STATUSES.includes(nextStatus)) {
      return NextResponse.json({ error: 'Thiếu thông tin trạng thái cần cập nhật.' }, { status: 400 })
    }

    const submissions = readSubmissions()
    const target = submissions.find((item) => item.id === id)

    if (!target) {
      return NextResponse.json({ error: 'Không tìm thấy submission.' }, { status: 404 })
    }

    target.status = nextStatus
    target.updatedAt = new Date().toISOString()
    writeSubmissions(submissions)

    return NextResponse.json({ success: true, submission: target })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể cập nhật trạng thái.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
