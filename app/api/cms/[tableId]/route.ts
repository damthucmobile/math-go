import { NextRequest, NextResponse } from 'next/server'
import { getTableConfig, getCmsConfigCached, getTableDataAsync, saveRecord, deleteRecord } from '@/lib/cms'
import { triggerVercelDeploy } from '@/lib/deploy-hook'

type Params = { params: Promise<{ tableId: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { tableId } = await params
  const config = await getCmsConfigCached()
  const table = config.tables.find((t) => t.id === tableId) ?? null
  if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 })
  const id = req.nextUrl.searchParams.get('id')
  const data = await getTableDataAsync(tableId)
  if (data === null) return NextResponse.json({ error: 'Table not found' }, { status: 404 })
  if (id) {
    const list = Array.isArray(data) ? data : [data]
    const record = list.find((r) => String(r.id) === id) ?? null
    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    return NextResponse.json(record)
  }
  const list = Array.isArray(data) ? data : data ? [data] : []
  return NextResponse.json(list)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { tableId } = await params
  const table = getTableConfig(tableId)
  if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 })
  try {
    const body = await req.json()
    const id = body.id != null ? String(body.id) : undefined
    const record = await saveRecord(tableId, body, id)
    await triggerVercelDeploy()
    return NextResponse.json(record)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Validation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { tableId } = await params
  const table = getTableConfig(tableId)
  if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 })
  const id = req.nextUrl.searchParams.get('id')
  try {
    await deleteRecord(tableId, id ?? undefined)
    await triggerVercelDeploy()
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Validation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
