/**
 * Per-file write serialization to prevent concurrent writes from corrupting JSON files.
 * Use for any read-modify-write that must be atomic (e.g. settings, CMS list tables, media list).
 */

const fileWritePromises = new Map<string, Promise<void>>()

export function withFileLock<T>(filePath: string, fn: () => T | Promise<T>): Promise<T> {
  const prev = fileWritePromises.get(filePath) ?? Promise.resolve()
  const next = prev
    .then(() => fn())
    .then((result) => {
      fileWritePromises.set(filePath, Promise.resolve())
      return result
    })
    .catch((err) => {
      fileWritePromises.set(filePath, Promise.resolve())
      throw err
    })
  fileWritePromises.set(filePath, next as Promise<void>)
  return next as Promise<T>
}
