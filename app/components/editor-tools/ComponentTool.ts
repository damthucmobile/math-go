/**
 * Editor.js block tool: insert a section component (Hero, CTA, Pricing, etc.).
 * Data is filled from the page/post when rendered; this block only stores componentId.
 */

export interface ComponentOption {
  id: number
  label?: string
  type?: string
}

interface ComponentToolData {
  componentId?: number
}

interface ComponentToolConfig {
  components?: ComponentOption[]
}

interface ComponentToolConstructorParams {
  api: { i18n: { t: (key: string) => string }; notifier: { show: (msg: string) => void } }
  data: ComponentToolData
  config: ComponentToolConfig
  readOnly?: boolean
}

const TOOLBOX_TITLE = 'Section component'
const TOOLBOX_ICON =
  '<svg width="17" height="15" viewBox="0 0 17 15" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h7v7H0V0zm10 0h7v7h-7V0zM0 8h7v7H0V8zm10 0h7v7h-7V8z" fill="currentColor"/></svg>'

export class ComponentTool {
  private api: ComponentToolConstructorParams['api']
  private data: ComponentToolData
  private config: ComponentToolConfig
  private readOnly: boolean
  private wrapper: HTMLElement | null = null
  private select: HTMLSelectElement | null = null

  static get toolbox() {
    return { title: TOOLBOX_TITLE, icon: TOOLBOX_ICON }
  }

  constructor({ api, data, config, readOnly = false }: ComponentToolConstructorParams) {
    this.api = api
    this.data = data ?? {}
    this.config = config ?? {}
    this.readOnly = readOnly
  }

  render(): HTMLElement {
    const components = Array.isArray(this.config.components) ? this.config.components : []
    const selectedId = Number(this.data.componentId) || 0

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'component-block-tool'
    this.wrapper.setAttribute('data-component-tool', 'true')

    const label = document.createElement('label')
    label.className = 'cdx-field__label'
    label.textContent = 'Section template'
    label.style.display = 'block'
    label.style.marginBottom = '6px'
    label.style.fontSize = '13px'
    label.style.fontWeight = '500'
    label.style.color = '#6b7280'

    this.select = document.createElement('select')
    this.select.className = 'cdx-input component-block-select'
    this.select.style.width = '100%'
    this.select.style.maxWidth = '320px'
    this.select.style.padding = '8px 12px'
    this.select.style.border = '1px solid #e5e7eb'
    this.select.style.borderRadius = '6px'
    this.select.style.fontSize = '14px'
    this.select.style.background = '#fff'
    this.select.disabled = this.readOnly
    this.select.setAttribute('aria-label', 'Choose section template')

    const placeholder = document.createElement('option')
    placeholder.value = '0'
    placeholder.textContent = '— Choose a section template —'
    this.select.appendChild(placeholder)

    for (const c of components) {
      const opt = document.createElement('option')
      opt.value = String(c.id)
      opt.textContent = c.label ? `${c.label} (${c.type ?? ''})` : `Component ${c.id}`
      if (c.id === selectedId) opt.selected = true
      this.select.appendChild(opt)
    }

    if (selectedId && !components.some((c) => c.id === selectedId)) {
      const opt = document.createElement('option')
      opt.value = String(selectedId)
      opt.textContent = `Component ${selectedId}`
      opt.selected = true
      this.select.insertBefore(opt, placeholder.nextSibling)
    }

    this.wrapper.appendChild(label)
    this.wrapper.appendChild(this.select)
    return this.wrapper
  }

  save(): ComponentToolData {
    const id = this.select ? Number(this.select.value) : Number(this.data.componentId) || 0
    return { componentId: id > 0 ? id : undefined }
  }
}

export default ComponentTool
