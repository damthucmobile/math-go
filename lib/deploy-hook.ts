import { setDeployStartedAsync } from '@/lib/deploy-status'

/**
 * Trigger a Vercel deployment via Deploy Hook when content is saved in admin.
 * Persists "deploy started" so admin can lock editing until deploy completes.
 * Set VERCEL_DEPLOY_HOOK_URL in Vercel → Project → Settings → Git → Deploy Hooks.
 * Optional: VERCEL_API_TOKEN + VERCEL_PROJECT_ID for accurate "deploy done" detection.
 */
export async function triggerVercelDeploy(): Promise<void> {
  const url = process.env.VERCEL_DEPLOY_HOOK_URL
  await setDeployStartedAsync()
  if (!url || typeof url !== 'string' || !url.startsWith('https://')) return

  fetch(url, { method: 'POST' }).catch(() => {
    // Ignore errors; deploy hook is best-effort
  })
}
