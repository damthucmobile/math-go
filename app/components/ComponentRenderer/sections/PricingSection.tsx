import type { JsonValue } from '@/types/json'
import { getSafeHref, isInternalUrl } from '../utils'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import { ButtonLink } from '@/app/components/oatmeal/elements/button'
import type { ComponentContextData } from '../types'

export function PricingSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const blockPlans = blockData?.pricing as { name: string; price: string; description?: string; features?: string[]; ctaText?: string; ctaUrl?: string }[] | undefined
  const plans = blockPlans ?? context.sectionData?.pricing ?? []
  const headline = (blockData?.headline as string | undefined) ?? context.title ?? 'Pricing'
  if (plans.length === 0) return null
  return (
    <Section className="bg-mist-100 dark:bg-mist-950/50">
      <Container className="max-w-7xl flex flex-col gap-12">
        {headline && <Subheading className="text-center">{headline}</Subheading>}
        <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-mist-200 dark:border-mist-700 bg-mist-50 dark:bg-mist-900/30 p-8"
            >
              <h3 className="font-display text-xl font-semibold tracking-normal text-mist-950 dark:text-white">{plan.name}</h3>
              <p className="mt-4 font-display text-4xl font-semibold tracking-normal text-mist-950 dark:text-white">{plan.price}</p>
              {plan.description && (
                <Text size="md" className="mt-2">{plan.description}</Text>
              )}
              {plan.features && plan.features.length > 0 && (
                <ul className="mt-6 space-y-3 text-sm text-mist-700 dark:text-mist-400">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-mist-500 dark:text-mist-500" aria-hidden>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {(plan.ctaText ?? plan.ctaUrl) && (() => {
                const ctaHref = getSafeHref(plan.ctaUrl ?? '#')
                return isInternalUrl(ctaHref) ? (
                  <ButtonLink href={ctaHref} size="md" className="mt-8 w-full justify-center">
                    {plan.ctaText ?? 'Choose'}
                  </ButtonLink>
                ) : (
                  <a
                    href={ctaHref}
                    className="mt-8 inline-flex justify-center rounded-full bg-mist-950 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800 dark:bg-mist-300 dark:text-mist-950 dark:hover:bg-mist-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-mist-500 focus-visible:ring-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {plan.ctaText ?? 'Choose'}
                  </a>
                )
              })()}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
