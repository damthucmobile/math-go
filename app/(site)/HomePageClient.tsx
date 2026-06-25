'use client'

import { ButtonLink, PlainButtonLink } from '@/app/components/oatmeal/elements/button'
import { Container } from '@/app/components/oatmeal/elements/container'
import Image from 'next/image'
import { Star, ChevronRight, BookOpen, GraduationCap } from 'lucide-react'
import TrialRegistrationDialog from '../components/dialog/TrialRegistrationDialog'
import { useState } from 'react'
import Link from 'next/link'
import { iconMap, type HomepageData } from '../../lib/homepage-data'

type HomePageClientProps = {
    homepageData: HomepageData
}

export default function HomePageClient({ homepageData }: HomePageClientProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const heroLines = homepageData.hero.headline.split('\n')

    return (
        <main className="bg-slate-50 text-[#0b2f5d] font-sans">
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0f4c81] to-[#0b2f5d] pb-24 pt-20 text-white min-h-[600px] flex items-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />

                <Container className="grid gap-12 lg:grid-cols-12 lg:items-center relative z-10 w-full">
                    <div className="max-w-2xl lg:col-span-7">
                        <span className="inline-flex rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 border border-orange-500/30">
                            {homepageData.hero.badge}
                        </span>
                        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {heroLines.map((line, index) => (
                                <span key={`${line}-${index}`} className="block">
                                    {line}
                                </span>
                            ))}
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                            {homepageData.hero.subtext}
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <ButtonLink
                                href={homepageData.hero.primaryButtonHref}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsDialogOpen(true)
                                }}
                                className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition duration-300"
                            >
                                {homepageData.hero.primaryButtonLabel}
                            </ButtonLink>
                            <PlainButtonLink
                                href={homepageData.hero.secondaryButtonHref}
                                className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white hover:bg-white/20 backdrop-blur-sm transition duration-300"
                            >
                                {homepageData.hero.secondaryButtonLabel}
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

            <section className="bg-white py-12 border-b border-slate-100">
                <Container>
                    <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                        {homepageData.stats.map((stat, index) => (
                            <div key={`${stat.label}-${index}`} className="p-6 text-center border-r border-slate-100 last:border-0">
                                <p className="text-4xl font-bold text-[#0b2f5d]">{stat.value}</p>
                                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <section id="courses" className="py-20 bg-slate-50">
                <Container>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0b2f5d] sm:text-4xl">Chương trình đào tạo</h2>
                        <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 mb-4" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {homepageData.programs.map((program) => {
                            const IconComponent = iconMap[program.iconName] ?? GraduationCap
                            return (
                                <div key={program.title} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition">
                                            <IconComponent className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0b2f5d]">{program.title}</h3>
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

            <section id="tutors" className="bg-slate-100 py-20">
                <Container>
                    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-5 relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-[#0b2f5d] rounded-2xl opacity-10 blur-lg group-hover:opacity-20 transition" />
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
                                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                                    <Image
                                        src={homepageData.tutor.imageUrl}
                                        alt={homepageData.tutor.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-orange-500">{homepageData.tutor.title}</p>
                                <h3 className="mt-2 text-xl font-bold text-[#0b2f5d]">{homepageData.tutor.name}</h3>
                            </div>
                            <blockquote className="text-2xl font-semibold italic tracking-tight text-[#0b2f5d] leading-snug">
                                “{homepageData.tutor.quote}”
                            </blockquote>
                            <p className="text-sm leading-relaxed text-slate-600">
                                {homepageData.tutor.description}
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2 pt-4">
                                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                                    <p className="text-2xl font-bold text-[#0b2f5d]">{homepageData.tutor.stat1Value}</p>
                                    <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{homepageData.tutor.stat1Label}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                                    <p className="text-2xl font-bold text-[#0b2f5d]">{homepageData.tutor.stat2Value}</p>
                                    <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{homepageData.tutor.stat2Label}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section id="testimonials" className="py-20 bg-white">
                <Container>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0b2f5d] sm:text-4xl">Chia Sẻ Từ Học Viên</h2>
                        <div className="w-12 h-1 bg-orange-500 mx-auto mt-4" />
                    </div>
                    <div className="grid gap-8 lg:grid-cols-2">
                        {homepageData.testimonials.map((item, index) => (
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
                                        <Image src={item.avatarUrl} alt={item.author} fill className="object-cover" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-[#0b2f5d]">{item.author}</p>
                                        <p className="text-slate-400 mt-0.5">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <section id="contact" className="bg-[#0b2f5d] py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                <Container className="max-w-5xl relative z-10">
                    <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-xl sm:p-12">
                        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-5 space-y-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                                    {homepageData.contact.eyebrow}
                                </span>
                                <h2 className="text-2xl font-bold tracking-tight text-[#0b2f5d] sm:text-3xl">
                                    {homepageData.contact.title}
                                </h2>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {homepageData.contact.subtitle}
                                </p>
                            </div>

                            <form className="lg:col-span-7 space-y-4 rounded-xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Họ và tên</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập tên của bạn..."
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-[#0b2f5d] placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Số điện thoại</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập số điện thoại..."
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-[#0b2f5d] placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Lớp học hiện tại</label>
                                    <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-[#0b2f5d] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none">
                                        <option>Chọn khối lớp</option>
                                        <option>Tiểu học</option>
                                        <option>THCS</option>
                                        <option>THPT</option>
                                        <option>Học sinh quốc tế</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-2 rounded-xl bg-orange-500 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition duration-300"
                                >
                                    {homepageData.contact.buttonLabel}
                                </button>
                            </form>
                        </div>
                    </div>
                    <TrialRegistrationDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                    />
                </Container>
            </section>
        </main>
    )
}
