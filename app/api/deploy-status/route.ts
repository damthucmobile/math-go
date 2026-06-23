import { NextResponse } from 'next/server'
import { isDeployingAsync } from '@/lib/deploy-status'

/** GET /api/deploy-status – returns { deploying: boolean }. Admin polls this to lock editing until deploy completes. */
export async function GET() {
  const deploying = await isDeployingAsync()
  return NextResponse.json({ deploying })
}
