import type { JsonValue } from '@/types/json'

export type ComponentRecord = {
  id: number
  type: string
  label?: string
  slug?: string
  config?: JsonValue | string
  [key: string]: JsonValue | string | number | undefined
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
    hero?: { badge?: string; headline?: string; subtext?: string; primaryButtonLabel?: string; primaryButtonHref?: string; secondaryButtonLabel?: string; secondaryButtonHref?: string; imageUrl?: string }
    stats?: { value: string; label: string }[]
    programs?: { title: string; description: string; href?: string; iconName?: string }[]
    programsHeading?: string
    tutor?: Array<{ name?: string; title?: string; quote?: string; description?: string; imageUrl?: string; stat1Value?: string; stat1Label?: string; stat2Value?: string; stat2Label?: string; badges?: Array<{ label?: string; iconName?: string }> }>
    testimonials?: { quote: string; author: string; role?: string; avatarUrl?: string }[]
    testimonialsHeading?: string
    contact?: { eyebrow?: string; title?: string; subtitle?: string; buttonLabel?: string }
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
    featuredSplit?: {
      overline?: string
      title?: string
      quote?: string
      description?: string
      imageUrl?: string
      badges?: Array<{ label?: string; iconName?: string }>
      stats?: Array<{ value?: string; label?: string }>
    }
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
