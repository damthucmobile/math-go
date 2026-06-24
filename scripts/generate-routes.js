const fs = require('fs')
const path = require('path')

const APP_DIR = path.join(process.cwd(), 'app', '(site)')
const OUTPUT = path.join(process.cwd(), 'lib', 'routes.ts')

function scan(dir, currentRoute = '') {
  const routes = []

  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  })

  const hasPage = entries.some(
    (entry) =>
      entry.isFile() &&
      ['page.tsx', 'page.jsx', 'page.ts'].includes(entry.name)
  )

  if (hasPage) {
    routes.push(currentRoute || '/')
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    if (
      entry.name.startsWith('(') ||
      entry.name.startsWith('_')
    ) {
      continue
    }

    const childPath = path.join(dir, entry.name)

    routes.push(
      ...scan(
        childPath,
        `${currentRoute}/${entry.name}`.replace(/\/+/g, '/')
      )
    )
  }

  return routes
}

function toKey(route) {
  if (route === '/') return 'HOME'

  return route
    .replace(/^\//, '')
    .replace(/\[(.*?)\]/g, 'BY_$1')
    .replace(/\//g, '_')
    .replace(/-/g, '_')
    .toUpperCase()
}

const routes = scan(APP_DIR)
const staticRoutes = routes.filter(route => !route.includes('['))
const dynamicRoutes = routes.filter(route => route.includes('['))


const content = `
export const ROUTES = {
${staticRoutes
  .map(route => `  ${toKey(route)}: '${route}',`)
  .join('\n')}
} as const

export const ROUTE_BUILDERS = {
${dynamicRoutes
  .map(route => {
    const params = [
      ...route.matchAll(/\[(.*?)\]/g)
    ].map(m => m[1])

    const fnArgs = params
      .map(param => `${param}: string`)
      .join(', ')

    let routeTemplate = route

    params.forEach(param => {
      routeTemplate = routeTemplate.replace(
        `[${param}]`,
        `\${${param}}`
      )
    })

    return `  ${toKey(route)}: (${fnArgs}): string => \`${routeTemplate}\`,`
  })
  .join('\n')}
} as const
`

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, content)

console.log('Generated routes.ts')