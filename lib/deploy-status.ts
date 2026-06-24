/**
 * Tracks "deploy in progress" so admin can lock editing until the frontend has rebuilt.
 * Persists startedAt in Blob (Vercel) or a local file (dev). GET /api/deploy-status
 * reads this and optionally polls Vercel API to determine when deploy is done.
 */

import fs from 'fs'
import path from 'path'
import { getProjectRoot } from '@/lib/project-root'
import { useBlobStorage, getBlobDataFile, setBlobDataFile } from '@/lib/cms-blob'

const DATA_DIR = path.join(getProjectRoot(), 'data')
const FILE_NAME = 'deploy-status.json'
const BLOB_KEY = 'deploy-status.json'

/** Deploy status file: when we started a deploy (so we know one is in progress). */
export interface DeployStatusFile {
  startedAt: number
}

const DEPLOY_TIMEOUT_MS = 20 * 60 * 1000 // 20 min - consider "no deploy" if older
const FALLBACK_DEPLOY_DURATION_MS = 5 * 60 * 1000 // 5 min - if no Vercel API, assume done after this

function shouldSkipDeployLockInLocalDev(): boolean {
  return process.env.NODE_ENV !== 'production' &&
    !process.env.VERCEL_DEPLOY_HOOK_URL &&
    !process.env.VERCEL_API_TOKEN &&
    !process.env.VERCEL_PROJECT_ID
}

/** Read current deploy status (startedAt or null). */
export async function getDeployStatusAsync(): Promise<DeployStatusFile | null> {
  if (useBlobStorage()) {
    const raw = await getBlobDataFile(BLOB_KEY)
    if (raw === null) return null
    try {
      const parsed = JSON.parse(raw) as DeployStatusFile
      if (typeof parsed?.startedAt === 'number') return parsed
    } catch {
      // ignore
    }
    return null
  }
  const filePath = path.join(DATA_DIR, FILE_NAME)
  if (!fs.existsSync(filePath)) return null
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as DeployStatusFile
    if (typeof parsed?.startedAt === 'number') return parsed
  } catch {
    // ignore
  }
  return null
}

/** Record that a deploy was just triggered (call before or with triggerVercelDeploy). */
export async function setDeployStartedAsync(): Promise<void> {
  const payload: DeployStatusFile = { startedAt: Date.now() }
  const content = JSON.stringify(payload)
  if (useBlobStorage()) {
    await setBlobDataFile(BLOB_KEY, content)
    return
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  const filePath = path.join(DATA_DIR, FILE_NAME)
  fs.writeFileSync(filePath, content, 'utf-8')
}

/** Clear deploy status (e.g. when we've determined deploy is done). Optional. */
export async function clearDeployStatusAsync(): Promise<void> {
  if (useBlobStorage()) {
    await setBlobDataFile(BLOB_KEY, JSON.stringify({ startedAt: 0 }))
    return
  }
  const filePath = path.join(DATA_DIR, FILE_NAME)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

/** Poll Vercel API for latest deployment; return true if still building, false if READY/ERROR/CANCELED. */
async function isVercelDeploymentStillBuilding(startedAt: number): Promise<boolean> {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!token || !projectId) return true // no API: caller will use timeout

  const url = new URL('https://api.vercel.com/v6/deployments')
  url.searchParams.set('projectId', projectId)
  url.searchParams.set('limit', '5')
  const since = startedAt - 60_000
  url.searchParams.set('since', String(since))

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return true

  const data = (await res.json()) as {
    deployments?: { created: number; state: string; readyState?: string }[]
  }
  const deployments = data?.deployments ?? []
  const ourDeploy = deployments.find((d) => {
    const c = typeof d.created === 'string' ? parseInt(d.created, 10) : d.created
    return c >= startedAt - 30_000
  })
  if (!ourDeploy) return true

  const state = (ourDeploy.state ?? ourDeploy.readyState ?? '').toUpperCase()
  if (state === 'READY' || state === 'ERROR' || state === 'CANCELED') return false
  return true
}

/**
 * Returns { deploying: true } if a deploy was started recently and is still in progress.
 * Uses Vercel API when VERCEL_API_TOKEN and VERCEL_PROJECT_ID are set; otherwise uses a timeout.
 */
export async function isDeployingAsync(): Promise<boolean> {
  const status = await getDeployStatusAsync()
  if (!status || status.startedAt <= 0) return false

  if (shouldSkipDeployLockInLocalDev()) {
    await clearDeployStatusAsync()
    return false
  }

  const age = Date.now() - status.startedAt
  if (age > DEPLOY_TIMEOUT_MS) return false

  const stillBuilding = await isVercelDeploymentStillBuilding(status.startedAt)
  if (!stillBuilding) {
    await clearDeployStatusAsync()
    return false
  }

  if (!process.env.VERCEL_API_TOKEN || !process.env.VERCEL_PROJECT_ID) {
    if (age >= FALLBACK_DEPLOY_DURATION_MS) {
      await clearDeployStatusAsync()
      return false
    }
  }
  return true
}
