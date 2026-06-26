'use client'

import Link from 'next/link'
import { ChevronRight, GraduationCap } from 'lucide-react'
import { Container } from '@/app/components/oatmeal/elements/container'
import { iconMap } from '@/lib/homepage-data'
import type { ComponentContextData } from '../types'

export function HomepageProgramsSection({ context }: { context: ComponentContextData }) {
  const programs = context.sectionData?.programs ?? []
  if (programs.length === 0) return null

  return (
    <section id="courses" className="py-20 bg-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-normal text-primary sm:text-4xl">{context.sectionData?.programsHeading ?? 'Chương trình đào tạo'}</h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 mb-4" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => {
            const IconComponent = iconMap[program.iconName ?? 'GraduationCap'] ?? GraduationCap
            return (
              <div key={`${program.title}-${index}`} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                <div>
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">{program.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{program.description}</p>
                </div>
                <Link href={program.href || '#courses'}>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-slate-400 group-hover:text-orange-500 transition cursor-pointer">
                    Chi tiết
                    <ChevronRight className="h-4 w-4 ml-0.5" />
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
