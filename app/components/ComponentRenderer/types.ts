import type { JsonValue } from '@/types/json'

export type ComponentRecord = {
  id: number
  type: string
  label?: string
  slug?: string
  [key: string]: string | number | undefined
}

/** Data passed from the page or post when a component is referenced */
export type ComponentContextData = {
  title?: string
  excerpt?: string
  content?: string
  body?: string
  slug?: string
  featuredImage?: { url: string; alt?: string } | null
  /** Structured data for sections – from page/post sectionData JSON. blocks[blockId] = per-block data when multiple of same type. */
  sectionData?: {
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
    /** Per-block data when page has multiple of same type (e.g. 2 CTAs). Key = block id. */
    blocks?: Record<string, Record<string, JsonValue>>
  }
}

export interface ComponentRendererProps {
  component: ComponentRecord
  contextData: ComponentContextData
  variant?: 'default' | 'compact'
  className?: string
  /** When rendering a component block from the body, pass block id so this instance uses sectionData.blocks[blockId]. */
  blockId?: string
}
