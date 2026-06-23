'use client'

import { Loader2 } from 'lucide-react'
import { useDeployStatus } from './DeployStatusContext'

export function AdminDeployLock() {
  const { deploying } = useDeployStatus()

  if (!deploying) return null

  return (
    <>
      <div
        className="sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-100"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
        <span>
          Deployment in progress. Frontend will show your changes when the build completes. Editing is locked until then.
        </span>
      </div>
      <div
        className="fixed inset-0 z-40 bg-mist-950/20 dark:bg-mist-950/40"
        aria-hidden
        style={{ pointerEvents: 'auto' }}
      />
    </>
  )
}
