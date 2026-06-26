import type { JsonValue } from '@/types/json'
import { SafeImage } from '@/app/components/SafeImage'
import { Container } from '@/app/components/oatmeal/elements/container'
import type { ComponentContextData, ComponentRecord } from '../types'
import { BadgeCheck, Compass, Sparkles, Star, Target, TrendingUp, type LucideIcon } from 'lucide-react'

type FeaturedSplitSectionData = {
  overline?: string
  title?: string
  quote?: string
  description?: string
  imageUrl?: string
  badges?: Array<{ label?: string; iconName?: string }>
  stats?: Array<{ value?: string; label?: string }>
}

function parseFeaturedSplitConfig(raw: unknown): FeaturedSplitSectionData | null {
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return null

    try {
      const parsed = JSON.parse(trimmed)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as FeaturedSplitSectionData
      }
    } catch {
      // fall through to support CMS values stored as a JS object literal string
    }

    try {
      const wrapped = trimmed.startsWith('{') || trimmed.startsWith('(') ? trimmed : `{${trimmed}}`
      const parsed = Function(`"use strict"; return (${wrapped});`)() as unknown
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as FeaturedSplitSectionData
      }
    } catch {
      // ignore and return null below
    }
  }

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as FeaturedSplitSectionData
  }
  return null
}

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  award: BadgeCheck,
  trend: TrendingUp,
  target: Target,
  compass: Compass,
  star: Star
}

function getBadgeIcon(iconName?: string) {
  const normalized = (iconName ?? 'sparkles').toLowerCase()
  return iconMap[normalized] ?? Sparkles
}

export function FeaturedSplitSection({
  context,
  blockData,
  data,
  component
}: {
  context: ComponentContextData
  blockData?: Record<string, JsonValue>
  data?: FeaturedSplitSectionData
  component?: Pick<ComponentRecord, 'config'>
}) {
  const configuredData = parseFeaturedSplitConfig(component?.config)
  const source = (data ?? configuredData ?? (blockData as FeaturedSplitSectionData | undefined) ?? context.sectionData?.featuredSplit) as FeaturedSplitSectionData | undefined
  const overline = source?.overline ?? context.sectionData?.featuredSplit?.overline
  const title = source?.title ?? context.title ?? ''
  const quote = source?.quote ?? ''
  const description = source?.description ?? context.excerpt ?? context.content ?? context.body ?? ''
  const imageUrl = source?.imageUrl ?? context.featuredImage?.url
  const badges = source?.badges ?? []
  const stats = source?.stats ?? []

console.log('component: ', configuredData);

  if (!title && !description && !imageUrl && !quote && badges.length === 0 && stats.length === 0) return null

  return (
    <section className="w-full bg-[var(--surface-container-low)] py-16 sm:py-20">
      <Container className="max-w-7xl flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1">
          {overline && (
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--primary)]">
              {overline}
            </p>
          )}

          {title && (
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--primary)] sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--on-surface)] sm:text-lg">
              {description}
            </p>
          )}

          {quote && (
            <blockquote className="mt-8 rounded-r-2xl border-l-4 border-[var(--primary)] bg-[var(--surface)]/80 px-5 py-4 shadow-sm">
              <p className="font-display text-lg leading-8 tracking-[0.01em] text-[var(--on-surface)]">
                “{quote}”
              </p>
            </blockquote>
          )}

          {badges.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {badges.map((badge, index) => {
                const Icon = getBadgeIcon(badge.iconName)
                return (
                  <span
                    key={`${badge.label ?? 'badge'}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[var(--secondary-fixed)] px-3.5 py-2 text-sm font-medium tracking-[0.02em] text-[var(--on-surface)]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {badge.label}
                  </span>
                )
              })}
            </div>
          )}

          {stats.length > 0 && (
            <div className={`mt-8 grid gap-6 ${stats.length === 2 ? 'sm:grid-cols-2 sm:divide-x sm:divide-[var(--outline-variant)]' : 'sm:grid-cols-2'}`}>
              {stats.map((stat, index) => (
                <div key={`${stat.label ?? 'stat'}-${index}`} className={stats.length === 2 ? 'sm:px-6 first:sm:pr-6 last:sm:pl-6' : ''}>
                  <p className="font-display text-3xl font-semibold tracking-[0.02em] text-[var(--primary)] sm:text-4xl">
                    {stat.value ?? '—'}
                  </p>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-[var(--on-surface-variant)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex-1 lg:max-w-[480px]">
          {imageUrl ? (
            <div className="overflow-hidden rounded-[2rem] border border-[var(--outline-variant)] bg-[var(--surface)] p-2 shadow-sm">
              <SafeImage
                src={imageUrl}
                alt={title || 'Featured image'}
                className="h-full min-h-[320px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-[var(--outline-variant)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--on-surface-variant)]">
              Add an image to preview the split section.
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
