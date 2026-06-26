import type { ContentBlock } from '@/lib/cms'
import Image from 'next/image'
import { getSafeHref, getSafeImageSrc } from '@/lib/url-utils'
import { ComponentRenderer } from '@/app/components/ComponentRenderer'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Heading } from '@/app/components/oatmeal/elements/heading'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import type { ComponentContextData, ComponentRecord } from '@/app/components/ComponentRenderer'

type ProseGroup = { type: 'prose'; blocks: ContentBlock[] }
type ComponentGroup = { type: 'component'; block: ContentBlock }
type BlockGroup = ProseGroup | ComponentGroup

/** Split blocks into runs of consecutive prose blocks and single component blocks */
function groupBlocks(blocks: ContentBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []
  let proseRun: ContentBlock[] = []

  for (const block of blocks) {
    if (block.type === 'component' && block.componentId) {
      if (proseRun.length > 0) {
        groups.push({ type: 'prose', blocks: proseRun })
        proseRun = []
      }
      groups.push({ type: 'component', block })
    } else {
      proseRun.push(block)
    }
  }
  if (proseRun.length > 0) {
    groups.push({ type: 'prose', blocks: proseRun })
  }
  return groups
}

interface BlockRendererProps {
  blocks: ContentBlock[]
  className?: string
  contextData?: ComponentContextData
  getComponent?: (id: number) => ComponentRecord | null
}

export function BlockRenderer({ blocks, className = '', contextData, getComponent }: BlockRendererProps) {
  if (!blocks?.length) return null
  const flushSections = className.includes('space-y-0')
  const wrapperClass = className.trim() ? `block-renderer ${className}` : 'block-renderer space-y-6'
  const groups = groupBlocks(blocks)

  return (
    <div className={wrapperClass}>
      {groups.map((group, index) =>
        group.type === 'prose' ? (
          <ProseSection key={`prose-${group.blocks[0]?.id ?? 0}`} blocks={group.blocks} index={index} />
        ) : (
          <div key={`component-${group.block.id}`} className={flushSections ? 'my-0' : 'my-8'}>
            {getComponent && contextData && (() => {
              const component = getComponent(group.block.componentId!)
              if (!component) return null
              return (
                <ComponentRenderer
                  component={component}
                  contextData={contextData}
                  variant="default"
                  blockId={group.block.id}
                />
              )
            })()}
          </div>
        )
      )}
    </div>
  )
}

/** Alternating mist backgrounds for prose sections (light / slightly darker / light) */
const proseSectionBgClasses = [
  'bg-mist-50 dark:bg-mist-900/20',
  'bg-mist-100 dark:bg-mist-950/50',
  'bg-mist-50 dark:bg-mist-900/20',
]

