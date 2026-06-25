'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, ChevronRight } from 'lucide-react'
import { getApiUrl, getAdminPath, inputClasses, labelClasses, btnSecondary, linkMuted } from '@/lib/admin-utils'
import { useDeployStatus } from '@/app/admin/DeployStatusContext'
import { parseSectionData } from '@/app/admin/SectionDataFields'
import type { JsonValue } from '@/types/json'

type ProgramItem = {
  title: string
  description: string
  href: string
  iconName: 'graduation' | 'book' | 'award' | 'globe'
}

type StatItem = {
  value: string
  label: string
}

type TestimonialItem = {
  quote: string
  author: string
  role: string
  avatarUrl: string
}

type HomepageSectionData = {
  hero: {
    badge: string
    headline: string
    subtext: string
    primaryButtonLabel: string
    primaryButtonHref: string
    secondaryButtonLabel: string
    secondaryButtonHref: string
    imageUrl: string
  }
  stats: StatItem[]
  programs: ProgramItem[]
  tutor: {
    name: string
    title: string
    quote: string
    description: string
    imageUrl: string
    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Label: string
  }
  testimonials: TestimonialItem[]
  contact: {
    eyebrow: string
    title: string
    subtitle: string
    buttonLabel: string
  }
}

const HOMEPAGE_ID = '1'

