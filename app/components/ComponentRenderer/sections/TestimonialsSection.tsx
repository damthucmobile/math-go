import type { JsonValue } from '@/types/json'
import { getSafeImageSrc } from '../utils'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import type { ComponentContextData } from '../types'

export function TestimonialsSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const blockItems = blockData?.testimonials as { quote: string; author: string; role?: string; avatarUrl?: string }[] | undefined
  const items: { quote: string; author: string; role?: string; avatarUrl?: string }[] = blockItems ?? context.sectionData?.testimonials ?? []
  const headline = (blockData?.headline as string | undefined) ?? context.title
  if (items.length === 0) return null
  return (
    <Section className="bg-mist-100 dark:bg-mist-950/50">
      <Container className="max-w-7xl flex flex-col gap-12">
        {headline && <Subheading className="text-center">{headline}</Subheading>}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
          {items.map((t, i) => (
            <blockquote key={i} className="rounded-2xl border border-mist-200 dark:border-mist-700 bg-mist-50 dark:bg-mist-900/30 p-8">
              <Text size="lg" className="text-pretty">&ldquo;{t.quote}&rdquo;</Text>
              <footer className="mt-4 flex items-center gap-4">
                {getSafeImageSrc(t.avatarUrl) ? (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-mist-200 dark:bg-mist-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getSafeImageSrc(t.avatarUrl)} alt={t.author} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div>
                  <p className="font-semibold text-mist-950 dark:text-white">{t.author}</p>
                  {t.role && <Text size="md" className="text-mist-600 dark:text-mist-500">{t.role}</Text>}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </Section>
  )
}