function ProseSection({ blocks, index }: { blocks: ContentBlock[]; index: number }) {
  const bgClass = proseSectionBgClasses[index % proseSectionBgClasses.length]
  return (
    <Section className={`py-12 sm:py-16 ${bgClass}`}>
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-6 prose prose-lg max-w-none prose-headings:font-display prose-headings:text-mist-950 dark:prose-headings:text-white prose-p:text-mist-700 dark:prose-p:text-mist-400 prose-a:text-mist-950 dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-strong:text-mist-950 dark:prose-strong:text-white prose-ul:text-mist-700 dark:prose-ul:text-mist-400 prose-li:text-mist-700 dark:prose-li:text-mist-400">
          {blocks.map((block) => (
            <BlockContent key={block.id} block={block} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

function BlockContent({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <Text size="lg" className="leading-relaxed">
          {block.content?.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < (block.content!.split('\n').length ?? 1) - 1 && <br />}
            </span>
          )) ?? ''}
        </Text>
      )
    case 'heading': {
      const level = Math.min(6, Math.max(1, block.level ?? 2))
      const content = block.content ?? ''
      const sharedClass = 'mt-8 first:mt-0 font-display tracking-normal text-mist-950 dark:text-white'
      if (level === 1) return <Heading className={sharedClass}>{content}</Heading>
      if (level === 2) return <Subheading className={sharedClass}>{content}</Subheading>
      const Tag = `h${level}` as 'h3' | 'h4' | 'h5' | 'h6'
      const sizeClass = level === 3 ? 'text-2xl' : level === 4 ? 'text-xl' : level === 5 ? 'text-lg' : 'text-base'
      return <Tag className={`${sizeClass} font-semibold ${sharedClass}`}>{content}</Tag>
    }
    case 'list': {
      const ListTag = block.listType === 'ordered' ? 'ol' : 'ul'
      const items = block.items ?? []
      return (
        <ListTag
          className={
            block.listType === 'ordered'
              ? 'list-decimal list-inside space-y-2 text-mist-700 dark:text-mist-400 text-base/7'
              : 'list-disc list-inside space-y-2 text-mist-700 dark:text-mist-400 text-base/7'
          }
        >
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      )
    }
    case 'quote':
      return (
        <blockquote className="border-l-4 border-mist-500 dark:border-mist-500 pl-6 not-italic">
          <Text size="lg" className="text-mist-700 dark:text-mist-300">
            {block.content ?? ''}
          </Text>
          {block.caption && (
            <cite className="mt-2 block text-sm not-italic text-mist-500 dark:text-mist-400">— {block.caption}</cite>
          )}
        </blockquote>
      )
    case 'code':
      return (
        <pre className="overflow-x-auto rounded-xl bg-mist-900 dark:bg-mist-950 px-4 py-3 text-sm text-mist-100">
          <code>{block.content ?? ''}</code>
        </pre>
      )
    case 'separator':
      return <hr className="border-mist-200 dark:border-mist-700 my-8" />
    case 'image': {
      const safeSrc = getSafeImageSrc(block.src)
      if (!safeSrc) return null
      const isUpload = typeof safeSrc === 'string' && safeSrc.startsWith('/uploads')
      return (
        <figure className="my-6">
          {isUpload ? (
            <span className="relative block aspect-video w-full overflow-hidden rounded-xl border border-mist-200 dark:border-mist-700">
              <Image
                src={safeSrc}
                alt={block.alt ?? ''}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </span>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={safeSrc}
              alt={block.alt ?? ''}
              className="rounded-xl border border-mist-200 dark:border-mist-700 w-full h-auto"
            />
          )}
          {block.caption && (
            <figcaption className="mt-2 text-sm text-mist-500 dark:text-mist-400">{block.caption}</figcaption>
          )}
        </figure>
      )
    }
    case 'embed': {
      const service = (block as Record<string, string | number | string[] | undefined>).service as string | undefined
      const embed = (block as Record<string, string | number | string[] | undefined>).embed as string | undefined
      const source = (block as Record<string, string | number | string[] | undefined>).source as string | undefined
      const embedUrl = embed || source
      if (!embedUrl) return null
      if (service === 'youtube' || embedUrl.includes('youtube')) {
        const match = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
        const vid = match ? match[1] : embedUrl
        return (
          <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-mist-200 dark:border-mist-700">
            <iframe
              src={`https://www.youtube.com/embed/${vid}`}
              title="YouTube embed"
              className="h-full w-full"
              allowFullScreen={true}
            />
          </div>
        )
      }
      if (service === 'vimeo' || embedUrl.includes('vimeo')) {
        const match = embedUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)
        const vid = match ? match[1] : embedUrl
        return (
          <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-mist-200 dark:border-mist-700">
            <iframe
              src={`https://player.vimeo.com/video/${vid}`}
              title="Vimeo embed"
              className="h-full w-full"
              allowFullScreen={true}
            />
          </div>
        )
      }
      const safeHref = getSafeHref(embedUrl)
      return (
        <a
          href={safeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mist-700 dark:text-mist-300 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-mist-500 focus-visible:ring-offset-2 rounded"
        >
          {embedUrl}
        </a>
      )
    }
    default:
      return (
        <Text size="md">
          {typeof block.content === 'string' ? block.content : ''}
        </Text>
      )
  }
}
