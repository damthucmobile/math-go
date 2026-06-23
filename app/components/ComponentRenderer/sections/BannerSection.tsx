import type { JsonValue } from '@/types/json'
import { getSafeHref, isInternalUrl } from '../utils'
import { Text } from '@/app/components/oatmeal/elements/text'
import { ButtonLink } from '@/app/components/oatmeal/elements/button'
import type { ComponentContextData } from '../types'

export function BannerSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const b = (blockData as { text?: string; linkText?: string; linkUrl?: string; style?: string } | undefined) ?? context.sectionData?.banner ?? {}
  const text = b.text ?? context.title ?? context.excerpt ?? ''
  const linkText = b.linkText
  const linkUrl = getSafeHref(b.linkUrl ?? '#')
  const style = (b.style as 'info' | 'success' | 'warning') ?? 'info'
  if (!text) return null
  const styles = {
    info: 'bg-mist-200/80 dark:bg-mist-800/50 text-mist-800 dark:text-mist-200 border-mist-300 dark:border-mist-600',
    success: 'bg-mist-200/80 dark:bg-mist-800/50 text-mist-800 dark:text-mist-200 border-mist-300 dark:border-mist-600',
    warning: 'bg-mist-200/80 dark:bg-mist-800/50 text-mist-800 dark:text-mist-200 border-mist-300 dark:border-mist-600'
  }
  return (
    <div className="w-full">
      <section
        className={`px-8 py-8 sm:px-10 sm:py-14 ${styles[style]}`}
        aria-label={linkText ? undefined : 'Announcement'}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <Text size="md" className="font-medium leading-relaxed max-w-xl mx-auto">{text}</Text>
          {linkText && (
            <div className="pt-2">
              {isInternalUrl(linkUrl) ? (
                <ButtonLink href={linkUrl} size="lg">
                  {linkText}
                </ButtonLink>
              ) : (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-mist-950 px-4 py-2 text-sm/7 font-medium text-white hover:bg-mist-800 dark:bg-mist-300 dark:text-mist-950 dark:hover:bg-mist-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-mist-500 focus-visible:ring-offset-2"
                >
                  {linkText}
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
