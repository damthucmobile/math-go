import { getSafeImageSrc } from '../utils'
import { HeroSimpleCentered } from '@/app/components/oatmeal/sections/hero-simple-centered'
import type { ComponentContextData } from '../types'

export function HeroSection({
  context,
  variant
}: { context: ComponentContextData; variant?: 'default' | 'compact' }) {
  const heroData = context.sectionData?.hero
  const title = heroData?.headline ?? context.title ?? ''
  const content = heroData?.subtext ?? context.excerpt ?? context.content ?? context.body ?? ''
  const image = heroData?.imageUrl ?? context.featuredImage?.url
  if (!title && !content && !image) return null
  const isCompact = variant === 'compact'
  return (
    <HeroSimpleCentered
      id="hero"
      className={isCompact ? 'py-10 sm:py-12' : undefined}
      headline={title || null}
      subheadline={
        content || (image && getSafeImageSrc(image)) ? (
          <>
            {content}
            {image && getSafeImageSrc(image) && (
              <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-mist-200 dark:bg-mist-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getSafeImageSrc(image)} alt={context.featuredImage?.alt ?? title} className="h-full w-full object-cover" />
              </div>
            )}
          </>
        ) : null
      }
    />
  )
}
