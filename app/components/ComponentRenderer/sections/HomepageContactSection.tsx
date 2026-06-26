'use client'

import { Container } from '@/app/components/oatmeal/elements/container'
import type { ComponentContextData } from '../types'

export function HomepageContactSection({ context }: { context: ComponentContextData }) {
  const contact = context.sectionData?.contact
  if (!contact) return null

  return (
    <section id="contact" className="bg-primary py-20 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      <Container className="max-w-5xl relative z-10">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-xl sm:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">{contact.eyebrow}</span>
              <h2 className="text-2xl font-bold tracking-normal text-primary sm:text-3xl">{contact.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{contact.subtitle}</p>
            </div>

            <form className="lg:col-span-7 space-y-4 rounded-xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Họ và tên</label>
                  <input type="text" placeholder="Nhập tên của bạn..." className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-primary placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Số điện thoại</label>
                  <input type="text" placeholder="Nhập số điện thoại..." className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-primary placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Lớp học hiện tại</label>
                <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-primary outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none">
                  <option>Chọn khối lớp</option>
                  <option>Tiểu học</option>
                  <option>THCS</option>
                  <option>THPT</option>
                  <option>Học sinh quốc tế</option>
                </select>
              </div>

              <button type="submit" className="w-full mt-2 rounded-xl bg-orange-500 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition duration-300">
                {contact.buttonLabel}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
