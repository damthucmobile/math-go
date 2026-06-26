'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Container } from '@/app/components/oatmeal/elements/container'
import type { ComponentContextData } from '../types'

export function HomepageTestimonialsSection({ context }: { context: ComponentContextData }) {
  const testimonials = context.sectionData?.testimonials ?? []
  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-normal text-primary sm:text-4xl">{context.sectionData?.testimonialsHeading ?? 'Chia Sẻ Từ Học Viên'}</h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-4" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {testimonials.map((item, index) => (
            <div key={`${item.author}-${index}`} className="relative rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600 italic">“{item.quote}”</p>
              </div>
              <div className="mt-6 flex items-center gap-4 border-t border-slate-200/60 pt-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                  <Image src={item.avatarUrl ?? ''} alt={item.author} fill className="object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-primary">{item.author}</p>
                  <p className="text-slate-400 mt-0.5">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
