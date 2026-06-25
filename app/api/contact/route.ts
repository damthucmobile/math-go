import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getProjectRoot } from '@/lib/project-root'
import { getRecordAsync } from '@/lib/cms'

const PROJECT_ROOT = getProjectRoot()
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'contact-submissions.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readSubmissions(): Array<Record<string, unknown>> {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return []
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSubmissions(items: Array<Record<string, unknown>>) {
  ensureDataDir()
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ họ tên, email và lời nhắn.' }, { status: 400 })
    }

    const contactConfig = (await getRecordAsync('contact')) ?? {}
    const payload = {
      name,
      phone,
      email,
      message,
      submittedAt: new Date().toISOString(),
      source: '/contact'
    }

    const submissions = readSubmissions()
    submissions.push(payload)
    writeSubmissions(submissions)

    const submitUrl = typeof body?.submitUrl === 'string' && body.submitUrl.trim()
      ? body.submitUrl.trim()
      : typeof contactConfig.submitUrl === 'string' && contactConfig.submitUrl.trim()
        ? contactConfig.submitUrl.trim()
        : process.env.CONTACT_FORM_WEBHOOK_URL || new URL('/api/contact-receiver', request.url).toString()

    if (submitUrl) {
      const submitMethod = typeof body?.submitMethod === 'string' && body.submitMethod.trim()
        ? body.submitMethod.trim().toUpperCase()
        : typeof contactConfig.submitMethod === 'string' && contactConfig.submitMethod.trim()
          ? contactConfig.submitMethod.trim().toUpperCase()
          : 'POST'

      try {
        const response = await fetch(submitUrl, {
          method: submitMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          console.warn(`Contact forward failed with status ${response.status}`)
        }
      } catch (forwardError) {
        console.warn('Contact forward skipped:', forwardError)
      }
    }

    return NextResponse.json({ success: true, saved: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể gửi tin nhắn'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
