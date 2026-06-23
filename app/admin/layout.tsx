'use client'

import { usePathname } from 'next/navigation'
import { AdminLayoutProvider } from './AdminLayoutContext'
import { DeployStatusProvider } from './DeployStatusContext'
import { AdminDeployLock } from './AdminDeployLock'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopBar } from './AdminTopBar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname?.endsWith('/login')

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <AdminLayoutProvider>
      <DeployStatusProvider>
        <div className="flex min-h-screen flex-col bg-mist-100 dark:bg-mist-950">
          <AdminTopBar />
          <AdminDeployLock />
          <div className="flex flex-1 overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </DeployStatusProvider>
    </AdminLayoutProvider>
  )
}
