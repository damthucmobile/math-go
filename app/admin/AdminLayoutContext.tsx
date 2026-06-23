'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const SIDEBAR_COLLAPSED_KEY = 'cms-sidebar-collapsed'

type AdminLayoutContextValue = {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null)

function getInitialSidebarCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(getInitialSidebarCollapsed)

  const setSidebarCollapsed = useCallback((value: boolean) => {
    setSidebarCollapsedState(value)
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, value ? 'true' : 'false')
    } catch {
      // localStorage unavailable (e.g. private browsing)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? 'true' : 'false')
      } catch {
        // localStorage unavailable
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ sidebarCollapsed, setSidebarCollapsed, toggleSidebar }),
    [sidebarCollapsed, setSidebarCollapsed, toggleSidebar]
  )

  return (
    <AdminLayoutContext.Provider value={value}>
      {children}
    </AdminLayoutContext.Provider>
  )
}

export function useAdminLayout() {
  const ctx = useContext(AdminLayoutContext)
  if (!ctx) throw new Error('useAdminLayout must be used within AdminLayoutProvider')
  return ctx
}
