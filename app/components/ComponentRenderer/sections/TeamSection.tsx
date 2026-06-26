import type { JsonValue } from '@/types/json'
import { getSafeImageSrc } from '../utils'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import type { ComponentContextData } from '../types'

export function TeamSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const blockMembers = blockData?.team as { name: string; role: string; imageUrl?: string; bio?: string }[] | undefined
  const members: { name: string; role: string; imageUrl?: string; bio?: string }[] = blockMembers ?? context.sectionData?.team ?? []
  const headline = (blockData?.headline as string | undefined) ?? context.title
  if (members.length === 0) return null
  return (
    <Section className="bg-mist-50 dark:bg-mist-900/20">
      <Container className="max-w-7xl flex flex-col gap-12">
        {headline && <Subheading className="text-center">{headline}</Subheading>}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {members.map((m, i) => (
            <div key={i} className="text-center">
              {getSafeImageSrc(m.imageUrl) ? (
                <div className="mx-auto aspect-square w-32 overflow-hidden rounded-full bg-mist-200 dark:bg-mist-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getSafeImageSrc(m.imageUrl)} alt={m.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-mist-200 dark:bg-mist-700 font-display text-2xl font-semibold text-mist-500 dark:text-mist-400">
                  {m.name.charAt(0)}
                </div>
              )}
              <h3 className="mt-4 font-display text-xl font-semibold tracking-normal text-mist-950 dark:text-white">{m.name}</h3>
              <Text size="md" className="text-mist-600 dark:text-mist-500">{m.role}</Text>
              {m.bio && <Text size="md" className="mt-2 text-pretty">{m.bio}</Text>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
