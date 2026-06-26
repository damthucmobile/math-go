'use client'

import { useState } from 'react'

type ContactFormProps = {
  formTitle: string
  formSubtitle: string
  submitUrl: string
  submitMethod: string
  successMessage: string
  errorMessage: string
}

export function ContactForm({
  formTitle,
  formSubtitle,
  submitUrl,
  submitMethod,
  successMessage,
  errorMessage
}: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          submitUrl,
          submitMethod
        })
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || errorMessage)
      }

      setStatus('success')
      setFeedback(successMessage)
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setFeedback(err instanceof Error ? err.message : errorMessage)
    }
  }

  return (
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Họ và tên</span>
              <input
                type="text"
                placeholder="Nhập họ tên"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Số điện thoại</span>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Email</span>
            <input
              type="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Lời nhắn</span>
            <textarea
              rows={5}
              placeholder="Mô tả yêu cầu của bạn"
              value={form.message}
              onChange={(event) => handleChange('message', event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          {feedback ? (
            <p className={`rounded-2xl px-4 py-3 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {feedback}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#0a294f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>
  )
}
