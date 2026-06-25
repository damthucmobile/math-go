'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Compass,
  PlayCircle,
  Sigma,
  Sparkles,
  ArrowRight,
  type LucideIcon
} from 'lucide-react'
import { Container } from '@/app/components/oatmeal/elements/container'
import type { CoursePageData, CourseProgram } from './types'

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  CheckCircle2,
  Sigma,
  Compass,
  Award,
  Check,
  Calendar,
  PlayCircle,
  Sparkles,
  ArrowRight
}

function renderIcon(name?: string, className = 'h-4 w-4') {
  const Icon = iconMap[name || 'BookOpen'] ?? BookOpen
  return <Icon className={className} />
}

type CoursesPageClientProps = {
  data: CoursePageData
}

export function CoursesPageClient({ data }: CoursesPageClientProps) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id ?? 'tieu-hoc')

  const filteredPrograms = useMemo(() => {
    return data.programs.filter((program) => program.level === activeTab)
  }, [activeTab, data.programs])

  return (
    <main className="bg-slate-50 text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
      <section className="border-b border-slate-200/80 bg-white py-16 sm:py-20">
        <Container className="max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-orange-700">
                <Sparkles className="h-3.5 w-3.5" />
                {data.heroBadge}
              </span>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-[#0b2f5d] sm:text-5xl">
                {data.heroTitle}
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                {data.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={data.primaryButtonHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#9a5103] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#804302]"
                >
                  {data.primaryButtonLabel}
                </a>
                <a
                  href={data.secondaryButtonHref}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {data.secondaryButtonLabel}
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#0b2f5d] via-[#0e3f73] to-[#1f5f98] p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-200">
                <PlayCircle className="h-4 w-4" />
                Lộ trình học được thiết kế riêng cho từng độ tuổi
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {data.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-black">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <Container className="max-w-6xl">
          <div className="flex gap-2 overflow-x-auto py-3 text-sm font-semibold text-slate-500">
            {data.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-4 py-2 transition ${activeTab === tab.id ? 'bg-[#0b2f5d] text-white shadow-sm' : 'hover:bg-slate-100 hover:text-slate-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl space-y-8 py-12 sm:py-14">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <div key={program.id} className="animate-fade-in duration-200">
              {program.type === 'section-complex' && (
                <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                  <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
                    <div className="space-y-5">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-slate-100 bg-slate-100">
                        {program.image ? (
                          <Image src={program.image} alt={program.title} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-orange-50">
                            <BookOpen className="h-12 w-12 text-slate-400" />
                          </div>
                        )}
                      </div>
                      {program.badges?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {program.badges.map((badge, index) => (
                            <span key={`${badge}-${index}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                              {badge}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-black text-[#0b2f5d] sm:text-3xl">{program.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{program.description}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-700">
                            <BookOpen className="h-4 w-4" />
                            Nội dung học tập
                          </div>
                          <ul className="space-y-2 text-sm text-slate-600">
                            {program.content?.map((item) => (
                              <li key={item} className="flex gap-2">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Mục tiêu đầu ra
                          </div>
                          <ul className="space-y-2 text-sm text-slate-600">
                            {program.result?.map((item) => (
                              <li key={item} className="flex gap-2">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-amber-700">Lịch học linh hoạt</p>
                            <p className="mt-1 text-sm text-slate-600">{program.schedule}</p>
                          </div>
                          <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#9a5103] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#804302]">
                            Đăng ký học thử miễn phí
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {program.type === 'grid-cards' && (
                <section className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="max-w-2xl">
                      <h2 className="text-2xl font-black text-[#0b2f5d]">{program.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{program.description}</p>
                    </div>
                    {program.rightBadge ? (
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0f4c81]">
                        {program.rightBadge}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    {program.cards?.map((card, index) => (
                      <div key={`${card.title}-${index}`} className={`rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ${card.borderTop ?? ''}`}>
                        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${card.iconBg}`}>
                          {renderIcon(card.icon, 'h-4 w-4')}
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-[#0b2f5d]">{card.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[28px] bg-[#043363] p-6 text-white shadow-lg sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="max-w-xl">
                        <h3 className="text-xl font-black">{program.ctaTitle || 'Bạn đang tìm kiếm lộ trình bứt phá điểm số?'}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-200">{program.ctaDescription || 'Tham gia ngay buổi kiểm tra đánh giá năng lực tư duy hoàn toàn miễn phí.'}</p>
                      </div>
                      <a href={program.ctaButtonHref || '/contact'} className="inline-flex items-center gap-2 rounded-full bg-[#9a5103] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#804302]">
                        {program.ctaButtonLabel || 'Đăng ký ngay'}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </section>
              )}

              {program.type === 'split-columns' && (
                <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                  <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                    <div className="relative flex h-48 items-end bg-[#0a2342] p-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 to-transparent" />
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                      <h3 className="relative z-10 text-2xl font-black text-white">{program.title}</h3>
                    </div>
                    <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
                      {program.columns?.map((column, index) => (
                        <div key={`${column.badge}-${index}`} className={`space-y-4 ${index > 0 ? 'sm:border-l sm:border-slate-100 sm:pl-6' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-white ${column.badgeBg}`}>{column.badge}</span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{column.sub}</span>
                          </div>
                          <p className="text-sm leading-7 text-slate-600">{column.description}</p>
                          <ul className="space-y-2 text-sm text-slate-600">
                            {column.points.map((point) => (
                              <li key={point} className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[28px] border border-slate-200 bg-slate-100/80 p-5 shadow-sm">
                      <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {program.sidebar?.scheduleTitle || 'Lịch khai giảng dự kiến'}
                      </h4>
                      <div className="mt-4 space-y-3">
                        {(program.sidebar?.scheduleItems?.length ? program.sidebar.scheduleItems : [
                          { month: '09', monthLabel: 'Tháng', title: 'Lớp SAT Cam Kết Đầu Ra', subtitle: 'Còn 3 vị trí trống', monthClassName: 'bg-[#043363]' },
                          { month: '10', monthLabel: 'Tháng', title: 'Toán IB HL Analysis', subtitle: 'Đang tiếp nhận đăng ký', monthClassName: 'bg-slate-400' }
                        ]).map((item, index) => (
                          <div key={`${item.title}-${index}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                            <div className={`min-w-[50px] rounded-xl p-2 text-center text-white ${item.monthClassName || (index === 0 ? 'bg-[#043363]' : 'bg-slate-400')}`}>
                              <span className="block text-[9px] font-semibold uppercase opacity-70">{item.monthLabel || 'Tháng'}</span>
                              <span className="mt-1 block text-base font-black">{item.month}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{item.title}</p>
                              {item.subtitle ? <p className="text-xs text-slate-500">{item.subtitle}</p> : null}
                            </div>
                          </div>
                        ))}
                      </div>
                      <a href={program.sidebar?.scheduleButtonHref || '/contact'} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#9a5103] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#804302]">
                        {program.sidebar?.scheduleButtonLabel || 'Đăng ký ngay'}
                      </a>
                    </div>

                    <div className="rounded-[28px] bg-[#053c75] p-5 text-white shadow-md">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-200">{program.sidebar?.personalizedTitle || '1:1 Cá nhân hóa'}</h4>
                      <p className="mt-3 text-sm leading-7 text-slate-100">
                        {program.sidebar?.personalizedDescription || 'Giải pháp lớp học gia sư một kèm một tăng tốc cho học sinh trường quốc tế, song ngữ.'}
                      </p>
                      <a href={program.sidebar?.personalizedHref || '/contact'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
                        {program.sidebar?.personalizedLinkLabel || 'Liên hệ tư vấn'}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </section>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
            Hiện tại chưa có khóa học nào thuộc cấp học này.
          </div>
        )}
      </Container>
    </main>
  )
}
