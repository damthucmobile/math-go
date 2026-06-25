import type { JsonValue } from '@/types/json'

/**
 * Section data shape used by ComponentRenderer (hero, cta, pricing, etc.).
 * Parse sectionData JSON from page/post. Reused by home, [slug], and [id] pages.
 */
export type SectionData = {
  stats?: { value: string; label: string }[]
  testimonials?: { quote: string; author: string; role?: string; avatarUrl?: string }[]
  team?: { name: string; role: string; imageUrl?: string; bio?: string }[]
  faqs?: { question: string; answer: string }[]
  pricing?: {
    name: string
    price: string
    description?: string
    features?: string[]
    ctaText?: string
    ctaUrl?: string
  }[]
  featured?: { headline?: string; description?: string; imageUrl?: string }
  hero?: { headline?: string; subtext?: string; imageUrl?: string }
  cta?: { headline?: string; subtext?: string; buttonText?: string; buttonUrl?: string }
  banner?: { text?: string; linkText?: string; linkUrl?: string; style?: 'info' | 'success' | 'warning' }
  blocks?: Record<string, Record<string, JsonValue>>
}

export function parseSectionData(raw: string | Record<string, unknown> | undefined): SectionData | undefined {
  if (!raw) return undefined
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as SectionData
  }
  if (typeof raw !== 'string') return undefined
  try {
    const parsed = JSON.parse(raw) as SectionData
    return parsed ?? undefined
  } catch {
    return undefined
  }
}
