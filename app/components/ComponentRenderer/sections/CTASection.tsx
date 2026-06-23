import type { JsonValue } from '@/types/json'
import { getSafeHref, isInternalUrl } from '../utils'
import { ButtonLink } from '@/app/components/oatmeal/elements/button'
import { Text } from '@/app/components/oatmeal/elements/text'
import { CallToActionSimpleCentered } from '@/app/components/oatmeal/sections/call-to-action-simple-centered'
import type { ComponentContextData } from '../types'

export function CTASection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const sd = (blockData as { headline?: string; subtext?: string; buttonText?: string; buttonUrl?: string } | undefined) ?? context.sectionData?.cta
  const headline = sd?.headline ?? context.title ?? ''
  const subtext = sd?.subtext ?? context.excerpt ?? context.content ?? context.body ?? ''
  const buttonText = sd?.buttonText ?? 'Get started'
  const buttonUrl = getSafeHref(sd?.buttonUrl ?? '#')
  if (!headline && !subtext) return null
  const ctaNode = (
    isInternalUrl(buttonUrl) ? (
      <ButtonLink href={buttonUrl} size="lg" color="light">
        {buttonText}
      </ButtonLink>
    ) : (
      <a
        href={buttonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-4 py-2 text-sm/7 font-medium bg-white text-mist-950 hover:bg-mist-100 dark:bg-mist-100 dark:text-mist-950 dark:hover:bg-white"
      >
        {buttonText}
      </a>
    )
  )
  return (
    <CallToActionSimpleCentered
      className="bg-mist-900 dark:bg-mist-950"
      headline={headline || null}
      subheadline={subtext ? <Text className="text-mist-300 dark:text-mist-500">{subtext}</Text> : null}
      cta={ctaNode}
    />
  )
}
