'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/app/components/oatmeal/elements/container'
import { GraduationCap, Briefcase, Search, ChevronDown } from 'lucide-react'

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
}

type NormalizedTutor = {
  id?: number | string
  name: string
  role: string
  experience: string
  levels: string[]
  avatar: string
  description: string
  tags: string[]
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
      // Fall back to comma-separated parsing below.
    }

    return trimmed.split(',').map((item) => item.trim()).filter(Boolean)
  }

  return []
}

function normalizeTutor(record: TutorRecord): NormalizedTutor {
  return {
    id: record.id,
    name: record.name?.trim() || 'Tutor',
    role: record.role?.trim() || record.title?.trim() || 'Giảng viên',
    experience: record.experience?.trim() || '',
    levels: parseList(record.levels),
    avatar: record.imageUrl?.trim() || record.avatar?.trim() || '',
    description: record.description?.trim() || '',
    tags: parseList(record.tags)
  }
}

export default function TutorsPage() {
  const [selectedLevel, setSelectedLevel] = useState('Tất cả')
  const [selectedSpec, setSelectedSpec] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [tutorsData, setTutorsData] = useState<TutorRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadTutors = async () => {
      try {
        const res = await fetch('/api/cms/tutors', { credentials: 'include' })
        const data = await res.json()

        if (!cancelled && Array.isArray(data)) {
          setTutorsData(data)
        } else if (!cancelled) {
          setTutorsData([])
        }
      } catch {
        if (!cancelled) {
          setTutorsData([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTutors()

    return () => {
      cancelled = true
    }
  }, [])

  const normalizedTutors = useMemo(() => tutorsData.map(normalizeTutor), [tutorsData])

  const availableLevels = useMemo(() => {
    const levels = new Set<string>()
    normalizedTutors.forEach((tutor) => {
      tutor.levels.forEach((level) => levels.add(level))
    })
    return ['Tất cả', ...Array.from(levels)]
  }, [normalizedTutors])

  const specializations = useMemo(() => {
    const tags = new Set<string>()
    normalizedTutors.forEach((tutor) => {
      tutor.tags.forEach((tag) => tags.add(tag))
    })
    return ['Tất cả', ...Array.from(tags)]
  }, [normalizedTutors])

  const filteredTutors = useMemo(() => {
    return normalizedTutors.filter((tutor) => {
      const matchesLevel = selectedLevel === 'Tất cả' || tutor.levels.includes(selectedLevel)
      const matchesSpec = selectedSpec === 'Tất cả' || tutor.tags.includes(selectedSpec)
      const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesLevel && matchesSpec && matchesSearch
    })
  }, [normalizedTutors, selectedLevel, selectedSpec, searchQuery])

  return (
    <main className="bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      <section className="border-b border-slate-100 bg-white pb-12 pt-16">
        <Container className="max-w-5xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-primary-container">
            <GraduationCap className="h-3.5 w-3.5" /> Giảng Viên Kỹ Năng Cao
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-normal text-primary lg:text-5xl">
            Học hỏi từ những bộ óc Toán học xuất sắc nhất
          </h1>
        </Container>
      </section>

      <section className="border-b border-slate-200/60 bg-slate-50 py-8">
        <Container className="max-w-5xl">
          <div className="grid gap-6 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm md:flex md:items-end md:justify-between">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Lọc theo cấp độ</label>
              <div className="flex flex-wrap gap-2">
                {availableLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition shadow-sm ${
                      selectedLevel === level
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {level === 'Tất cả' ? 'Tất cả Cấp độ' : level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <div className="space-y-2 sm:w-48">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Chuyên ngành học</label>
                <div className="relative">
                  <select
                    value={selectedSpec}
                    onChange={(e) => setSelectedSpec(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-400"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec === 'Tất cả' ? 'Tất cả Môn học' : spec}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="flex-1 space-y-2 sm:w-64">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">&nbsp;</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên giảng viên..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-700 placeholder-slate-400 outline-none transition focus:border-slate-400"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="max-w-5xl">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
              Đang tải dữ liệu giảng viên...
            </div>
          ) : filteredTutors.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTutors.map((tutor, idx) => (
                <div key={tutor.id ?? idx} className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                        <Image src={tutor.avatar || '/'} alt={tutor.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-base font-bold leading-snug text-primary">{tutor.name}</h3>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">{tutor.role}</p>
                        <p className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Briefcase className="h-3 w-3" /> {tutor.experience}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-500">
                      {tutor.description || 'Giảng viên chuyên môn cao, chú trọng xây dựng nền tảng và phương pháp học hiệu quả.'}
                    </p>

                    {tutor.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tutor.tags.slice(0, 2).map((tag, tIdx) => (
                          <span key={tIdx} className="rounded-md border border-blue-100/50 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-primary-container">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/tutors/${encodeURIComponent(String(tutor.id ?? tutor.name))}`}
                    className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-primary-container transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Xem Chi Tiết
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
              Không tìm thấy giảng viên nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}