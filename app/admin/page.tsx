'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  LayoutGrid,
  FileText,
  Newspaper,
  ArrowRight,
  Loader2,
  Plus,
  Clock,
  GraduationCap,
  type LucideIcon
} from 'lucide-react'

import { getApiUrl, getAdminPath } from '@/lib/admin-utils'
import type { TableConfig } from '@/lib/cms'
import type { JsonValue } from '@/types/json'

type RecordWithMeta = Record<string, JsonValue> & {
  id?: number | string
  title?: string
  updatedAt?: string
  tableId?: string
  tableName?: string
  singularName?: string
}

const cardStyles: Record<string, { bg: string; border: string; icon: string; hover: string; btn: string }> = {
  components: {
    bg: 'bg-white dark:bg-mist-900/30',
    border: 'border-mist-200 dark:border-mist-700',
    icon: 'bg-mist-200 text-mist-700 dark:bg-mist-700 dark:text-mist-300',
    hover: 'hover:border-mist-300 hover:shadow-md dark:hover:border-mist-600',
    btn: 'text-mist-700 hover:bg-mist-100 dark:text-mist-300 dark:hover:bg-mist-800'
  },
  pages: {
    bg: 'bg-white dark:bg-mist-900/30',
    border: 'border-mist-200 dark:border-mist-700',
    icon: 'bg-mist-200 text-mist-600 dark:bg-mist-700 dark:text-mist-400',
    hover: 'hover:border-mist-300 hover:shadow-md dark:hover:border-mist-600',
    btn: 'text-mist-600 hover:bg-mist-100 dark:text-mist-400 dark:hover:bg-mist-800'
  },
  posts: {
    bg: 'bg-white dark:bg-mist-900/30',
    border: 'border-mist-200 dark:border-mist-700',
    icon: 'bg-mist-200 text-mist-600 dark:bg-mist-700 dark:text-mist-400',
    hover: 'hover:border-mist-300 hover:shadow-md dark:hover:border-mist-600',
    btn: 'text-mist-600 hover:bg-mist-100 dark:text-mist-400 dark:hover:bg-mist-800'
  }
}

const cardIcons: Record<string, LucideIcon> = {
  components: LayoutGrid,
  pages: FileText,
  posts: Newspaper,
  courses: GraduationCap
}

function getCardStyle(id: string) {
  return cardStyles[id] ?? {
    bg: 'bg-white dark:bg-mist-900/30',
    border: 'border-mist-200 dark:border-mist-700',
    icon: 'bg-mist-200 text-mist-600 dark:bg-mist-700 dark:text-mist-400',
    hover: 'hover:border-mist-300 hover:shadow-md dark:hover:border-mist-600',
    btn: 'text-mist-600 hover:bg-mist-100 dark:text-mist-400 dark:hover:bg-mist-800'
  }
}

