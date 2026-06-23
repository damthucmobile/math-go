import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRecordAsync, listRecordsAsync } from '@/lib/cms'
import { parseSectionData } from '@/lib/section-data'
import { RichContent } from '@/app/components/RichContent'
import { BlockRenderer } from '@/app/components/BlockRenderer'
import { ComponentRenderer } from '@/app/components/ComponentRenderer'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Heading } from '@/app/components/oatmeal/elements/heading'
import { Text } from '@/app/components/oatmeal/elements/text'
import { LinkEl } from '@/app/components/oatmeal/elements/link'
import { CallToActionSimpleCentered } from '@/app/components/oatmeal/sections/call-to-action-simple-centered'
import { ButtonLink } from '@/app/components/oatmeal/elements/button'
import { getSafeImageSrc } from '@/lib/url-utils'
import type { ContentBlock } from '@/lib/cms'
import type { ComponentContextData, ComponentRecord } from '@/app/components/ComponentRenderer'

interface Props {
  params: Promise<{ id: string }>
}

/** Pre-render all posts at build time; data from Blob on Vercel (seeded from repo if empty). */
export async function generateStaticParams() {
  const posts = (await listRecordsAsync('posts')) as { id: number }[]
  return posts.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = (await getRecordAsync('posts', id)) as { title?: string; excerpt?: string } | null
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title ?? 'Post',
    description: post.excerpt ?? undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const [post, components] = await Promise.all([
    getRecordAsync('posts', id) as Promise<{
      id: number
      title: string
      excerpt?: string
      content?: string
      content_blocks?: ContentBlock[]
      featuredImage?: { url: string; alt?: string } | null
      heroComponentId?: number
      sectionData?: string
    } | null>,
    listRecordsAsync('components') as Promise<{ id: number; type: string; label?: string; slug?: string }[]>,
  ])
  if (!post) notFound()

  const hasBlocks = Array.isArray(post.content_blocks) && post.content_blocks.length > 0
  const featuredImage = post.featuredImage?.url ? post.featuredImage : null
  const heroComponent =
    post.heroComponentId && post.heroComponentId > 0
      ? ((await getRecordAsync('components', String(post.heroComponentId))) as {
          id: number
          type: string
          label?: string
          slug?: string
        } | null) ?? components.find((c) => c.id === post.heroComponentId) ?? null
      : null

  const contextData: ComponentContextData = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    slug: undefined,
    featuredImage: featuredImage ?? undefined,
    sectionData: parseSectionData(post.sectionData),
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
              <LinkEl href="/posts" itemProp="item">Posts</LinkEl>
            </li>
            <li aria-hidden className="text-mist-400 dark:text-mist-600">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page">
              <span itemProp="name" className="text-mist-500 dark:text-mist-400">{post.title}</span>
            </li>
          </ol>
        </Container>
      </nav>

      <article>
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
            alt={featuredImage.alt ?? post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {hasBlocks && !heroComponent && (
        <Section className="border-b border-mist-200/60 bg-mist-50 dark:border-mist-800/60 dark:bg-mist-900/30 py-10 sm:py-12" aria-labelledby="post-title">
          <Container className="max-w-3xl">
            <Heading id="post-title" className="text-3xl sm:text-4xl">{post.title}</Heading>
            {post.excerpt && (
              <Text size="lg" className="mt-3 text-pretty leading-relaxed">
                {post.excerpt}
              </Text>
            )}
          </Container>
        </Section>
      )}

      {hasBlocks ? (
        <>
          <BlockRenderer
            blocks={post.content_blocks ?? []}
            contextData={contextData}
            getComponent={(id) => (components.find((c) => c.id === id) ?? null) as ComponentRecord | null}
            className="space-y-0"
          />
        </>
      ) : (
        <>
          <Section className="bg-mist-50 dark:bg-mist-900/20 py-12 sm:py-16">
            <Container className="max-w-3xl">
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-mist-950 dark:prose-headings:text-white prose-p:text-mist-700 dark:prose-p:text-mist-400 prose-p:leading-relaxed prose-a:text-mist-950 dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-strong:text-mist-950 dark:prose-strong:text-white prose-ul:text-mist-700 dark:prose-ul:text-mist-400 prose-li:text-mist-700 dark:prose-li:text-mist-400 prose-blockquote:border-mist-500 prose-blockquote:text-mist-700 dark:prose-blockquote:text-mist-300">
                {!heroComponent && (
                  <>
                    <Heading className="text-3xl sm:text-4xl not-prose">{post.title}</Heading>
                    {post.excerpt && (
                      <Text size="lg" className="mt-3 text-pretty not-prose">
                        {post.excerpt}
                      </Text>
                    )}
                  </>
                )}
                <div className={heroComponent ? '' : 'mt-8'}>
                  <RichContent content={post.content ?? ''} />
                </div>
              </div>
            </Container>
          </Section>
        </>
      )}
      </article>
    </div>
  )
}