const defaultHomepageData: HomepageSectionData = {
  hero: {
    badge: 'HỌC TẬP TOÀN DIỆN',
    headline: 'Chinh Phục Môn Toán\nCùng MathGo',
    subtext: 'Gia sư tận tâm, phương pháp hiện đại, giúp học sinh bứt phá điểm số thông qua lộ trình cá nhân hóa.',
    primaryButtonLabel: 'Đăng Ký Học Thử Miễn Phí',
    primaryButtonHref: '#contact',
    secondaryButtonLabel: 'Xem Chương Trình',
    secondaryButtonHref: '#courses',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  stats: [
    { value: '1000+', label: 'Học sinh đã theo học' },
    { value: '10+', label: 'Năm kinh nghiệm giảng dạy' },
    { value: '95%', label: 'Học sinh tiến bộ rõ rệt' },
  ],
  programs: [
    { title: 'Toán Tiểu Học', description: 'Xây dựng nền tảng vững chắc, kích thích tư duy logic và niềm yêu thích môn Toán từ nhỏ.', href: '/curriculum/tieu-hoc', iconName: 'graduation' },
    { title: 'Toán THCS', description: 'Lấy lại gốc nhanh chóng, nâng cao kỹ năng giải quyết vấn đề và chuẩn bị thi vào 10.', href: '/curriculum/trung-hoc', iconName: 'book' },
    { title: 'Toán THPT & Luyện Thi', description: 'Chiến thuật giải đề trắc nghiệm nhanh, bao quát kiến thức và tối ưu hoá điểm số thi Đại học.', href: '/curriculum/trung-hoc-pho-thong', iconName: 'award' },
    { title: 'Toán Quốc Tế', description: 'Chuẩn bị cho các kỳ thi SAT, IGCSE, A-Level với giáo trình chuẩn quốc tế và tư duy chuyên sâu.', href: '/curriculum/toan-quoc-te', iconName: 'globe' },
  ],
  tutor: {
    name: 'Thầy Nguyễn Văn A',
    title: 'Đội Ngũ Giảng Viên',
    quote: 'Môn Toán không khó, cái khó là chưa tìm được chìa khoá để mở cánh cửa tư duy.',
    description: 'Thạc sĩ chuyên ngành Toán học với hơn 15 năm kinh nghiệm luyện thi chuyên. Thầy nổi tiếng với phương pháp giảng dạy trực quan, giúp học sinh nắm vững bản chất thay vì học vẹt công thức.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    stat1Value: '15+',
    stat1Label: 'Năm kinh nghiệm',
    stat2Value: '5000+',
    stat2Label: 'Học sinh đỗ đạt',
  },
  testimonials: [
    { quote: 'Trước đây em rất sợ môn Toán và luôn bị điểm kém. Nhờ sự tận tình của các thầy cô tại MathGo, em đã lấy lại được căn bản và đạt điểm 9.0 trong kỳ thi học kỳ vừa qua.', author: 'Bạn Minh Anh', role: 'Học sinh lớp 12', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { quote: 'Lộ trình học tập cá nhân hoá là điều tôi ưng nhất. Con tôi từ chỗ lười học đã trở nên chủ động và yêu thích việc giải các bài toán khó hơn mỗi ngày.', author: 'Chị Thu Trang', role: 'Phụ huynh học sinh', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  ],
  contact: {
    eyebrow: 'TƯ VẤN MIỄN PHÍ',
    title: 'Tư vấn lộ trình học tập miễn phí',
    subtitle: 'Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ và hỗ trợ kiểm tra năng lực trong vòng 24h.',
    buttonLabel: 'Gửi Yêu Cầu Tư Vấn',
  },
}

function normalizeHomepageData(raw: Partial<HomepageSectionData> | undefined): HomepageSectionData {
  return {
    hero: { ...defaultHomepageData.hero, ...(raw?.hero ?? {}) },
    stats: Array.isArray(raw?.stats) && raw.stats.length > 0 ? raw.stats : defaultHomepageData.stats,
    programs: Array.isArray(raw?.programs) && raw.programs.length > 0 ? raw.programs : defaultHomepageData.programs,
    tutor: { ...defaultHomepageData.tutor, ...(raw?.tutor ?? {}) },
    testimonials: Array.isArray(raw?.testimonials) && raw.testimonials.length > 0 ? raw.testimonials : defaultHomepageData.testimonials,
    contact: { ...defaultHomepageData.contact, ...(raw?.contact ?? {}) },
  }
}

export default function AdminHomepagePage() {
  const adminPath = getAdminPath()
  const api = getApiUrl()
  const { setDeployingTrue } = useDeployStatus()
  const [values, setValues] = useState({ title: 'MathGo', body: '' })
  const [homepageData, setHomepageData] = useState<HomepageSectionData>(defaultHomepageData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${api}/api/cms/homepage?id=${HOMEPAGE_ID}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((record) => {
        const rec = record as Record<string, JsonValue> | null
        if (!rec) return
        setValues({
          title: String(rec.title ?? 'MathGo'),
          body: String(rec.body ?? ''),
        })
        const parsed = parseSectionData(rec.sectionData as string | undefined) as Partial<HomepageSectionData> | undefined
        setHomepageData(normalizeHomepageData(parsed))
      })
      .finally(() => setLoading(false))
  }, [api])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload: Record<string, JsonValue> = {
        id: 1,
        title: values.title,
        body: values.body,
        heroComponentId: 0,
        sectionData: JSON.stringify(homepageData),
        content_blocks: undefined,
      }
      const res = await fetch(`${api}/api/cms/homepage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json()
        setError(typeof err?.error === 'string' ? err.error : 'Save failed')
        return
      }
      setDeployingTrue()
      window.location.reload()
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-10 w-10 animate-spin text-mist-600 dark:text-mist-400" />
        <p className="mt-4 text-sm text-mist-600 dark:text-mist-400">Loading homepage…</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
          <Link href={adminPath} className={linkMuted}>Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-mist-400" />
          <span className="font-medium text-mist-950 dark:text-white">Homepage</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-sm dark:border-mist-700 dark:bg-mist-900/30 lg:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-mist-950 dark:text-white">Chỉnh sửa Homepage</h1>
              <p className="mt-1 text-mist-600 dark:text-mist-400">Điền nội dung theo bố cục trang chủ cũ để hiển thị đúng như website trước đây.</p>
              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <div className="rounded-xl border border-mist-200 bg-mist-50 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Thông tin chung</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClasses}>Title *</label>
                      <input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} className={inputClasses} required />
                    </div>
                    <div>
                      <label className={labelClasses}>Body</label>
                      <textarea value={values.body} onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))} className={inputClasses} rows={4} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-mist-200 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Hero</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClasses}>Badge</label>
                      <input value={homepageData.hero.badge} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, badge: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Image URL</label>
                      <input value={homepageData.hero.imageUrl} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, imageUrl: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Headline</label>
                      <textarea value={homepageData.hero.headline} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, headline: e.target.value } }))} className={inputClasses} rows={3} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Subtext</label>
                      <textarea value={homepageData.hero.subtext} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, subtext: e.target.value } }))} className={inputClasses} rows={3} />
                    </div>
                    <div>
                      <label className={labelClasses}>Primary button label</label>
                      <input value={homepageData.hero.primaryButtonLabel} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, primaryButtonLabel: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Primary button href</label>
                      <input value={homepageData.hero.primaryButtonHref} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, primaryButtonHref: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Secondary button label</label>
                      <input value={homepageData.hero.secondaryButtonLabel} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, secondaryButtonLabel: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Secondary button href</label>
                      <input value={homepageData.hero.secondaryButtonHref} onChange={(e) => setHomepageData((d) => ({ ...d, hero: { ...d.hero, secondaryButtonHref: e.target.value } }))} className={inputClasses} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-mist-200 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Stats</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {homepageData.stats.map((item, index) => (
                      <div key={index} className="rounded-lg border border-mist-200 p-4">
                        <div className="grid gap-3">
                          <div>
                            <label className={labelClasses}>Value</label>
                            <input value={item.value} onChange={(e) => setHomepageData((d) => ({ ...d, stats: d.stats.map((s, i) => i === index ? { ...s, value: e.target.value } : s) }))} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>Label</label>
                            <input value={item.label} onChange={(e) => setHomepageData((d) => ({ ...d, stats: d.stats.map((s, i) => i === index ? { ...s, label: e.target.value } : s) }))} className={inputClasses} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-mist-200 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Chương trình</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {homepageData.programs.map((item, index) => (
                      <div key={index} className="rounded-lg border border-mist-200 p-4">
                        <div className="grid gap-3">
                          <div>
                            <label className={labelClasses}>Title</label>
                            <input value={item.title} onChange={(e) => setHomepageData((d) => ({ ...d, programs: d.programs.map((p, i) => i === index ? { ...p, title: e.target.value } : p) }))} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>Description</label>
                            <textarea value={item.description} onChange={(e) => setHomepageData((d) => ({ ...d, programs: d.programs.map((p, i) => i === index ? { ...p, description: e.target.value } : p) }))} className={inputClasses} rows={3} />
                          </div>
                          <div>
                            <label className={labelClasses}>Link</label>
                            <input value={item.href} onChange={(e) => setHomepageData((d) => ({ ...d, programs: d.programs.map((p, i) => i === index ? { ...p, href: e.target.value } : p) }))} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>Icon</label>
                            <select value={item.iconName} onChange={(e) => setHomepageData((d) => ({ ...d, programs: d.programs.map((p, i) => i === index ? { ...p, iconName: e.target.value as ProgramItem['iconName'] } : p) }))} className={inputClasses}>
                              <option value="graduation">Graduation</option>
                              <option value="book">Book</option>
                              <option value="award">Award</option>
                              <option value="globe">Globe</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-mist-200 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Giảng viên</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClasses}>Name</label>
                      <input value={homepageData.tutor.name} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, name: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Title</label>
                      <input value={homepageData.tutor.title} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, title: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Quote</label>
                      <textarea value={homepageData.tutor.quote} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, quote: e.target.value } }))} className={inputClasses} rows={3} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Description</label>
                      <textarea value={homepageData.tutor.description} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, description: e.target.value } }))} className={inputClasses} rows={3} />
                    </div>
                    <div>
                      <label className={labelClasses}>Image URL</label>
                      <input value={homepageData.tutor.imageUrl} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, imageUrl: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Stat 1 value</label>
                      <input value={homepageData.tutor.stat1Value} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, stat1Value: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Stat 1 label</label>
                      <input value={homepageData.tutor.stat1Label} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, stat1Label: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Stat 2 value</label>
                      <input value={homepageData.tutor.stat2Value} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, stat2Value: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Stat 2 label</label>
                      <input value={homepageData.tutor.stat2Label} onChange={(e) => setHomepageData((d) => ({ ...d, tutor: { ...d.tutor, stat2Label: e.target.value } }))} className={inputClasses} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-mist-200 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Testimonials</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {homepageData.testimonials.map((item, index) => (
                      <div key={index} className="rounded-lg border border-mist-200 p-4">
                        <div className="grid gap-3">
                          <div>
                            <label className={labelClasses}>Quote</label>
                            <textarea value={item.quote} onChange={(e) => setHomepageData((d) => ({ ...d, testimonials: d.testimonials.map((t, i) => i === index ? { ...t, quote: e.target.value } : t) }))} className={inputClasses} rows={3} />
                          </div>
                          <div>
                            <label className={labelClasses}>Author</label>
                            <input value={item.author} onChange={(e) => setHomepageData((d) => ({ ...d, testimonials: d.testimonials.map((t, i) => i === index ? { ...t, author: e.target.value } : t) }))} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>Role</label>
                            <input value={item.role} onChange={(e) => setHomepageData((d) => ({ ...d, testimonials: d.testimonials.map((t, i) => i === index ? { ...t, role: e.target.value } : t) }))} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>Avatar URL</label>
                            <input value={item.avatarUrl} onChange={(e) => setHomepageData((d) => ({ ...d, testimonials: d.testimonials.map((t, i) => i === index ? { ...t, avatarUrl: e.target.value } : t) }))} className={inputClasses} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-mist-200 p-5">
                  <h2 className="text-lg font-semibold text-mist-950">Contact block</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClasses}>Eyebrow</label>
                      <input value={homepageData.contact.eyebrow} onChange={(e) => setHomepageData((d) => ({ ...d, contact: { ...d.contact, eyebrow: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Button label</label>
                      <input value={homepageData.contact.buttonLabel} onChange={(e) => setHomepageData((d) => ({ ...d, contact: { ...d.contact, buttonLabel: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Title</label>
                      <input value={homepageData.contact.title} onChange={(e) => setHomepageData((d) => ({ ...d, contact: { ...d.contact, title: e.target.value } }))} className={inputClasses} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Subtitle</label>
                      <textarea value={homepageData.contact.subtitle} onChange={(e) => setHomepageData((d) => ({ ...d, contact: { ...d.contact, subtitle: e.target.value } }))} className={inputClasses} rows={3} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-mist-100 pt-6">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-mist-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-mist-900 disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Lưu Homepage
                  </button>
                  <Link href={adminPath} className={btnSecondary}>Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
