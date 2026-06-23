import { NextRequest, NextResponse } from 'next/server'
import { getSettings, saveSettings, validateSettings } from '@/lib/settings'
import { triggerVercelDeploy } from '@/lib/deploy-hook'
import type { JsonValue } from '@/types/json'

/** GET /api/settings – public (used by front-end layout). */
export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

/** PUT /api/settings – protected by middleware (admin only). */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const settings = validateSettings(body as Record<string, JsonValue>)
    await saveSettings(settings)
    await triggerVercelDeploy()
    return NextResponse.json(settings)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Validation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
