import fs from 'fs'
import path from 'path'

/** Max levels to walk up from cwd when resolving project root (Vercel can nest deeply). */
const MAX_LEVELS_UP = 10

/**
 * Resolve project root so that data/ and pages.json work in both:
 * - Local dev (process.cwd() = project root)
 * - Vercel serverless (process.cwd() can be deep, e.g. .next/server/app/...)
 */
export function getProjectRoot(): string {
  let dir = process.cwd()
  for (let i = 0; i <= MAX_LEVELS_UP; i++) {
    if (fs.existsSync(path.join(dir, 'pages.json'))) {
      return dir
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.cwd()
}
