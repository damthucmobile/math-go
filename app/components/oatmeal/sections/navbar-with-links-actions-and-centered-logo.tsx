'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react'

const NavbarContext = createContext<{ closeMobile: () => void } | null>(null)

function MobileMenuPanel({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    panel.addEventListener('keydown', handleKeyDown)
    return () => panel.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
      <div
        className="absolute inset-0 bg-black/20"
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="absolute inset-0 bg-mist-100 px-6 py-6 dark:bg-mist-950 lg:px-10"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  )
}

export function NavbarLink({
  children,
  href,
  className,
  onClick,
  ...props
}: { href: string; onClick?: () => void } & Omit<ComponentProps<'a'>, 'href'>) {
  const ctx = useContext(NavbarContext)
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    ctx?.closeMobile()
  }
  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        'group inline-flex items-center justify-between gap-2 text-3xl/10 font-medium text-mist-950 lg:text-sm/7 dark:text-white',
        className,
      )}
      {...props}
    >
      {children}
      <span className="inline-flex p-1.5 opacity-0 group-hover:opacity-100 lg:hidden" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </Link>
  )
}

export function NavbarLogo({ className, href, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return <Link href={href} {...props} className={clsx('inline-flex items-stretch', className)} />
}

export function NavbarWithLinksActionsAndCenteredLogo({
  links,
  logo,
  actions,
  className,
  ...props
}: {
  links: ReactNode
  logo: ReactNode
  actions: ReactNode
} & ComponentProps<'header'>) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)

  return (
    <NavbarContext.Provider value={{ closeMobile }}>
    <header className={clsx('sticky top-0 z-10 bg-mist-100 dark:bg-mist-950', className)} {...props}>
      <style>{`:root { --scroll-padding-top: 5.25rem }`}</style>
      <nav>
        <div className="mx-auto flex h-(--scroll-padding-top) max-w-7xl items-center gap-4 px-6 lg:px-10">
          <div className="flex flex-1 gap-8 max-lg:hidden">{links}</div>
          <div className="flex items-center">{logo}</div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex shrink-0 items-center gap-5">{actions}</div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              className="inline-flex rounded-full p-1.5 text-mist-950 hover:bg-mist-950/10 lg:hidden dark:text-white dark:hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path
                  fillRule="evenodd"
                  d="M3.748 8.248a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75ZM3.748 15.75a.75.75 0 0 1 .75-.751h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <MobileMenuPanel onClose={closeMobile}>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close main menu"
                className="inline-flex rounded-full p-1.5 text-mist-950 hover:bg-mist-950/10 dark:text-white dark:hover:bg-white/10"
              >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-6">
              {links}
            </div>
          </MobileMenuPanel>
        )}
      </nav>
    </header>
    </NavbarContext.Provider>
  )
}
