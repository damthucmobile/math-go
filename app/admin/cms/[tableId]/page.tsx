'use client'

import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  Plus,
  Loader2,
  Table2,
  Pencil,
  Trash2,
  Copy,
  Save,
  Eraser,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { getApiUrl, getAdminPath, inputClasses, labelClasses, btnPrimary, btnSecondary, btnDanger } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import type { TableConfig, ContentBlock } from '@/lib/cms'
import type { JsonValue } from '@/types/json'
import { htmlToSingleBlock, ourBlocksToHtml } from '@/lib/block-editor-adapter'
import { BlockEditorPlaceholder } from '@/app/components/BlockEditorPlaceholder'
import { SkeletonList } from '@/app/components/Skeleton'

const BlockEditor = dynamic(
  () => import('@/app/components/BlockEditor').then((m) => m.BlockEditor),
  { ssr: false, loading: BlockEditorPlaceholder }
)

type SortDir = 'asc' | 'desc'

function formatFieldValue(value: JsonValue | undefined): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function parseFieldValue(value: string, fieldType?: string): JsonValue {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (fieldType === 'textarea') {
    try {
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        return JSON.parse(trimmed)
      }
    } catch {
      // Fall back to the raw string value.
    }
  }
  return value
}

export default function CmsTablePage() {
  const params = useParams()
  const tableId = params.tableId as string
  const [table, setTable] = useState<TableConfig | null>(null)
  const [records, setRecords] = useState<Record<string, JsonValue>[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [resizingColumn, setResizingColumn] = useState<{ key: string; startX: number; startWidth: number } | null>(null)

  const adminPath = getAdminPath()
  const api = getApiUrl()
  const { setDeployingTrue } = useDeployStatus()

  useEffect(() => {
    Promise.all([
      fetch(`${api}/api/cms/config`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${api}/api/cms/${tableId}`, { credentials: 'include' }).then((r) => r.json())
    ])
      .then(([config, data]) => {
        const t = config.tables?.find((x: TableConfig) => x.id === tableId) ?? null
        setTable(t)
        setRecords(Array.isArray(data) ? data : data ? [data] : [])
      })
      .finally(() => setLoading(false))
  }, [tableId, api])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      if (event.target.closest('[data-action-menu]')) return
      setOpenActionMenuId(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!resizingColumn) return

    const handleMouseMove = (event: MouseEvent) => {
      const nextWidth = Math.max(90, resizingColumn.startWidth + event.clientX - resizingColumn.startX)
      setColumnWidths((prev) => ({ ...prev, [resizingColumn.key]: nextWidth }))
    }

    const handleMouseUp = () => {
      setResizingColumn(null)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [resizingColumn])

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this record?')) return
    const res = await fetch(`${api}/api/cms/${tableId}?id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (res.ok) {
      setDeployingTrue()
      setRecords((prev) => prev.filter((r) => String(r.id) !== String(id)))
      setSelectedIds((s) => {
        const next = new Set(s)
        next.delete(String(id))
        return next
      })
    } else {
      setMessage({ type: 'error', text: 'Delete failed' })
    }
  }

  const filteredAndSortedRecords = useMemo(() => {
    if (!table) return []
    const q = search.trim().toLowerCase()
    let list = q
      ? records.filter((r) => {
          const title = String(r.title ?? r.slug ?? '').toLowerCase()
          const slug = String(r.slug ?? '').toLowerCase()
          return title.includes(q) || slug.includes(q)
        })
      : [...records]
    const key = sortKey ?? table.fields[0]?.key
    if (key) {
      list = [...list].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]
        const aStr = aVal != null ? String(aVal) : ''
        const bStr = bVal != null ? String(bVal) : ''
        if (key === 'updatedAt' || key === 'createdAt') {
          const aNum = aVal ? new Date(aVal as string).getTime() : 0
          const bNum = bVal ? new Date(bVal as string).getTime() : 0
          return sortDir === 'asc' ? aNum - bNum : bNum - aNum
        }
        const cmp = aStr.localeCompare(bStr, undefined, { sensitivity: 'base' })
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return list
  }, [table, records, search, sortKey, sortDir])

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedRecords.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(
        new Set(filteredAndSortedRecords.map((r) => String(r.id)))
      )
    }
  }

  const toggleSelectOne = (id: string | number) => {
    const sid = String(id)
    setSelectedIds((s) => {
      const next = new Set(s)
      if (next.has(sid)) next.delete(sid)
      else next.add(sid)
      return next
    })
  }

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return
    setShowBulkDeleteModal(true)
  }

  const getColumnWidth = (key: string) => {
    if (key === 'checkbox') return columnWidths[key] ?? 48
    if (key === 'actions') return columnWidths[key] ?? 96
    return columnWidths[key] ?? 180
  }

  const startResize = (key: string, event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setResizingColumn({
      key,
      startX: event.clientX,
      startWidth: getColumnWidth(key)
    })
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return
    setMessage(null)
    setBulkDeleting(true)
    setShowBulkDeleteModal(false)
    try {
      const results = await Promise.allSettled(
        Array.from(selectedIds).map((id) =>
          fetch(`${api}/api/cms/${tableId}?id=${id}`, { method: 'DELETE', credentials: 'include' })
        )
      )
      const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !(r.value as Response).ok))
      if (failed.length > 0) {
        setMessage({ type: 'error', text: failed.length === results.length ? 'Deletions failed' : 'Some deletions failed' })
      } else {
        setDeployingTrue()
        setRecords((prev) => prev.filter((r) => !selectedIds.has(String(r.id))))
        setSelectedIds(new Set())
      }
    } catch {
      setMessage({ type: 'error', text: 'Some deletions failed' })
    } finally {
      setBulkDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-9 w-48 animate-pulse rounded-lg bg-mist-200 dark:bg-mist-800" aria-hidden />
            <div className="h-10 w-32 animate-pulse rounded-xl bg-mist-200 dark:bg-mist-800" aria-hidden />
          </div>
          <SkeletonList rows={8} className="rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <p className="text-sm text-mist-500">Table not found.</p>
      </div>
    )
  }

  if (table.single) {
    const record = records[0] ?? {}
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold tracking-normal text-mist-950">{table.name}</h1>
          <p className="mt-1 text-mist-500">Edit the single record for this section.</p>
          {message && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${message.type === 'error' ? 'border border-red-200 bg-red-50 text-red-800' : 'border border-green-200 bg-green-50 text-green-800'}`}
              role="alert"
            >
              {message.text}
            </div>
          )}
          <div className="mt-8 rounded-2xl border border-mist-200 bg-white p-8 shadow-sm dark:border-mist-700 dark:bg-mist-900/30">
            <SingleRecordForm tableId={tableId} table={table} initialRecord={record} onMessage={setMessage} onDeployStarted={setDeployingTrue} />
          </div>
        </div>
      </div>
    )
  }

  const displayKeys = table.fields
    .filter(
      (f) =>
        !(tableId === 'posts' && (f.key === 'content' || f.key === 'excerpt')) &&
        !(tableId === 'pages' && f.key === 'body') &&
        !(tableId === 'components' && f.key === 'content') &&
        !(tableId === 'posts' && f.key === 'heroComponentId') &&
        !(tableId === 'pages' && f.key === 'heroComponentId') &&
        !(tableId === 'posts' && f.key === 'sectionData') &&
        !(tableId === 'pages' && f.key === 'sectionData')
    )
    .map((f) => f.key)
  const viewUrl = (record: Record<string, JsonValue>) =>
    tableId === 'posts'
      ? `/posts/${record.id}`
      : tableId === 'pages' && record.slug
        ? `/pages/${encodeURIComponent(String(record.slug))}`
        : null
  const detailUrl = (record: Record<string, JsonValue>) =>
    tableId === 'tutors'
      ? `/tutors/${encodeURIComponent(String(record.id ?? ''))}`
      : null
  const hasUpdatedAt = table.fields.some((f) => f.key === 'updatedAt') ||
    records.some((r) => r.updatedAt != null)
  const hasCreatedAt = (tableId === 'posts' || tableId === 'pages' || tableId === 'components') &&
    (table.fields.some((f) => f.key === 'createdAt') || records.some((r) => r.createdAt != null))
  const sortKeys = [...displayKeys]
  if (hasCreatedAt && !sortKeys.includes('createdAt')) sortKeys.push('createdAt')
  if (hasUpdatedAt && !sortKeys.includes('updatedAt')) sortKeys.push('updatedAt')
  const hasStatus = tableId === 'posts' || tableId === 'pages'

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-mist-950">{table.name}</h1>
            <p className="mt-1 text-mist-500">
              {filteredAndSortedRecords.length} {filteredAndSortedRecords.length === 1 ? 'item' : 'items'}
              {search.trim() && ` (filtered from ${records.length})`}
            </p>
          </div>
          <Link href={`${adminPath}/cms/${tableId}/new`} className={btnPrimary}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add {table.singularName}
          </Link>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.type === 'error' ? 'border border-red-200 bg-red-50 text-red-800' : 'border border-green-200 bg-green-50 text-green-800'}`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" />
            <input
              type="search"
              placeholder="Search by title or slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-10 pr-4 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-500/20 dark:border-mist-700 dark:bg-mist-900/50 dark:text-white dark:placeholder-mist-500"
              aria-label="Search records"
            />
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-mist-300 bg-mist-100 px-4 py-2 dark:border-mist-600 dark:bg-mist-800/50">
              <span className="text-sm font-medium text-mist-800 dark:text-mist-200">
                {selectedIds.size} selected
              </span>
              <button
                type="button"
                onClick={handleBulkDeleteClick}
                disabled={bulkDeleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {bulkDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-sm font-medium text-mist-700 hover:underline dark:text-mist-300"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm dark:border-mist-700 dark:bg-mist-900/30">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mist-100 text-mist-400">
                <Table2 className="h-8 w-8" />
              </div>
              <p className="mt-4 text-center font-medium text-mist-700">No records yet</p>
              <p className="mt-1 text-center text-sm text-mist-500">
                Get started by creating your first {table.singularName.toLowerCase()}.
              </p>
              <Link
                href={`${adminPath}/cms/${tableId}/new`}
                className={btnPrimary + ' mt-6'}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add {table.singularName}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed" role="table" aria-label={`${table.name} records`}>
                <caption className="sr-only">
                  {table.name}: {filteredAndSortedRecords.length} items
                </caption>
                <thead>
                  <tr className="border-b border-mist-200 bg-mist-50 dark:border-mist-700 dark:bg-mist-800/50">
                    <th scope="col" className="relative px-4 py-3" style={{ width: getColumnWidth('checkbox') }}>
                      <input
                        type="checkbox"
                        checked={
                          filteredAndSortedRecords.length > 0 &&
                          selectedIds.size === filteredAndSortedRecords.length
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-mist-300 text-mist-600 focus:ring-mist-500"
                        aria-label="Select all"
                      />
                    </th>
                    {displayKeys.map((key) => {
                      const isSortable = sortKeys.includes(key)
                      const isActive = sortKey === key
                      return (
                        <th
                          key={key}
                          scope="col"
                          className="relative px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist-500"
                          style={{ width: getColumnWidth(key) }}
                        >
                          <div className="flex items-center justify-between gap-2 pr-3">
                            {isSortable ? (
                              <button
                                type="button"
                                onClick={() => toggleSort(key)}
                                className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-mist-600 hover:text-mist-950 dark:hover:text-white dark:text-mist-400 dark:hover:text-white"
                              >
                                {table.fields.find((f) => f.key === key)?.label ?? key}
                                {isActive ? (
                                  sortDir === 'asc' ? (
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  ) : (
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  )
                                ) : (
                                  <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                                )}
                              </button>
                            ) : (
                              <span>{table.fields.find((f) => f.key === key)?.label ?? key}</span>
                            )}
                            <button
                              type="button"
                              onMouseDown={(event) => startResize(key, event)}
                              className="absolute inset-y-0 right-0 w-3 cursor-col-resize"
                              aria-label={`Resize ${table.fields.find((f) => f.key === key)?.label ?? key}`}
                            />
                          </div>
                        </th>
                      )
                    })}
                    {hasCreatedAt && (
                      <th scope="col" className="relative px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist-500" style={{ width: getColumnWidth('createdAt') }}>
                        <div className="flex items-center justify-between gap-2 pr-3">
                          <button
                            type="button"
                            onClick={() => toggleSort('createdAt')}
                            className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider hover:text-mist-950 dark:hover:text-white ${
                              sortKey === 'createdAt' ? 'text-mist-950 dark:text-white' : 'text-mist-600 dark:text-mist-400'
                            }`}
                          >
                            Created
                            {sortKey === 'createdAt' ? (
                              sortDir === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </button>
                          <button
                            type="button"
                            onMouseDown={(event) => startResize('createdAt', event)}
                            className="absolute inset-y-0 right-0 w-3 cursor-col-resize"
                            aria-label="Resize Created"
                          />
                        </div>
                      </th>
                    )}
                    {hasUpdatedAt && (
                      <th scope="col" className="relative px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist-500" style={{ width: getColumnWidth('updatedAt') }}>
                        <div className="flex items-center justify-between gap-2 pr-3">
                          <button
                            type="button"
                            onClick={() => toggleSort('updatedAt')}
                            className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider hover:text-mist-950 dark:hover:text-white ${
                              sortKey === 'updatedAt' ? 'text-mist-950 dark:text-white' : 'text-mist-600 dark:text-mist-400'
                            }`}
                          >
                            Updated
                            {sortKey === 'updatedAt' ? (
                              sortDir === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </button>
                          <button
                            type="button"
                            onMouseDown={(event) => startResize('updatedAt', event)}
                            className="absolute inset-y-0 right-0 w-3 cursor-col-resize"
                            aria-label="Resize Updated"
                          />
                        </div>
                      </th>
                    )}
                    {hasStatus && (
                      <th scope="col" className="relative px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist-500" style={{ width: getColumnWidth('status') }}>
                        <div className="flex items-center justify-between gap-2 pr-3">
                          <span>Status</span>
                          <button
                            type="button"
                            onMouseDown={(event) => startResize('status', event)}
                            className="absolute inset-y-0 right-0 w-3 cursor-col-resize"
                            aria-label="Resize Status"
                          />
                        </div>
                      </th>
                    )}
                    <th scope="col" className="relative px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-mist-500" style={{ width: getColumnWidth('actions') }}>
                      <div className="flex items-center justify-end gap-2 pr-3">
                        <span>Actions</span>
                        <button
                          type="button"
                          onMouseDown={(event) => startResize('actions', event)}
                          className="absolute inset-y-0 right-0 w-3 cursor-col-resize"
                          aria-label="Resize Actions"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100 dark:divide-mist-800">
                  {filteredAndSortedRecords.map((record) => {
                    const id = record.id as string | number
                    const sid = String(id)
                    const isSelected = selectedIds.has(sid)
                    return (
                      <tr
                        key={sid}
                        className={`transition ${isSelected ? 'bg-mist-100/50 dark:bg-mist-800/50' : 'hover:bg-mist-50/50 dark:hover:bg-mist-800/30'}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(id)}
                            className="h-4 w-4 rounded border-mist-300 text-mist-600 focus:ring-mist-500"
                            aria-label={`Select ${record.title ?? sid}`}
                          />
                        </td>
                        {displayKeys.map((key) => (
                          <td key={key} className="px-4 py-3 text-sm text-mist-700" style={{ width: getColumnWidth(key) }}>
                            <span className="line-clamp-2">{String(record[key] ?? '—')}</span>
                          </td>
                        ))}
                        {hasCreatedAt && (
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-mist-500">
                            {record.createdAt
                              ? new Date(record.createdAt as string).toLocaleDateString()
                              : '—'}
                          </td>
                        )}
                        {hasUpdatedAt && (
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-mist-500">
                            {record.updatedAt
                              ? new Date(record.updatedAt as string).toLocaleDateString()
                              : '—'}
                          </td>
                        )}
                        {hasStatus && (
                          <td className="px-4 py-3" style={{ width: getColumnWidth('status') }}>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                record.status === 'draft'
                                  ? 'bg-mist-100 text-mist-600 dark:bg-mist-800 dark:text-mist-400'
                                  : 'bg-mist-200 text-mist-800 dark:bg-mist-600 dark:text-mist-200'
                              }`}
                            >
                              {(record.status as string) === 'draft' ? 'Draft' : 'Published'}
                            </span>
                          </td>
                        )}
                        <td className="relative whitespace-nowrap px-4 py-3 text-right" style={{ width: getColumnWidth('actions') }}>
                          <div className="relative inline-block" data-action-menu>
                            <button
                              type="button"
                              onClick={() => setOpenActionMenuId((current) => (current === sid ? null : sid))}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100 hover:text-mist-900"
                              aria-label={`Open actions for ${table.singularName} ${sid}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden />
                            </button>

                            {openActionMenuId === sid && (
                              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-mist-200 bg-white p-1 shadow-xl">
                                {viewUrl(record) && (
                                  <Link
                                    href={viewUrl(record)!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 transition hover:bg-mist-100"
                                  >
                                    <ExternalLink className="h-4 w-4" aria-hidden />
                                    View
                                  </Link>
                                )}
                                {detailUrl(record) && (
                                  <Link
                                    href={detailUrl(record)!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 transition hover:bg-mist-100"
                                  >
                                    <Eye className="h-4 w-4" aria-hidden />
                                    Thông tin chi tiết
                                  </Link>
                                )}
                                <Link
                                  href={`${adminPath}/cms/${tableId}/${id}`}
                                  onClick={() => setOpenActionMenuId(null)}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 transition hover:bg-mist-100"
                                >
                                  <Pencil className="h-4 w-4" aria-hidden />
                                  Edit
                                </Link>
                                {tableId === 'tutors' && (
                                  <Link
                                    href={`${adminPath}/cms/${tableId}/new?copyFrom=${encodeURIComponent(String(id))}`}
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mist-700 transition hover:bg-mist-100"
                                  >
                                    <Copy className="h-4 w-4" aria-hidden />
                                    Copy
                                  </Link>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null)
                                    handleDelete(id)
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showBulkDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-delete-title"
            aria-describedby="bulk-delete-desc"
          >
            <div className="w-full max-w-sm rounded-2xl border border-mist-200 bg-white p-6 shadow-xl dark:border-mist-700 dark:bg-mist-900">
              <h2 id="bulk-delete-title" className="text-lg font-semibold text-mist-950 dark:text-white">
                Delete {selectedIds.size} item{selectedIds.size === 1 ? '' : 's'}?
              </h2>
              <p id="bulk-delete-desc" className="mt-2 text-sm text-mist-600 dark:text-mist-400">
                This cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteModal(false)}
                  className={btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkDeleteConfirm}
                  disabled={bulkDeleting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {bulkDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SingleRecordForm({
  tableId,
  table,
  initialRecord,
  onMessage,
  onDeployStarted
}: {
  tableId: string
  table: TableConfig
  initialRecord: Record<string, JsonValue>
  onMessage?: (m: { type: 'error' | 'success'; text: string }) => void
  onDeployStarted?: () => void
}) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {}
    table.fields.forEach((f) => (v[f.key] = formatFieldValue(initialRecord[f.key])))
    return v
  })
  const [richtextBlocks, setRichtextBlocks] = useState<Record<string, ContentBlock[]>>(() => {
    const r: Record<string, ContentBlock[]> = {}
    table.fields.forEach((f) => {
      if (f.type === 'richtext') {
        const html = String(initialRecord[f.key] ?? '')
        r[f.key] = html ? htmlToSingleBlock(html) : []
      }
    })
    return r
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: Record<string, JsonValue> = {}
      table.fields.forEach((f) => {
        if (f.type === 'richtext') {
          payload[f.key] = ourBlocksToHtml(richtextBlocks[f.key] ?? [])
        } else {
          payload[f.key] = parseFieldValue(values[f.key] ?? '', f.type)
        }
      })
      const res = await fetch(`${getApiUrl()}/api/cms/${tableId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })
      if (res.ok) onDeployStarted?.()
      router.refresh()
      onMessage?.({ type: 'success', text: 'Saved' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Clear this record?')) return
    const res = await fetch(`${getApiUrl()}/api/cms/${tableId}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) onDeployStarted?.()
    setValues(Object.fromEntries(table.fields.map((f) => [f.key, ''])))
    const emptyRichtext: Record<string, ContentBlock[]> = {}
    table.fields.forEach((f) => { if (f.type === 'richtext') emptyRichtext[f.key] = [] })
    setRichtextBlocks(emptyRichtext)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {table.fields.map((field) => {
        const inputId = `single-${tableId}-${field.key}`
        if (field.type === 'richtext') {
          return (
            <div key={field.key} className="space-y-2">
              <label className={labelClasses}>{field.label}</label>
              <BlockEditor
                key={`block-single-${tableId}-${field.key}`}
                holderId={`block-editor-single-${tableId}-${field.key}`}
                value={richtextBlocks[field.key] ?? []}
                onChange={(blocks) => setRichtextBlocks((prev) => ({ ...prev, [field.key]: blocks }))}
                legacyHtml={values[field.key] || undefined}
                placeholder="Start writing or add a block…"
                minHeight="280px"
              />
            </div>
          )
        }
        return (
          <div key={field.key}>
            <label htmlFor={inputId} className={labelClasses}>
              {field.label}
              {field.required && ' *'}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={inputId}
                value={values[field.key] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                className={inputClasses + ' min-h-[120px] resize-y'}
                rows={5}
                aria-required={field.required}
              />
            ) : (
              <input
                id={inputId}
                type={field.type === 'number' ? 'number' : 'text'}
                value={values[field.key] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                className={inputClasses}
                aria-required={field.required}
              />
            )}
          </div>
        )
      })}
      <div className="flex flex-wrap gap-3 border-t border-mist-100 dark:border-mist-800 pt-6">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-4 w-4" />
              Save changes
            </>
          )}
        </button>
        <button type="button" onClick={handleDelete} className={btnDanger}>
          <Eraser className="mr-1.5 h-4 w-4" />
          Clear
        </button>
      </div>
    </form>
  )
}
