/**
 * Component templates – data from page/post (contextData).
 * Uses Oatmeal sections and elements; section logic lives in ComponentRenderer/sections/.
 */

import {
  BannerSection,
  CTASection,
  FAQsSection,
  FeaturedSection,
  FeaturedSplitSection,
  HeroSection,
  HomepageContactSection,
  HomepageHeroSection,
  HomepageProgramsSection,
  HomepageStatsSection,
  HomepageTestimonialsSection,
  HomepageTutorSection,
  PricingSection,
  StatsSection,
  TeamSection,
  TestimonialsSection,
  TwoColumnSection,
} from './sections'
import type { ComponentContextData, ComponentRecord, ComponentRendererProps } from './types'

export type { ComponentContextData, ComponentRecord, ComponentRendererProps }
export { getSafeHref, getSafeImageSrc } from './utils'

export function ComponentRenderer({
  component,
  contextData,
  variant = 'default',
  className = '',
  blockId
}: ComponentRendererProps) {
  const blockData = blockId && contextData.sectionData?.blocks?.[blockId] ? contextData.sectionData.blocks[blockId] : undefined
  const section = (() => {
    switch (component.type) {
      case 'hero':
        return <HeroSection context={contextData} variant={variant} />
      case 'homepage-hero':
        return <HomepageHeroSection context={contextData} />
      case 'homepage-stats':
        return <HomepageStatsSection context={contextData} />
      case 'homepage-programs':
        return <HomepageProgramsSection context={contextData} />
      case 'homepage-tutor':
        return <HomepageTutorSection context={contextData} />
      case 'homepage-testimonials':
        return <HomepageTestimonialsSection context={contextData} />
      case 'homepage-contact':
        return <HomepageContactSection context={contextData} />
      case 'featured':
        return <FeaturedSection context={contextData} blockData={blockData} />
      case 'featured-split':
        return <FeaturedSplitSection context={contextData} blockData={blockData} component={component} />
      case 'cta':
        return <CTASection context={contextData} blockData={blockData} />
      case 'pricing':
        return <PricingSection context={contextData} blockData={blockData} />
      case 'stats':
        return <StatsSection context={contextData} blockData={blockData} />
      case 'testimonials':
        return <TestimonialsSection context={contextData} blockData={blockData} />
      case 'team':
        return <TeamSection context={contextData} blockData={blockData} />
      case 'faqs':
        return <FAQsSection context={contextData} blockData={blockData} />
      case 'banners':
        return <BannerSection context={contextData} blockData={blockData} />
      case 'twocolumn':
        return <TwoColumnSection blockData={blockData} />
      default:
        return null
    }
  })()
  if (!section) return null
  return <div className={className}>{section}</div>
}
