import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { listRecordsAsync, getRecordAsync } from '@/lib/cms'
import { parseSectionData } from '@/lib/section-data'
import { RichContent } from '@/app/components/RichContent'
import { BlockRenderer } from '@/app/components/BlockRenderer'
import { ComponentRenderer } from '@/app/components/ComponentRenderer'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { LinkEl } from '@/app/components/oatmeal/elements/link'
import { getSafeImageSrc } from '@/lib/url-utils'
import type { ContentBlock } from '@/lib/cms'
import type { ComponentContextData, ComponentRecord } from '@/app/components/ComponentRenderer'

interface Props {
  params: Promise<{ slug: string }>
}

/** Pre-render all pages at build time; data from Blob on Vercel (seeded from repo if empty). */
export async function generateStaticParams() {
  const pages = (await listRecordsAsync('pages')) as { slug: string }[]
  return pages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pages = (await listRecordsAsync('pages')) as { slug: string; title: string }[]
  const page = pages.find((p) => p.slug === slug)
  if (!page) return { title: 'Page not found' }
  return { title: page.title }
}

export default async function PageBySlug({ params }: Props) {
  const { slug } = await params
  const [pages, components] = await Promise.all([
    listRecordsAsync('pages') as Promise<{
      id: number
      slug: string
      title: string
      body?: string
      content_blocks?: ContentBlock[]
      sectionData?: string
    }[]>,
    listRecordsAsync('components') as Promise<{ id: number; type: string; label?: string; slug?: string }[]>,
  ])
  const page = pages.find((p) => p.slug === slug)
  if (!page) notFound()

  const hasBlocks = Array.isArray(page.content_blocks) && page.content_blocks.length > 0
  const pageWithMeta = page as typeof page & {
    featuredImage?: { url: string; alt?: string } | null
    heroComponentId?: number
  }
  const featuredImage = pageWithMeta.featuredImage?.url ? pageWithMeta.featuredImage : null
  const heroComponent =
    pageWithMeta.heroComponentId && pageWithMeta.heroComponentId > 0
      ? ((await getRecordAsync('components', String(pageWithMeta.heroComponentId))) as {
          id: number
          type: string
          label?: string
          slug?: string
        } | null) ?? components.find((c) => c.id === pageWithMeta.heroComponentId) ?? null
      : null

  const contextData: ComponentContextData = {
    title: page.title,
    body: page.body,
    content: page.body,
    slug: page.slug,
    featuredImage: featuredImage ?? undefined,
    sectionData: parseSectionData(pageWithMeta.sectionData ?? page.sectionData),
  }

  return (
    <div className="bg-mist-100 dark:bg-mist-950">
      <nav
        className="border-b border-mist-200/60 bg-mist-50/80 py-3 dark:border-mist-800/60 dark:bg-mist-900/30"
        aria-label="Breadcrumb"
      >
        <Container>
          <ol className="flex items-center gap-2 text-sm list-none" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <LinkEl href="/" itemProp="item">← Home</LinkEl>
            </li>
            <li aria-hidden className="text-mist-400 dark:text-mist-600">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <LinkEl href="/pages" itemProp="item">Pages</LinkEl>
            </li>
            <li aria-hidden className="text-mist-400 dark:text-mist-600">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page">
              <span itemProp="name" className="text-mist-500 dark:text-mist-400">{page.title}</span>
            </li>
          </ol>
        </Container>
      </nav>

      {heroComponent && (
        <ComponentRenderer
          component={heroComponent}
          contextData={contextData}
          variant="compact"
          className="border-b border-mist-200/60 dark:border-mist-800/60"
        />
      )}

      {featuredImage && getSafeImageSrc(featuredImage.url) && !heroComponent && (
        <div className="relative w-full aspect-video overflow-hidden bg-mist-200 dark:bg-mist-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getSafeImageSrc(featuredImage.url)}
            alt={featuredImage.alt ?? page.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {hasBlocks && !heroComponent && (
        <Section className="border-b border-mist-200/60 bg-mist-50 dark:border-mist-800/60 dark:bg-mist-900/30 py-10 sm:py-12" aria-labelledby="page-title">
          <Container>
            <Subheading id="page-title">{page.title}</Subheading>
          </Container>
        </Section>
      )}

      {hasBlocks ? (
        <BlockRenderer
          blocks={page.content_blocks ?? []}
          contextData={contextData}
          getComponent={(id) => (components.find((c) => c.id === id) ?? null) as ComponentRecord | null}
          className="space-y-0"
        />
      ) : (
        <Section className="bg-mist-50 dark:bg-mist-900/20 py-12 sm:py-16">
          <Container className="max-w-3xl">
            <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-mist-950 dark:prose-headings:text-white prose-p:text-mist-700 dark:prose-p:text-mist-400 prose-a:text-mist-950 dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-strong:text-mist-950 dark:prose-strong:text-white">
              {!heroComponent && <Subheading>{page.title}</Subheading>}
              <div className={heroComponent ? '' : 'mt-8'}>
                <RichContent content={page.body ?? ''} />
              </div>
            </article>
          </Container>
        </Section>
      )}
    </div>
  )
}
