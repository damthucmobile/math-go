/**
 * Storage strategy: local = data/*.json (fs), Vercel = Vercel Blob only.
 * On Vercel we do not read from data/*.json; all CMS/settings/media come from Blob.
 * We use Blob when VERCEL=1 and BLOB_READ_WRITE_TOKEN is set; locally we use data/ even if the token is present.
 */

const BLOB_PREFIX = 'cms-data'

/** True when we should use Vercel Blob (Vercel runtime + token). Local dev always uses data/*.json. */
export function useBlobStorage(): boolean {
  const onVercel = process.env.VERCEL === '1'
  const hasToken =
    typeof process.env.BLOB_READ_WRITE_TOKEN === 'string' &&
    process.env.BLOB_READ_WRITE_TOKEN.length > 0
  return onVercel && hasToken
}

/** Read a data file from Blob. Returns null if not found or on error. */
export async function getBlobDataFile(fileName: string): Promise<string | null> {
  if (!useBlobStorage()) return null
  try {
    const { get } = await import('@vercel/blob')
    const pathname = `${BLOB_PREFIX}/${fileName}`
    const res = await get(pathname, { access: 'private' })
    if (!res?.stream) return null
    const text = await new Response(res.stream).text()
    return text
  } catch {
    return null
  }
}

/** Write a data file to Blob. */
export async function setBlobDataFile(fileName: string, content: string): Promise<void> {
  if (!useBlobStorage()) return
  const { put } = await import('@vercel/blob')
  const pathname = `${BLOB_PREFIX}/${fileName}`
  await put(pathname, content, {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
