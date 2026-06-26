'use client'

import { ButtonLink, PlainButtonLink } from '@/app/components/oatmeal/elements/button'
import { Container } from '@/app/components/oatmeal/elements/container'
import { BookOpen } from 'lucide-react'
import type { ComponentContextData } from '../types'

const OPEN_HERO_DIALOG_EVENT = 'home-page-open-contact-dialog'

export function HomepageHeroSection({ context }: { context: ComponentContextData }) {
  const heroData = context.sectionData?.hero
  const title = heroData?.headline ?? context.title ?? ''
  const content = heroData?.subtext ?? context.excerpt ?? context.content ?? context.body ?? ''
  const heroLines = title.split('\n')

  if (!heroData && !title && !content) return null

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-container to-primary pb-24 pt-20 text-white min-h-[600px] flex items-center">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />

      <Container className="grid gap-12 lg:grid-cols-12 lg:items-center relative z-10 w-full">
        <div className="max-w-2xl lg:col-span-7">
          <span className="inline-flex rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 border border-orange-500/30">
            {heroData?.badge ?? 'HỌC TẬP TOÀN DIỆN'}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-normal text-white sm:text-5xl lg:text-6xl">
            {heroLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {content}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink
              href={heroData?.primaryButtonHref ?? '#contact'}
              onClick={(event) => {
                event.preventDefault()
                window.dispatchEvent(new Event(OPEN_HERO_DIALOG_EVENT))
              }}
              className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition duration-300"
            >
              {heroData?.primaryButtonLabel ?? 'Đăng Ký Học Thử Miễn Phí'}
            </ButtonLink>
            <PlainButtonLink
              href={heroData?.secondaryButtonHref ?? '#courses'}
              className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white hover:bg-white/20 backdrop-blur-sm transition duration-300"
            >
              {heroData?.secondaryButtonLabel ?? 'Xem Chương Trình'}
            </PlainButtonLink>
          </div>
        </div>

        <div className="w-full max-w-md lg:col-span-5 justify-self-end rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-md">
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/10 p-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-300 font-medium">Lộ trình 2024</p>
              <p className="mt-0.5 text-base font-semibold text-white">Tiến độ hoàn thành</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-slate-950/20 p-5 border border-white/5">
            <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-200">
              <span>Tiến độ hoàn thành</span>
              <span>75%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { OPEN_HERO_DIALOG_EVENT }
