import type { JsonValue } from '@/types/json'
import { getSafeHref, isInternalUrl } from '../utils'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import { ButtonLink } from '@/app/components/oatmeal/elements/button'
import type { ComponentContextData } from '../types'

type CtaColumnData = { headline?: string; subtext?: string; buttonText?: string; buttonUrl?: string }

export function TwoColumnSection({ blockData }: { blockData?: Record<string, JsonValue> }) {
  const raw = (blockData as { left?: CtaColumnData; right?: CtaColumnData } | undefined) ?? {}
  const left: CtaColumnData = raw.left ?? {}
  const right: CtaColumnData = raw.right ?? {}
  const hasLeft = (left.headline ?? left.subtext)?.trim()
  const hasRight = (right.headline ?? right.subtext)?.trim()
  if (!hasLeft && !hasRight) return null

  function renderColumn(col: CtaColumnData) {
    const headline = col?.headline ?? ''
    const subtext = col?.subtext ?? ''
    const buttonText = col?.buttonText ?? 'Learn more'
    const buttonUrl = getSafeHref(col?.buttonUrl ?? '#')
    const ctaNode = isInternalUrl(buttonUrl) ? (
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
    return (
      <div className="flex flex-col gap-6 text-center items-center">
        {headline && <Subheading className="max-w-xl">{headline}</Subheading>}
        {subtext && <Text className="text-mist-300 dark:text-mist-500 text-pretty max-w-lg">{subtext}</Text>}
        <div className="flex justify-center">{ctaNode}</div>
      </div>
    )
  }

  return (
    <section className="py-16 bg-mist-900 dark:bg-mist-950">
      <Container
        className={
          hasLeft && hasRight
            ? 'max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1px_1fr] lg:gap-16 lg:items-stretch'
            : 'max-w-7xl grid grid-cols-1 gap-12 lg:gap-16 lg:items-start'
        }
      >
        {hasLeft && <div className="lg:pr-8">{renderColumn(left)}</div>}
        {hasLeft && hasRight && (
          <div
            className="hidden w-px shrink-0 self-stretch bg-mist-600/60 dark:bg-mist-500/40 lg:block"
            aria-hidden="true"
          />
        )}
        {hasRight && <div className="lg:pl-8">{renderColumn(right)}</div>}
      </Container>
    </section>
  )
}
