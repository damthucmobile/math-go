'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { ContentBlock } from '@/lib/cms'
import {
  ourBlocksToEditorJs,
  editorJsToOurBlocks,
  type EditorJsOutput
} from '@/lib/block-editor-adapter'
import { getApiUrl } from '@/lib/admin-utils'
import type { EditorConfig } from '@editorjs/editorjs'

/** Component template option for the "Section component" block (pages/posts body only). */
export interface ComponentOption {
  id: number
  label?: string
  type?: string
}

interface BlockEditorProps {
  /** Initial blocks (our format). If empty and legacyHtml is set, that is converted to one paragraph. */
  value: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  /** Unique id for the holder div (required when multiple editors on page) */
  holderId: string
  /** Optional: legacy HTML to convert to initial block when value is empty */
  legacyHtml?: string
  placeholder?: string
  minHeight?: string
  className?: string
  /** When set, adds a "Section component" block so users can insert Hero, CTA, Pricing, etc. (use on pages/posts body). */
  componentOptions?: ComponentOption[]
}

export function BlockEditor({
  value,
  onChange,
  holderId,
  legacyHtml,
  placeholder = 'Start writing or add a block…',
  minHeight = '320px',
  className = '',
  componentOptions
}: BlockEditorProps) {
  const editorRef = useRef<{ save: () => Promise<EditorJsOutput> } | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const mountCountRef = useRef(0)
  const valueRef = useRef(value)
  const legacyHtmlRef = useRef(legacyHtml)
  const componentOptionsRef = useRef(componentOptions)
  valueRef.current = value
  legacyHtmlRef.current = legacyHtml
  componentOptionsRef.current = componentOptions
  const [isReady, setIsReady] = useState(false)
  const [holderMounted, setHolderMounted] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Delay rendering holder so React Strict Mode doesn't create two Editor.js instances
  useEffect(() => {
    const id = requestAnimationFrame(() => setHolderMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const handleChange = useCallback(async () => {
    try {
      const editor = editorRef.current
      if (!editor) return
      const output = await editor.save()
      const blocks = editorJsToOurBlocks(output)
      onChangeRef.current(blocks)
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[BlockEditor] save failed:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (!holderMounted) return
    mountCountRef.current += 1
    const runCount = mountCountRef.current
    const isStrictModeRemount = runCount > 1
    if (isStrictModeRemount) return

    let editor: { save: () => Promise<EditorJsOutput>; destroy: () => void; isReady: Promise<void> } | null = null

    const init = async () => {
      if (!holderRef.current) return
      const [
        EditorJS,
        Paragraph,
        Header,
        List,
        Quote,
        Code,
        Delimiter,
        Embed,
        ImageTool
      ] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/paragraph'),
        import('@editorjs/header'),
        import('@editorjs/list'),
        import('@editorjs/quote'),
        import('@editorjs/code'),
        import('@editorjs/delimiter'),
        import('@editorjs/embed'),
        import('@editorjs/image')
      ])

      const componentOptionsList = componentOptionsRef.current ?? []
      const ComponentTool = componentOptionsList.length > 0
        ? (await import('@/app/components/editor-tools/ComponentTool')).ComponentTool
        : null

      const uploadUrl = `${getApiUrl()}/api/media`
      const currentValue = valueRef.current
      const currentLegacyHtml = legacyHtmlRef.current
      const initialBlocks =
        currentValue.length > 0
          ? currentValue
          : currentLegacyHtml
            ? (await import('@/lib/block-editor-adapter')).htmlToSingleBlock(currentLegacyHtml)
            : []
      const initialData = ourBlocksToEditorJs(initialBlocks)

      // EditorJS typings don't match our ComponentTool; safe at runtime (same API shape)
      // @ts-expect-error ComponentTool constructor params don't match BlockToolConstructable; runtime-compatible
      editor = new EditorJS.default({
        holder: holderRef.current!,
        data: initialData,
        placeholder: false,
        onChange: handleChange,
        tools: {
          paragraph: {
            class: Paragraph.default,
            inlineToolbar: true,
            config: { placeholder: placeholder || 'Start writing or add a block…' }
          },
          header: {
            class: Header.default,
            config: { placeholder: 'Heading', levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
            inlineToolbar: true
          },
          list: {
            class: List.default,
            inlineToolbar: true
          },
          quote: {
            class: Quote.default,
            inlineToolbar: true,
            config: { quotePlaceholder: 'Quote', captionPlaceholder: 'Caption' }
          },
          code: Code.default,
          delimiter: Delimiter.default,
          embed: {
            class: Embed.default,
            config: {
              services: {
                youtube: { regex: /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/, embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>' },
                vimeo: { regex: /https?:\/\/(?:www\.)?vimeo\.com\/(?:video\/)?(\d+)/, embedUrl: 'https://player.vimeo.com/video/<%= remote_id %>' },
                twitter: { regex: /https?:\/\/twitter\.com\/\w+\/status\/(\d+)/, embedUrl: 'https://twitframe.com/show?url=<%= remote_id %>' }
              }
            }
          },
          image: {
            class: ImageTool.default,
            config: {
              endpoints: { byFile: uploadUrl },
              field: 'file',
              types: 'image/*',
              additionalRequestHeaders: {},
              uploader: {
                uploadByFile: async (file: File) => {
                  const formData = new FormData()
                  formData.append('file', file)
                  const res = await fetch(uploadUrl, { method: 'POST', body: formData, credentials: 'include' })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || 'Upload failed')
                  return { success: 1, file: { url: data.url } }
                }
              }
            }
          },
          ...(ComponentTool
            ? {
                component: {
                  class: ComponentTool,
                  config: { components: componentOptionsList }
                }
              }
            : {})
        },
        i18n: { messages: {} }
      } as EditorConfig)

      await editor.isReady
      editorRef.current = editor
      setIsReady(true)
    }

    init()
    return () => {
      if (mountCountRef.current > 1 && editor?.destroy) editor.destroy()
      if (mountCountRef.current > 1) editorRef.current = null
      setIsReady(false)
    }
  }, [holderId, placeholder, holderMounted]) // eslint-disable-line react-hooks/exhaustive-deps -- init once when holder ready

  if (!holderMounted) {
    return (
      <div
        data-block-editor
        className={`flex min-h-[320px] items-center justify-center rounded-xl border-2 border-dashed border-mist-200 bg-mist-50/80 dark:border-mist-700 dark:bg-mist-800/50 ${className}`}
        style={{ minHeight }}
      >
        <span className="text-sm text-mist-500 dark:text-mist-400">Loading block editor…</span>
      </div>
    )
  }

  return (
    <div
      data-block-editor
      className={`relative rounded-xl border-2 border-mist-200 bg-white dark:border-mist-700 dark:bg-mist-900/30 shadow-sm prose prose-slate dark:prose-invert max-w-none transition focus-within:border-mist-400 focus-within:ring-2 focus-within:ring-mist-500/20 ${className}`}
      style={{ minHeight }}
    >
      {!isReady && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/95 px-6 py-12 text-mist-500 dark:text-mist-400"
          aria-hidden
        >
          <span className="text-sm">Loading block editor…</span>
        </div>
      )}
      <div id={holderId} ref={holderRef} className="min-h-[280px] w-full px-4 py-3 text-mist-950 dark:text-white" />
    </div>
  )
}
