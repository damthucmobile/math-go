import type { JsonValue } from '@/types/json'
import { getSafeImageSrc } from '../utils'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import type { ComponentContextData } from '../types'

export function FeaturedSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const sd = (blockData as { headline?: string; description?: string; imageUrl?: string } | undefined) ?? context.sectionData?.featured
  const headline = sd?.headline ?? context.title ?? ''
  const description = sd?.description ?? context.excerpt ?? context.content ?? context.body ?? ''
  const imageUrl = sd?.imageUrl ?? context.featuredImage?.url
  if (!headline && !description && !imageUrl) return null
  return (
    <Section className="bg-mist-50 dark:bg-mist-900/20">
      <Container className="max-w-7xl flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex max-w-2xl flex-col gap-6">
          {headline && <Subheading>{headline}</Subheading>}
          {description && <Text size="lg" className="text-pretty">{description}</Text>}
        </div>
        {getSafeImageSrc(imageUrl) && (
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-mist-200 dark:bg-mist-800 lg:max-w-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getSafeImageSrc(imageUrl)} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </Container>
    </Section>
  )
}