export default function AdminDashboardPage() {
  const [tables, setTables] = useState<TableConfig[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [recent, setRecent] = useState<RecordWithMeta[]>([])
  const [loading, setLoading] = useState(true)

  const adminPath = getAdminPath()
  const api = getApiUrl()

  useEffect(() => {
    Promise.all([
      fetch(`${api}/api/cms/config`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${api}/api/cms/posts`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${api}/api/cms/pages`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${api}/api/cms/components`, { credentials: 'include' }).then((r) => r.json())
    ])
      .then(([config, postsData, pagesData, componentsData]) => {
        const tablesList = (config?.tables ?? []) as TableConfig[]
        setTables(tablesList)

        const posts = Array.isArray(postsData) ? postsData : []
        const pages = Array.isArray(pagesData) ? pagesData : []
        const components = Array.isArray(componentsData) ? componentsData : []
        setCounts({ posts: posts.length, pages: pages.length, components: components.length })

        const postsWithMeta: RecordWithMeta[] = posts.map((p: Record<string, JsonValue>) => ({
          ...p,
          tableId: 'posts',
          tableName: 'Posts',
          singularName: 'Post'
        }))
        const pagesWithMeta: RecordWithMeta[] = pages.map((p: Record<string, JsonValue>) => ({
          ...p,
          tableId: 'pages',
          tableName: 'Pages',
          singularName: 'Page'
        }))
        const combined = [...postsWithMeta, ...pagesWithMeta]
        const sorted = combined.sort((a, b) => {
          const aDate = a.updatedAt ? new Date(a.updatedAt as string).getTime() : Number(a.id) || 0
          const bDate = b.updatedAt ? new Date(b.updatedAt as string).getTime() : Number(b.id) || 0
          return bDate - aDate
        })
        setRecent(sorted.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [api])

  const totalPosts = counts.posts ?? 0
  const totalPages = counts.pages ?? 0
  const totalComponents = counts.components ?? 0

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-mist-950 dark:text-white md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-mist-500 dark:text-mist-400">
            Manage your content and get a quick overview of your site.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-mist-200 dark:border-mist-700 bg-white py-24 shadow-sm dark:bg-mist-900/30">
            <Loader2 className="h-10 w-10 animate-spin text-mist-700 dark:text-mist-300" />
            <p className="mt-4 text-sm text-mist-500 dark:text-mist-400">Loading…</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* At a glance */}
            <section
              className="rounded-2xl border border-mist-200 dark:border-mist-700 bg-white p-6 shadow-sm dark:bg-mist-900/30"
              aria-label="At a glance"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">
                At a glance
              </h2>
              <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist-200 text-mist-700 dark:bg-mist-700 dark:text-mist-300">
                    <Newspaper className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-mist-950 dark:text-white">{totalPosts}</p>
                    <p className="text-sm text-mist-500 dark:text-mist-400">Posts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist-200 text-mist-600 dark:bg-mist-700 dark:text-mist-400">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-mist-950 dark:text-white">{totalPages}</p>
                    <p className="text-sm text-mist-500 dark:text-mist-400">Pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist-200 dark:bg-mist-700 text-mist-700 dark:text-mist-300">
                    <LayoutGrid className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-mist-950 dark:text-white">{totalComponents}</p>
                    <p className="text-sm text-mist-500 dark:text-mist-400">Components</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-mist-100 dark:border-mist-800 pt-6">
                <Link
                  href={`${adminPath}/cms/posts/new`}
                  className="inline-flex items-center gap-2 rounded-lg bg-mist-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-mist-800 dark:bg-mist-600 dark:hover:bg-mist-700"
                >
                  <Plus className="h-4 w-4" />
                  New post
                </Link>
                <Link
                  href={`${adminPath}/cms/pages/new`}
                  className="inline-flex items-center gap-2 rounded-lg bg-mist-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-mist-800 dark:bg-mist-600 dark:hover:bg-mist-700"
                >
                  <Plus className="h-4 w-4" />
                  New page
                </Link>
                <Link
                  href={`${adminPath}/cms/components`}
                  className="inline-flex items-center gap-2 rounded-lg border border-mist-200 dark:border-mist-700 bg-white px-4 py-2 text-sm font-medium text-mist-700 dark:text-mist-300 transition hover:bg-mist-100 dark:bg-mist-800 dark:hover:bg-mist-700"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Manage components
                </Link>
                <Link
                  href={`${adminPath}/cms/components`}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-900/60"
                >
                  <GraduationCap className="h-4 w-4" />
                  Configure dialog form
                </Link>
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Recent content */}
              <section className="lg:col-span-2 rounded-2xl border border-mist-200 dark:border-mist-700 bg-white shadow-sm dark:bg-mist-900/30">
                <div className="border-b border-mist-100 dark:border-mist-800 px-6 py-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">
                    Recent content
                  </h2>
                </div>
                <div className="divide-y divide-mist-100 dark:divide-mist-800">
                  {recent.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-mist-500 dark:text-mist-400">
                      No posts or pages yet. Create your first post or page to see it here.
                    </div>
                  ) : (
                    recent.map((item) => {
                      const title = String(item.title ?? item.slug ?? `Item ${item.id}`)
                      const href = `${adminPath}/cms/${item.tableId}/${item.id}`
                      return (
                        <Link
                          key={`${item.tableId}-${item.id}`}
                          href={href}
                          className="flex items-center gap-4 px-6 py-4 transition hover:bg-mist-100 dark:hover:bg-mist-800"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist-100 dark:bg-mist-800 text-mist-500 dark:text-mist-400">
                            {item.tableId === 'posts' ? (
                              <Newspaper className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-mist-950 dark:text-white">{title}</p>
                            <p className="text-xs text-mist-500 dark:text-mist-400">
                              {item.tableName}
                              {item.updatedAt && (
                                <>
                                  {' · '}
                                  <span className="inline-flex items-center gap-0.5">
                                    <Clock className="h-3 w-3" />
                                    {new Date(item.updatedAt as string).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-mist-400" />
                        </Link>
                      )
                    })
                  )}
                </div>
              </section>

              {/* Manage cards */}
              <section className="rounded-2xl border border-mist-200 dark:border-mist-700 bg-white p-6 shadow-sm dark:bg-mist-900/30">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">
                  Manage
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {tables.map((table) => {
                    const style = getCardStyle(table.id)
                    const Icon = cardIcons[table.id] ?? LayoutDashboard
                    return (
                      <Link
                        key={table.id}
                        href={`${adminPath}/cms/${table.id}`}
                        className={`group flex items-center gap-4 rounded-xl border p-4 transition ${style.border} ${style.hover}`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-mist-950 dark:text-white">{table.name}</p>
                          {table.description && (
                            <p className="mt-0.5 truncate text-xs text-mist-500 dark:text-mist-400">
                              {table.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          className={`h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 ${style.btn}`}
                        />
                      </Link>
                    )
                  })}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
