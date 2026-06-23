/**
 * Adapter between our ContentBlock[] format and Editor.js OutputData.
 * Editor.js uses: blocks[].id, type, data (tool-specific).
 * We use: type, id, content?, level?, src?, items?, listType?, etc.
 */

import type { ContentBlock } from '@/lib/cms'
import type { JsonValue } from '@/types/json'

/** id is optional to align with Editor.js OutputBlockData (save() can return blocks without id). */
export interface EditorJsBlock {
  id?: string
  type: string
  data: Record<string, JsonValue>
}

export interface EditorJsOutput {
  time?: number
  blocks: EditorJsBlock[]
  version?: string
}

/** Convert our content_blocks to Editor.js initial data. */
export function ourBlocksToEditorJs(blocks: ContentBlock[]): EditorJsOutput {
  const editorBlocks: EditorJsBlock[] = blocks.map((b) => {
    const id = b.id || `block-${Math.random().toString(36).slice(2, 11)}`
    switch (b.type) {
      case 'paragraph':
        return { id, type: 'paragraph', data: { text: b.content ?? '' } }
      case 'heading':
        return { id, type: 'header', data: { text: b.content ?? '', level: b.level ?? 2 } }
      case 'list':
        return {
          id,
          type: 'list',
          data: {
            style: b.listType === 'ordered' ? 'ordered' : 'unordered',
            items: b.items ?? []
          }
        }
      case 'quote':
        return { id, type: 'quote', data: { text: b.content ?? '', caption: b.caption ?? '' } }
      case 'code':
        return { id, type: 'code', data: { code: b.content ?? '' } }
      case 'separator':
        return { id, type: 'delimiter', data: {} }
      case 'image':
        return {
          id,
          type: 'image',
          data: {
            file: { url: b.src ?? '' },
            caption: b.caption ?? '',
            withBorder: false,
            stretched: false,
            withBackground: false
          }
        }
      case 'embed':
        return {
          id,
          type: 'embed',
          data: {
            service: (b as Record<string, string | number | undefined>).service ?? '',
            embed: (b as Record<string, string | number | undefined>).embed ?? '',
            source: (b as Record<string, string | number | undefined>).source ?? ''
          }
        }
      case 'component':
        return {
          id,
          type: 'component',
          data: { componentId: b.componentId ?? 0 }
        }
      default:
        return { id, type: 'paragraph', data: { text: String(b.content ?? '') } }
    }
  })
  return { blocks: editorBlocks }
}

/** Convert Editor.js save output to our content_blocks. */
export function editorJsToOurBlocks(output: EditorJsOutput): ContentBlock[] {
  if (!output?.blocks || !Array.isArray(output.blocks)) return []
  return output.blocks.map((b) => {
    const id = b.id || `block-${Math.random().toString(36).slice(2, 11)}`
    const d = b.data || {}
    switch (b.type) {
      case 'paragraph':
        return { type: 'paragraph', id, content: String(d.text ?? '') }
      case 'header':
        return {
          type: 'heading',
          id,
          content: String(d.text ?? ''),
          level: typeof d.level === 'number' && d.level >= 1 && d.level <= 6 ? d.level : 2
        }
      case 'list':
        return {
          type: 'list',
          id,
          listType: d.style === 'ordered' ? 'ordered' : 'bullet',
          items: Array.isArray(d.items) ? d.items.map(String) : []
        }
      case 'quote':
        return {
          type: 'quote',
          id,
          content: String(d.text ?? ''),
          caption: typeof d.caption === 'string' ? d.caption : undefined
        }
      case 'code':
        return { type: 'code', id, content: String(d.code ?? '') }
      case 'delimiter':
        return { type: 'separator', id }
      case 'image': {
        const file = d.file as { url?: string } | undefined
        const url = file?.url ?? ''
        return {
          type: 'image',
          id,
          src: url,
          caption: typeof d.caption === 'string' ? d.caption : undefined
        }
      }
      case 'embed':
        return {
          type: 'embed',
          id,
          service: typeof d.service === 'string' ? d.service : undefined,
          embed: typeof d.embed === 'string' ? d.embed : undefined,
          source: typeof d.source === 'string' ? d.source : undefined
        }
      case 'component': {
        const n = typeof d.componentId === 'number' ? d.componentId : Number(d.componentId)
        return { type: 'component', id, componentId: Number.isFinite(n) && n > 0 ? n : undefined }
      }
      default:
        return { type: 'paragraph', id, content: String((d as { text?: string }).text ?? '') }
    }
  })
}

/** Convert legacy HTML content to a single paragraph block for initial block editor state. */
export function htmlToSingleBlock(html: string): ContentBlock[] {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return []
  return [{ type: 'paragraph', id: `block-${Math.random().toString(36).slice(2, 11)}`, content: text }]
}

/** Convert our content_blocks to HTML (for richtext fields that store HTML, not content_blocks). */
export function ourBlocksToHtml(blocks: ContentBlock[]): string {
  if (!blocks?.length) return ''
  const parts = blocks.map((b) => {
    const text = escapeHtml(String(b.content ?? '').trim())
    switch (b.type) {
      case 'paragraph':
        return text ? `<p>${text}</p>` : ''
      case 'heading': {
        const level = Math.min(6, Math.max(1, b.level ?? 2))
        return text ? `<h${level}>${text}</h${level}>` : ''
      }
      case 'list': {
        const tag = b.listType === 'ordered' ? 'ol' : 'ul'
        const items = (b.items ?? []).map((item) => `<li>${escapeHtml(String(item))}</li>`).join('')
        return items ? `<${tag}>${items}</${tag}>` : ''
      }
      case 'quote':
        return text ? `<blockquote><p>${text}</p></blockquote>` : ''
      case 'code':
        return text ? `<pre><code>${text}</code></pre>` : ''
      case 'separator':
        return '<hr />'
      case 'image': {
        const src = (b.src ?? '').trim()
        if (!src) return ''
        const alt = escapeHtml(String((b as { alt?: string }).alt ?? '').trim())
        return `<p><img src="${escapeHtml(src)}"${alt ? ` alt="${alt}"` : ''} /></p>`
      }
      default:
        return text ? `<p>${text}</p>` : ''
    }
  })
  return parts.filter(Boolean).join('\n')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
