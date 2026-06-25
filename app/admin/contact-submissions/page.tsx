'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Clock3, Loader2, Mail, MessageSquare, Phone, XCircle } from 'lucide-react'
import { getApiUrl, getAdminPath } from '@/lib/admin-utils'

type SubmissionStatus = 'pending' | 'replied' | 'rejected'

type ContactSubmission = {
  id: string
  name: string
  phone: string
  email: string
  message: string
  submittedAt: string
  source?: string
  status: SubmissionStatus
  updatedAt?: string
}

const STATUS_OPTIONS: Array<{ value: SubmissionStatus; label: string; description: string }> = [
  { value: 'pending', label: 'Chưa phản hồi', description: 'Đang chờ xử lý' },
  { value: 'replied', label: 'Đã phản hồi', description: 'Đã gửi phản hồi' },
  { value: 'rejected', label: 'Từ chối', description: 'Không cần theo đuổi' }
]

const statusStyles: Record<SubmissionStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200'
}

const statusIcons: Record<SubmissionStatus, ReactNode> = {
  pending: <Clock3 className="h-4 w-4" />,
  replied: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const api = getApiUrl()
  const adminPath = getAdminPath()

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${api}/api/contact-submissions`, { credentials: 'include' })
        const data = (await response.json()) as ContactSubmission[]
        setSubmissions(data)
      } catch {
        setSubmissions([])
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [api])

  const filteredSubmissions = useMemo(() => {
    if (filter === 'all') return submissions
    return submissions.filter((item) => item.status === filter)
  }, [filter, submissions])

  const counts = useMemo(() => ({
    all: submissions.length,
    pending: submissions.filter((item) => item.status === 'pending').length,
    replied: submissions.filter((item) => item.status === 'replied').length,
    rejected: submissions.filter((item) => item.status === 'rejected').length
  }), [submissions])

  const updateStatus = async (id: string, nextStatus: SubmissionStatus) => {
    setUpdatingId(id)
    try {
      const response = await fetch(`${api}/api/contact-submissions`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error((data as { error?: string }).error || 'Không thể cập nhật trạng thái')
      }

      setSubmissions((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus, updatedAt: (data as { submission?: ContactSubmission }).submission?.updatedAt ?? new Date().toISOString() } : item))
    } catch {
      // keep the existing UI unchanged in case of an error
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">Contact submissions</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-mist-950 dark:text-white">Quản lý khách hàng liên hệ</h1>
            <p className="mt-2 text-sm text-mist-500 dark:text-mist-400">
              Xem toàn bộ người gửi form liên hệ và cập nhật trạng thái phản hồi nhanh chóng.
            </p>
          </div>
          <a
            href={`${adminPath}/cms/contact`}
            className="inline-flex items-center gap-2 rounded-lg border border-mist-200 px-4 py-2 text-sm font-medium text-mist-700 transition hover:bg-mist-100 dark:border-mist-700 dark:text-mist-300 dark:hover:bg-mist-800"
          >
            <Mail className="h-4 w-4" />
            Quản lý nội dung Contact
          </a>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { key: 'all', label: 'Tất cả', value: counts.all },
            { key: 'pending', label: 'Chưa phản hồi', value: counts.pending },
            { key: 'replied', label: 'Đã phản hồi', value: counts.replied },
            { key: 'rejected', label: 'Từ chối', value: counts.rejected }
          ].map((item) => {
            const active = filter === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key as 'all' | SubmissionStatus)}
                className={`rounded-2xl border px-4 py-4 text-left shadow-sm transition ${active ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-mist-200 bg-white text-mist-700 hover:bg-mist-50 dark:border-mist-700 dark:bg-mist-900/30 dark:text-mist-300 dark:hover:bg-mist-800'}`}
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              </button>
            )
          })}
        </section>

        <section className="rounded-3xl border border-mist-200 bg-white p-4 shadow-sm dark:border-mist-700 dark:bg-mist-900/30 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-sm text-mist-500 dark:text-mist-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang tải danh sách liên hệ...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-mist-200 px-6 py-16 text-center text-sm text-mist-500 dark:border-mist-700 dark:text-mist-400">
              Không có submission nào phù hợp với bộ lọc này.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((item) => (
                <article key={item.id} className="rounded-2xl border border-mist-200 bg-mist-50/70 p-5 dark:border-mist-700 dark:bg-mist-800/20">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-mist-950 dark:text-white">{item.name || 'Không có tên'}</h2>
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[item.status]}`}>
                          {statusIcons[item.status]}
                          {STATUS_OPTIONS.find((option) => option.value === item.status)?.label}
                        </span>
                      </div>

                      <div className="grid gap-2 text-sm text-mist-600 dark:text-mist-400 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-orange-500" />
                          <span>{item.email || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-orange-500" />
                          <span>{item.phone || '—'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-mist-600 dark:text-mist-400">
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <p className="whitespace-pre-wrap">{item.message || '—'}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-mist-500 dark:text-mist-400">
                        <span>Gửi lúc: {new Date(item.submittedAt).toLocaleString('vi-VN')}</span>
                        {item.updatedAt && <span>Cập nhật: {new Date(item.updatedAt).toLocaleString('vi-VN')}</span>}
                        {item.source && <span>Nguồn: {item.source}</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-col">
                      {STATUS_OPTIONS.map((option) => {
                        const isCurrent = item.status === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => void updateStatus(item.id, option.value)}
                            disabled={updatingId === item.id}
                            className={`rounded-full border px-3 py-2 text-sm font-medium transition ${isCurrent ? 'border-orange-300 bg-orange-500 text-white' : 'border-mist-200 bg-white text-mist-700 hover:bg-mist-100 dark:border-mist-700 dark:bg-mist-800 dark:text-mist-300 dark:hover:bg-mist-700'} ${updatingId === item.id ? 'cursor-not-allowed opacity-70' : ''}`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
