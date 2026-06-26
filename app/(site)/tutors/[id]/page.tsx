'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Container } from '@/app/components/oatmeal/elements/container'
import { ArrowLeft, Briefcase, GraduationCap } from 'lucide-react'

type TutorRecord = {
  id?: number | string
  name?: string
  role?: string
  experience?: string
  levels?: unknown
  avatar?: string
  imageUrl?: string
  description?: string
  tags?: unknown
  title?: string
  quote?: string
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  badges?: Array<{ label?: string; iconName?: string }>
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []

    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
      }
    } catch {
      // ignore and fall back
    }

    return trimmed.split(',').map((item) => item.trim()).filter(Boolean)
  }

  return []
}

export default function TutorDetailPage() {
  const params = useParams()
  const tutorId = params.id as string
  const [tutor, setTutor] = useState<TutorRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadTutor = async () => {
      try {
        const res = await fetch('/api/cms/tutors', { credentials: 'include' })
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        const match = list.find((item: TutorRecord) => String(item.id) === tutorId || item.name === decodeURIComponent(tutorId))
        if (!cancelled) {
          setTutor(match ?? null)
        }
      } catch {
        if (!cancelled) setTutor(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadTutor()
    return () => { cancelled = true }
  }, [tutorId])

  const levels = useMemo(() => parseList(tutor?.levels), [tutor])
  const tags = useMemo(() => parseList(tutor?.tags), [tutor])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <Container className="max-w-5xl">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
            Đang tải thông tin giảng viên...
          </div>
        </Container>
      </main>
    )
  }

  if (!tutor) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <Container className="max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy giảng viên</h1>
            <p className="mt-2 text-sm text-slate-500">Thông tin này hiện không còn hoặc đường dẫn không hợp lệ.</p>
            <Link href="/tutors" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Container className="max-w-5xl">
        <Link href="/tutors" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách giáo viên
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                  <Image src={tutor.avatar || tutor.imageUrl || '/'} alt={tutor.name || 'Tutor'} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Giảng viên</p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{tutor.name}</h1>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{tutor.role || tutor.title}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Briefcase className="h-4 w-4 text-amber-600" /> {tutor.experience || 'Kinh nghiệm phong phú'}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{tutor.description}</p>
              </div>

              {tutor.quote && (
                <blockquote className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm italic text-slate-700">
                  “{tutor.quote}”
                </blockquote>
              )}
            </div>

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Cấp độ</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {levels.length > 0 ? levels.map((level, idx) => (
                    <span key={idx} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {level}
                    </span>
                  )) : <span className="text-sm text-slate-500">Chưa cập nhật</span>}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Chuyên môn</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.length > 0 ? tags.map((tag, idx) => (
                    <span key={idx} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-primary-container">
                      {tag}
                    </span>
                  )) : <span className="text-sm text-slate-500">Chưa cập nhật</span>}
                </div>
              </div>

              {(tutor.stat1Value || tutor.stat2Value) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {tutor.stat1Value && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-2xl font-bold text-slate-900">{tutor.stat1Value}</p>
                      <p className="mt-1 text-sm text-slate-500">{tutor.stat1Label}</p>
                    </div>
                  )}
                  {tutor.stat2Value && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-2xl font-bold text-slate-900">{tutor.stat2Value}</p>
                      <p className="mt-1 text-sm text-slate-500">{tutor.stat2Label}</p>
                    </div>
                  )}
                </div>
              )}

              {tutor.badges && tutor.badges.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Điểm nổi bật</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.badges.map((badge, idx) => (
                      <span key={idx} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
