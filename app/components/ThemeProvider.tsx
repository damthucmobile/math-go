'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'simple-cms-theme'

type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'dark' || v === 'light' ? v : null
}

/**
 * Sets data-theme on <html> from stored preference or system.
 * Default is system until the user chooses; add a toggle that calls setTheme and persists to localStorage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const theme = getStoredTheme() ?? getSystemTheme()
    document.documentElement.setAttribute('data-theme', theme)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (getStoredTheme() !== null) return
      document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mounted])

  return <>{children}</>
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, theme)
}
