'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  LayoutGrid,
  ExternalLink,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Images,
  Settings,
  Home,
  type LucideIcon
} from 'lucide-react'
import { getApiUrl, getAdminPath } from '@/lib/admin-utils'
import { useAdminLayout } from './AdminLayoutContext'
import type { TableConfig } from '@/lib/cms'

const navIcons: Record<string, LucideIcon> = {
  components: LayoutGrid,
  pages: FileText,
  posts: Newspaper
}

type TableWithCount = TableConfig & { count?: number }

const CONTENT_TABLE_IDS = ['posts', 'pages']
const SITE_TABLE_IDS = ['components']

export function AdminSidebar() {
  const pathname = usePathname()
  const adminPath = getAdminPath()
  const { sidebarCollapsed, toggleSidebar } = useAdminLayout()
  const [tables, setTables] = useState<TableWithCount[]>([])

  useEffect(() => {
    const base = getApiUrl()
    fetch(`${base}/api/cms/config`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { tables?: TableConfig[] }) => {
        const list = data.tables ?? []
        const nonSingle = list.filter((t) => !t.single) as TableWithCount[]
        if (nonSingle.length === 0) {
          setTables(list as TableWithCount[])
          return
        }
        Promise.all(
          nonSingle.map((t) =>
            fetch(`${base}/api/cms/${t.id}`, { credentials: 'include' })
              .then((res) => res.json())
              .then((d) => (Array.isArray(d) ? d.length : 0))
          )
        ).then((counts) => {
          nonSingle.forEach((t, i) => {
            t.count = counts[i]
          })
          setTables(list as TableWithCount[])
        })
      })
      .catch(() => setTables([]))
  }, [])

  const handleLogout = async () => {
    await fetch(`${getApiUrl()}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    window.location.href = `${adminPath}/login`
  }

  const isActive = (path: string) =>
    pathname === path || (path !== adminPath && pathname?.startsWith(path))

  const contentTables = tables.filter((t) => CONTENT_TABLE_IDS.includes(t.id))
  const siteTables = tables.filter((t) => SITE_TABLE_IDS.includes(t.id))
  const otherTables = tables.filter(
    (t) =>
      !CONTENT_TABLE_IDS.includes(t.id) &&
      !SITE_TABLE_IDS.includes(t.id) &&
      t.id !== 'homepage' /* Homepage has its own link above Pages */
  )

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      active ? 'bg-mist-200 text-mist-950 dark:bg-mist-800 dark:text-white' : 'text-mist-600 hover:bg-mist-200 hover:text-mist-950 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-white'
    }`

  return (
    <aside
      className={`flex flex-col border-r border-mist-200 bg-white transition-all duration-200 dark:border-mist-800 dark:bg-mist-900/50 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
      aria-label="Admin navigation"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-mist-100 px-3 dark:border-mist-800">
        {!sidebarCollapsed && (
          <Link
            href={adminPath}
            className="flex items-center gap-2 rounded-lg py-1.5 pr-2 text-mist-950 hover:bg-mist-100 dark:text-white dark:hover:bg-mist-800/50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist-200 dark:bg-mist-700">
              <LayoutGrid className="h-4 w-4 text-mist-600 dark:text-mist-300" />
            </span>
            <span className="text-sm font-semibold tracking-tight">CMS</span>
          </Link>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-mist-500 transition hover:bg-mist-200 hover:text-mist-700 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-white"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <Link href={adminPath} className={linkClass(pathname === adminPath)}>
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Dashboard</span>}
        </Link>

        <div className="pt-2">
          {!sidebarCollapsed && (
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">
              Content
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            <Link
              href={`${adminPath}/homepage`}
              className={linkClass(isActive(`${adminPath}/homepage`))}
              title="Homepage"
            >
              <Home className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Homepage</span>}
            </Link>
            {contentTables.map((table) => {
                const href = `${adminPath}/cms/${table.id}`
                const active = isActive(href)
                const Icon = navIcons[table.id] ?? FileText
                return (
                  <Link key={table.id} href={href} className={linkClass(active)} title={table.name}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{table.name}</span>
                        {typeof table.count === 'number' && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              active ? 'bg-mist-300 text-mist-950 dark:bg-mist-600 dark:text-white' : 'bg-mist-200/80 text-mist-600 dark:bg-mist-700/80 dark:text-mist-300'
                            }`}
                          >
                            {table.count}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
          </div>
        </div>

        <div className="pt-2">
          {!sidebarCollapsed && (
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">
              Site
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            <Link
              href={`${adminPath}/settings`}
              className={linkClass(isActive(`${adminPath}/settings`))}
              title="Settings"
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Settings</span>}
            </Link>
            {siteTables.length > 0 &&
              siteTables.map((table) => {
                const href = `${adminPath}/cms/${table.id}`
                const active = isActive(href)
                const Icon = navIcons[table.id] ?? FileText
                return (
                  <Link key={table.id} href={href} className={linkClass(active)} title={table.name}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span>{table.name}</span>}
                  </Link>
                )
              })}
          </div>
        </div>

        <div className="pt-2">
          {!sidebarCollapsed && (
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-mist-500 dark:text-mist-400">
              Library
            </p>
          )}
          <Link
            href={`${adminPath}/media`}
            className={linkClass(isActive(`${adminPath}/media`))}
            title="Media library"
          >
            <Images className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Media</span>}
          </Link>
        </div>

        {otherTables.length > 0 && (
          <div className="flex flex-col gap-0.5 pt-2">
            {otherTables.map((table) => {
              const href = `${adminPath}/cms/${table.id}`
              const active = isActive(href)
              const Icon = navIcons[table.id] ?? FileText
              return (
                <Link key={table.id} href={href} className={linkClass(active)} title={table.name}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{table.name}</span>
                      {typeof table.count === 'number' && (
                        <span className="rounded-full bg-mist-200/80 px-2 py-0.5 text-xs font-medium text-mist-600 dark:bg-mist-700/80 dark:text-mist-300">
                          {table.count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-mist-100 p-2 dark:border-mist-800">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-mist-600 transition hover:bg-mist-200 hover:text-mist-950 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-white"
          title="View site"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>View site</span>}
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
          aria-label="Log out of admin"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
