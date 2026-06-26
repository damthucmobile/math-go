import type { JsonValue } from '@/types/json'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import type { ComponentContextData } from '../types'

export function StatsSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const blockStats = blockData?.stats as { value: string; label: string }[] | undefined
  const stats: { value: string; label: string }[] = blockStats ?? context.sectionData?.stats ?? []
  const headline = (blockData?.headline as string | undefined) ?? context.title
  if (stats.length === 0) return null
  return (
    <Section className="bg-mist-50 dark:bg-mist-900/20">
      <Container className="max-w-7xl flex flex-col gap-12">
        {headline && <Subheading className="text-center">{headline}</Subheading>}
        <div
          className={`grid grid-cols-1 gap-10 sm:grid-cols-2 ${
            stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
          }`}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl font-semibold tracking-normal text-mist-950 dark:text-white">{stat.value}</p>
              <Text size="md" className="mt-1">{stat.label}</Text>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
