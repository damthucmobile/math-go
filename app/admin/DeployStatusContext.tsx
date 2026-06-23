'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '@/lib/admin-utils'

const POLL_INTERVAL_MS = 5000

type DeployStatusContextValue = {
  deploying: boolean
  /** Call after a successful save/delete so the UI locks immediately while server catches up. */
  setDeployingTrue: () => void
}

const DeployStatusContext = createContext<DeployStatusContextValue | null>(null)

export function DeployStatusProvider({ children }: { children: React.ReactNode }) {
  const [deploying, setDeploying] = useState(false)
  const wasDeployingRef = useRef(false)
  const api = getApiUrl()
  const router = useRouter()

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${api}/api/deploy-status`, { credentials: 'include' })
      if (res.ok) {
        const data = (await res.json()) as { deploying?: boolean }
        setDeploying(Boolean(data.deploying))
      }
    } catch {
      setDeploying(false)
    }
  }, [api])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  useEffect(() => {
    if (!deploying) return
    const id = setInterval(fetchStatus, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [deploying, fetchStatus])

  // When deployment finishes (lock message hides), refresh so the page shows latest state
  useEffect(() => {
    if (deploying) {
      wasDeployingRef.current = true
    } else if (wasDeployingRef.current) {
      wasDeployingRef.current = false
      router.refresh()
    }
  }, [deploying, router])

  const setDeployingTrue = useCallback(() => setDeploying(true), [])

  const value = useMemo(
    () => ({ deploying, setDeployingTrue }),
    [deploying, setDeployingTrue]
  )

  return (
    <DeployStatusContext.Provider value={value}>
      {children}
    </DeployStatusContext.Provider>
  )
}

export function useDeployStatus() {
  const ctx = useContext(DeployStatusContext)
  if (!ctx) throw new Error('useDeployStatus must be used within DeployStatusProvider')
  return ctx
}
