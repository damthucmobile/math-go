import DOMPurify from 'isomorphic-dompurify'

/** Allowed tags/attrs for TipTap-style content; strips scripts and event handlers. */
const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
}

/**
 * Renders body/content that may be plain text or TipTap HTML.
 * HTML is sanitized to prevent XSS. Use on public pages (pages/[slug], posts/[id]).
 */
export function RichContent({ content }: { content: string }) {
  if (!content) {
    return null
  }

  const isHtml = content.trimStart().startsWith('<')

  if (isHtml) {
    let sanitized = DOMPurify.sanitize(content, SANITIZE_OPTIONS)
    // Ensure external links (target="_blank") have rel="noopener noreferrer" for security and accessibility
    sanitized = sanitized.replace(
      /<a (?=[^>]*target="_blank")(?!([^>]*rel=))/gi,
      '<a rel="noopener noreferrer" '
    )
    return (
      <div
        className="prose prose-lg max-w-none text-body prose-headings:font-display prose-headings:text-mist-950 dark:prose-headings:text-white prose-p:text-body prose-p:text-mist-700 dark:prose-p:text-mist-400 prose-a:text-mist-950 dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    )
  }

  return (
    <div className="whitespace-pre-wrap text-body text-mist-700 dark:text-mist-400 leading-relaxed">
      {content}
    </div>
  )
}
