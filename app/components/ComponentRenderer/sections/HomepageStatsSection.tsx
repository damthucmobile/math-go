'use client'

import { Container } from '@/app/components/oatmeal/elements/container'
import type { ComponentContextData } from '../types'

export function HomepageStatsSection({ context }: { context: ComponentContextData }) {
  const stats = context.sectionData?.stats ?? []
  if (stats.length === 0) return null

  return (
    <section className="bg-white py-12 border-b border-slate-100">
      <Container>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="p-6 text-center border-r border-slate-100 last:border-0">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
