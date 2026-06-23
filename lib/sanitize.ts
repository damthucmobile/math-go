import DOMPurify from 'isomorphic-dompurify'

/** Allowed tags/attrs for header/footer HTML snippets; strips scripts and event handlers. */
const SnippetOptions = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
}

/**
 * Sanitize HTML for safe use in header/footer snippets (e.g. dangerouslySetInnerHTML).
 * Use for any admin-editable HTML rendered on the public site.
 */
export function sanitizeHtmlSnippet(html: string): string {
  if (!html || typeof html !== 'string') return ''
  return DOMPurify.sanitize(html, SnippetOptions)
}
