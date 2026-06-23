import { NextResponse } from 'next/server'
import { getCmsConfigCached } from '@/lib/cms'

export async function GET() {
  try {
    const config = await getCmsConfigCached()
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Failed to load config' }, { status: 500 })
  }
}
