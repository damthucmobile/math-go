
'use client'

import { useEffect, useState, type FormEvent } from 'react'
import {
  X,
  User,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Loader2,
  GraduationCap,
} from 'lucide-react'

interface TrialRegistrationDialogProps {
  isOpen: boolean
  onClose: () => void
}

type DialogFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio'

interface DialogFieldOption {
  label: string
  value: string
}

interface DialogFieldConfig {
  key: string
  label: string
  type: DialogFieldType
  placeholder?: string
  required?: boolean
  defaultValue?: string
  options?: DialogFieldOption[]
}

interface DialogConfig {
  title: string
  description: string
  submitButtonLabel: string
  successMessage: string
  errorMessage: string
  submitUrl?: string
  submitMethod?: string
  fields: DialogFieldConfig[]
}

const DEFAULT_CONFIG: DialogConfig = {
  title: 'Đăng ký Học thử Miễn phí',
  description: 'Bắt đầu lộ trình chinh phục môn Toán cùng chuyên gia.',
  submitButtonLabel: 'Xác nhận Đăng ký',
  successMessage: 'Đăng ký thành công!',
  errorMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
  submitMethod: 'POST',
  fields: [
    { key: 'fullName', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A', required: true },
    { key: 'phone', label: 'Số điện thoại', type: 'phone', placeholder: '09xx xxx xxx', required: true },
    { key: 'email', label: 'Email (Gmail)', type: 'email', placeholder: 'example@gmail.com', required: true },
    {
      key: 'grade',
      label: 'Toán lớp mấy?',
      type: 'select',
      required: true,
      placeholder: 'Chọn lớp học',
      options: Array.from({ length: 12 }, (_, i) => ({ label: `Lớp ${i + 1}`, value: String(i + 1) })),
    },
    {
      key: 'learningFormat',
      label: 'Hình thức học',
      type: 'radio',
      required: true,
      options: [
        { label: 'Học 1-kèm-1', value: '1-on-1' },
        { label: 'Lớp nhóm nhỏ', value: 'group' },
      ],
    },
  ],
}

function normalizeConfig(rawConfig: unknown): DialogConfig {
  const source = (rawConfig && typeof rawConfig === 'object' ? rawConfig : {}) as Record<string, unknown>
  const fields = Array.isArray(source.fields)
    ? source.fields
        .filter((field): field is Record<string, unknown> => Boolean(field) && typeof field === 'object')
        .map((field, index) => {
          const fieldType = typeof field.type === 'string' ? field.type : 'text'
          const normalizedType: DialogFieldType = ['text', 'email', 'phone', 'textarea', 'select', 'radio'].includes(fieldType)
            ? (fieldType as DialogFieldType)
            : 'text'

          const options = Array.isArray(field.options)
            ? field.options.filter((option): option is Record<string, unknown> => Boolean(option) && typeof option === 'object').map((option) => ({
                label: typeof option.label === 'string' ? option.label : '',
                value: typeof option.value === 'string' ? option.value : '',
              })).filter((option) => option.label && option.value)
            : []

          return {
            key: typeof field.key === 'string' && field.key.trim() ? field.key : `field_${index + 1}`,
            label: typeof field.label === 'string' && field.label.trim() ? field.label : `Field ${index + 1}`,
            type: normalizedType,
            placeholder: typeof field.placeholder === 'string' ? field.placeholder : undefined,
            required: field.required === true,
            defaultValue: typeof field.defaultValue === 'string' ? field.defaultValue : undefined,
            options,
          }
        })
    : []

  return {
    title: typeof source.title === 'string' && source.title.trim() ? source.title : DEFAULT_CONFIG.title,
    description: typeof source.description === 'string' && source.description.trim() ? source.description : DEFAULT_CONFIG.description,
    submitButtonLabel: typeof source.submitButtonLabel === 'string' && source.submitButtonLabel.trim() ? source.submitButtonLabel : DEFAULT_CONFIG.submitButtonLabel,
    successMessage: typeof source.successMessage === 'string' && source.successMessage.trim() ? source.successMessage : DEFAULT_CONFIG.successMessage,
    errorMessage: typeof source.errorMessage === 'string' && source.errorMessage.trim() ? source.errorMessage : DEFAULT_CONFIG.errorMessage,
    submitUrl: typeof source.submitUrl === 'string' ? source.submitUrl : undefined,
    submitMethod: typeof source.submitMethod === 'string' && source.submitMethod.trim() ? source.submitMethod : DEFAULT_CONFIG.submitMethod,
    fields: fields.length > 0 ? fields : DEFAULT_CONFIG.fields,
  }
}

export default function TrialRegistrationDialog({ isOpen, onClose }: TrialRegistrationDialogProps) {
  const [config, setConfig] = useState<DialogConfig>(DEFAULT_CONFIG)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 250)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  useEffect(() => {
    let active = true
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/cms/components')
        if (!response.ok) throw new Error('Unable to load dialog config')
        const records = await response.json()
        const record = Array.isArray(records)
          ? records.find((item: Record<string, unknown>) => String(item?.slug ?? '') === 'trial-registration-dialog' || String(item?.type ?? '') === 'trial-registration-dialog')
          : null

        if (!active) return
        setConfig(normalizeConfig(record?.config))
      } catch {
        if (active) setConfig(DEFAULT_CONFIG)
      }
    }
    loadConfig()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const initialValues = Object.fromEntries(
      config.fields.map((field) => [field.key, field.defaultValue ?? ''])
    )
    setFormValues(initialValues)
    setStatus('idle')
    setMessage('')
  }, [config.fields, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const missing = config.fields.find((field) => field.required && !String(formValues[field.key] ?? '').trim())
    if (missing) {
      setStatus('error')
      setMessage(`Vui lòng điền ${missing.label.toLowerCase()}.`)
      return
    }

    setStatus('loading')
    setMessage('')

    const payload = { ...formValues, source: 'trial-registration-dialog' }

    if (config.submitUrl) {
      try {
        const response = await fetch(config.submitUrl, {
          method: config.submitMethod ?? 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error('Submission failed')
        setStatus('success')
        setMessage(config.successMessage)
        window.setTimeout(() => onClose(), 1400)
        return
      } catch {
        setStatus('error')
        setMessage(config.errorMessage)
        return
      }
    }

    window.setTimeout(() => {
      setStatus('success')
      setMessage(config.successMessage)
      window.setTimeout(() => onClose(), 1400)
    }, 1000)
  }

  const renderField = (field: DialogFieldConfig) => {
    const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#00355f] focus:ring-2 focus:ring-blue-500/10 disabled:opacity-60 shadow-sm'
    const currentValue = formValues[field.key] ?? ''
    const isSubmitting = status === 'loading'

    const commonProps = {
      required: field.required,
      disabled: isSubmitting,
      placeholder: field.placeholder,
      value: currentValue,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))
      },
    }

    switch (field.type) {
      case 'textarea':
        return (
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
            <textarea {...commonProps} rows={3} className={`${inputClassName} min-h-[80px] resize-none`} />
          </div>
        )
      case 'select':
        return (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
            <div className="relative">
              <select {...commonProps} className={`${inputClassName} appearance-none pr-10`}>
                <option value="" disabled>{field.placeholder ?? 'Chọn giá trị'}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        )
      case 'radio':
        return (
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
            <div className="flex flex-col sm:flex-row gap-2">
              {field.options?.map((option) => {
                const active = currentValue === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setFormValues((prev) => ({ ...prev, [field.key]: option.value }))}
                    className={`flex-1 rounded-xl border px-4 py-3 text-xs font-semibold transition shadow-sm ${
                      active ? 'border-[#00355f] bg-[#00355f] text-white' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        )
      case 'email':
        return (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00355f]" />
              <input {...commonProps} type="email" className={`${inputClassName} pl-10`} />
            </div>
          </div>
        )
      case 'phone':
        return (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00355f]" />
              <input {...commonProps} type="tel" className={`${inputClassName} pl-10`} />
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00355f]" />
              <input {...commonProps} type="text" className={`${inputClassName} pl-10`} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-[#00355f]/40 backdrop-blur-md" onClick={status === 'loading' ? undefined : onClose} />

      {/* Main Dialog Container */}
      <div className="relative z-10 flex max-h-[85vh] md:max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_12px_60px_rgba(15,76,129,0.2)]">
        <div className="pointer-events-none absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#00355f 0.75px, transparent 0.75px)', backgroundSize: '24px 24px' }} />

        {/* Sticky Header */}
        <div className="relative shrink-0 border-b border-slate-100 px-6 pb-4 pt-8 md:pt-10 text-center bg-white z-20">
          <button
            disabled={status === 'loading'}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#0f4c81] animate-bounce [animation-duration:3s]">
            <GraduationCap className="h-5 w-5" />
          </div>

          <h2 className="text-lg md:text-2xl font-bold tracking-tight text-[#00355f]">{config.title}</h2>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">{config.description}</p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="grow flex flex-col overflow-hidden bg-white">
          <div className="grow overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
            {/* Grid layout: 1 column on mobile, 2 columns on tablet/PC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map((field) => (
                <div key={field.key} className="w-full">
                  {renderField(field)}
                </div>
              ))}
            </div>

            <p className="pt-2 text-center text-[10px] leading-relaxed text-slate-400">
              Bằng việc nhấn “{config.submitButtonLabel}”, bạn đồng ý với các Điều khoản & Chính sách bảo mật của MathGo.
            </p>

            {message ? (
              <div className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium ${status === 'error' ? 'border-red-200 bg-red-50 text-red-600' : 'border-emerald-200 bg-emerald-50 text-emerald-600'}`}>
                {message}
              </div>
            ) : null}
          </div>

          {/* Sticky Footer Action Button */}
          <div className="shrink-0 border-t border-slate-100 p-6 bg-slate-50/50">
            {status === 'idle' && (
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:bg-orange-600 active:scale-[0.99]"
              >
                <span>{config.submitButtonLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {status === 'loading' && (
              <button type="button" disabled className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00562a] px-6 py-3.5 text-xs font-bold text-white transition">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý dữ liệu...</span>
              </button>
            )}

            {status === 'success' && (
              <button type="button" disabled className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#52d17e] px-6 py-3.5 text-xs font-bold text-[#00210c] transition">
                <CheckCircle2 className="h-4 w-4" />
                <span>{config.successMessage}</span>
              </button>
            )}

            {status === 'error' && (
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-orange-600">
                <span>Thử lại</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
