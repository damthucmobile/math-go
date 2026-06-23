import { Suspense } from 'react'
import { listRecordsAsync, getRecordAsync } from '@/lib/cms'
import { parseSectionData } from '@/lib/section-data'
import { ComponentRenderer } from '@/app/components/ComponentRenderer'
import { BlockRenderer } from '@/app/components/BlockRenderer'
import { RichContent } from '@/app/components/RichContent'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Text } from '@/app/components/oatmeal/elements/text'
import { HeroSimpleCentered } from '@/app/components/oatmeal/sections/hero-simple-centered'
import { SkeletonCard } from '@/app/components/Skeleton'
import type { ContentBlock } from '@/lib/cms'
import type { ComponentContextData, ComponentRecord } from '@/app/components/ComponentRenderer'

export default async function Home() {
  const [homepage, components] = await Promise.all([
    getRecordAsync('homepage') as Promise<{
      id?: number
      title?: string
      body?: string
      content_blocks?: ContentBlock[]
      heroComponentId?: number
      sectionData?: string
    } | null>,
    listRecordsAsync('components') as Promise<{ id: number; type: string; label?: string; slug?: string }[]>,
  ])
  const defaultHeroComponent = components.find((c) => c.type === 'hero')

  const title = homepage?.title?.trim() ?? ''
  const body = homepage?.body ?? ''
  const contentBlocks = Array.isArray(homepage?.content_blocks) ? homepage.content_blocks : []
  const hasBlocks = contentBlocks.length > 0
  const heroComponentId = homepage?.heroComponentId && homepage.heroComponentId > 0
    ? Number(homepage.heroComponentId)
    : 0
  const heroComponent =
    heroComponentId > 0
      ? ((await getRecordAsync('components', String(heroComponentId))) as {
          id: number
          type: string
          label?: string
          slug?: string
        } | null)
      : defaultHeroComponent ?? null

  const contextData: ComponentContextData = {
    title,
    body,
    content: body,
    slug: undefined,
    sectionData: parseSectionData(homepage?.sectionData),
  }

  return (
    <>
      {heroComponent ? (
        <ComponentRenderer
          component={heroComponent}
          contextData={contextData}
          variant="default"
          className="py-16"
        />
      ) : (title || body) ? (
        <HeroSimpleCentered
          id="hero"
          headline={title || null}
          subheadline={body ? <Text size="lg">{body}</Text> : null}
        />
      ) : null}

      {(hasBlocks || body) && (
        hasBlocks ? (
          <Suspense
            fallback={
              <Section className="bg-mist-50 dark:bg-mist-900/20">
                <Container className="max-w-7xl flex flex-col gap-8">
                  <SkeletonCard lines={2} />
                  <SkeletonCard lines={3} />
                </Container>
              </Section>
            }
          >
            <BlockRenderer
              blocks={contentBlocks}
              contextData={contextData}
              getComponent={(id) => (components.find((c) => c.id === id) ?? null) as ComponentRecord | null}
              className="space-y-0"
            />
          </Suspense>
        ) : (
          <Section className="bg-mist-50 dark:bg-mist-900/20">
            <Container className="max-w-3xl">
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-mist-950 dark:prose-headings:text-white prose-p:text-mist-700 dark:prose-p:text-mist-400 prose-a:text-mist-950 dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4">
                <RichContent content={body} />
              </div>
            </Container>
          </Section>
        )
      )}
    </>
  )
}
