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
      {/* Thêm nền mờ đặc trưng giống thiết kế */}
      <div
        className="absolute inset-0 bg-[#00355f]/20 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="absolute inset-y-0 right-0 w-full max-w-xs bg-white px-6 py-6 dark:bg-slate-900 shadow-xl"
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
        // Cập nhật CSS: màu chữ #00355f đặc trưng, hover gạch chân mờ, thanh mảnh theo ảnh
        'group inline-flex items-center justify-between gap-2 text-base font-medium text-slate-600 hover:text-[#00355f] lg:text-sm transition-colors relative lg:after:absolute lg:after:bottom-[-4px] lg:after:left-0 lg:after:h-[2px] lg:after:w-0 lg:after:bg-[#00355f] lg:hover:after:w-full lg:after:transition-all max-lg:py-3 max-lg:w-full dark:text-slate-300 dark:hover:text-white',
        className,
      )}
      {...props}
    >
      {children}
      <span className="inline-flex p-1.5 opacity-0 group-hover:opacity-100 lg:hidden" aria-hidden="true">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </Link>
  )
}

export function NavbarLogo({ className, href, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return (
    <Link 
      href={href} 
      {...props} 
      className={clsx('inline-flex items-center text-xl font-bold text-[#00355f] tracking-tight dark:text-white', className)} 
    />
  )
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
    <header className={clsx('sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md dark:bg-slate-950 dark:border-slate-800', className)} {...props}>
      <style>{`:root { --scroll-padding-top: 4rem }`}</style>
      <nav>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          
          {/* 1. Sắp xếp lại: Đưa LOGO lên đầu bên trái */}
          <div className="flex items-center">{logo}</div>
          
          {/* 2. Sắp xếp lại: Đưa LINKS ra giữa */}
          <div className="flex items-center gap-8 max-lg:hidden">{links}</div>
          
          {/* 3. Sắp xếp lại: Đưa ACTIONS (Register Now) về góc bên phải */}
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-5">{actions}</div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              className="inline-flex rounded-full p-1.5 text-slate-700 hover:bg-slate-100 lg:hidden dark:text-white dark:hover:bg-white/10"
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
            <div className="flex justify-end border-b border-slate-50 pb-2">
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close main menu"
                className="inline-flex rounded-full p-1.5 text-slate-400 hover:text-slate-600 dark:text-white"
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
            <div className="mt-4 flex flex-col gap-1 divide-y divide-slate-50">
              {links}
            </div>
          </MobileMenuPanel>
        )}
      </nav>
    </header>
    </NavbarContext.Provider>
  )
}