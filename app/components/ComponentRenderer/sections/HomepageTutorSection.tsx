'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Container } from '@/app/components/oatmeal/elements/container'
import type { ComponentContextData } from '../types'
import { BookOpen, Briefcase, GraduationCap, User, Users, Sparkles, type LucideIcon } from 'lucide-react'

const badgeIconMap: Record<string, LucideIcon> = {
    User,
    Users,
    BookOpen,
    GraduationCap,
    Sparkles,
    Briefcase,
}

export function HomepageTutorSection({ context }: { context: ComponentContextData }) {
    const tutors = Array.isArray(context.sectionData?.tutor) ? context.sectionData.tutor.filter(Boolean) : []
    const [activeIndex, setActiveIndex] = useState(0)

    // Quản lý trạng thái animation
    const [animState, setAnimState] = useState<'idle' | 'leaving' | 'entering'>('idle')
    const [displayTutor, setDisplayTutor] = useState(tutors[0] || null)

    // Ref theo dõi trạng thái animation và trạng thái hover chuột
    const animStateRef = useRef(animState)
    animStateRef.current = animState
    const isHovered = useRef(false)

    // Hàm kích hoạt hiệu ứng slide ngang
    const triggerSlideTransition = (nextIndex: number) => {
        setAnimState('leaving')

        setTimeout(() => {
            setActiveIndex(nextIndex)
            setDisplayTutor(tutors[nextIndex])
            setAnimState('entering')

            setTimeout(() => {
                setAnimState('idle')
            }, 50)
        }, 350)
    }

    // Xử lý khi click trực tiếp vào các nút Dots bằng tay
    const handleTutorChange = (nextIndex: number) => {
        if (nextIndex === activeIndex || animStateRef.current !== 'idle') return
        triggerSlideTransition(nextIndex)
    }

    // Tự động chạy Slide (Auto-play) có kiểm tra điều kiện hover chuột
    useEffect(() => {
        if (tutors.length < 2) return

        const interval = window.setInterval(() => {
            // Chỉ tự động chuyển nếu KHÔNG hover chuột và component đang ở trạng thái đứng yên (idle)
            if (!isHovered.current && animStateRef.current === 'idle') {
                setActiveIndex((current) => {
                    const next = (current + 1) % tutors.length
                    triggerSlideTransition(next)
                    return next
                })
            }
        }, 5000)

        return () => window.clearInterval(interval)
    }, [tutors.length])

    // Đồng bộ dữ liệu hiển thị gốc từ CMS
    useEffect(() => {
        if (tutors[activeIndex]) {
            setDisplayTutor(tutors[activeIndex])
        }
    }, [context, tutors, activeIndex])

    if (!displayTutor) return null

    const getAnimationClass = () => {
        if (animState === 'leaving') {
            return 'opacity-0 -translate-x-12 blur-[2px]'
        }
        if (animState === 'entering') {
            return 'opacity-0 translate-x-12 blur-[2px] transition-none'
        }
        return 'opacity-100 translate-x-0 blur-0'
    }

    const badgeColors = [
        'bg-red-100 text-red-700',
        'bg-blue-100 text-blue-700',
        'bg-green-100 text-green-700',
        'bg-yellow-100 text-yellow-700',
        'bg-purple-100 text-purple-700',
        'bg-pink-100 text-pink-700',
        'bg-cyan-100 text-cyan-700',
    ]

    const getColorByLabel = (label?: string) => {
        if (!label) return ''
        const hash = label.split('').reduce((acc, char) => {
            return acc + char.charCodeAt(0)
        }, 0)

        return badgeColors[hash % badgeColors.length]
    }

    return (
        <section
            id="tutors"
            className="bg-slate-100 py-20 overflow-hidden select-none"
            onMouseEnter={() => { isHovered.current = true }} // Di chuột vào -> Dừng đếm giây chuyển slide
            onMouseLeave={() => { isHovered.current = false }} // Rời chuột ra -> Tiếp tục tự động chạy
        >
            <Container>
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

                    {/* KHỐI ẢNH (Bên trái) */}
                    <div className="lg:col-span-5 relative group">
                        <div className={`absolute -inset-1 bg-gradient-to-r from-orange-500/60 to-primary/60 rounded-2xl opacity-5 blur-md group-hover:opacity-10 transition-all duration-350 ease-out ${getAnimationClass()}`} />

                        <div className={`relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-350 ease-out ${getAnimationClass()}`}>
                            <div className="relative aspect-[1] w-full overflow-hidden rounded-xl bg-slate-50">
                                <Image
                                    src={displayTutor.imageUrl ?? ''}
                                    alt={displayTutor.name ?? 'Tutor'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* KHỐI THÔNG TIN (Bên phải) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className={`space-y-6 transition-all duration-350 ease-out ${getAnimationClass()}`}>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">{displayTutor.title}</p>
                            <h3 className="text-2xl font-bold text-primary">{displayTutor.name}</h3>
                            <blockquote className="text-xl font-semibold italic tracking-normal text-black leading-snug">
                                “{displayTutor.quote}”
                            </blockquote>
                            <p className="text-sm leading-relaxed text-black">{displayTutor.description}</p>

                            <div className="space-y-6 pt-4">
                                {displayTutor.badges && displayTutor.badges.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {displayTutor.badges.map((badge, index) => {
                                            const Icon = badge.iconName ? badgeIconMap[badge.iconName] ?? User : User
                                            return (
                                                <span
                                                    key={`${badge.label}-${index}`}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold ${getColorByLabel(
                                                        badge.label
                                                    )}`}
                                                >
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {badge.label}
                                                </span>
                                            )
                                        })}
                                    </div>
                                ) : null}

                                <div className="row flex items-center gap-6">
                                    {displayTutor.stat1Value && displayTutor.stat1Label && (
                                        <div className="pr-6 md:pr-8">
                                            <p className="font-mono text-3xl font-bold tracking-normal text-primary">
                                                {displayTutor.stat1Value}
                                            </p>
                                            <p className="mt-1 font-mono text-xs font-medium text-slate-600 tracking-wide">
                                                {displayTutor.stat1Label}
                                            </p>
                                        </div>
                                    )}
                                    {displayTutor.stat2Value && displayTutor.stat2Label && (
                                        <div className="border-l border-slate-200 pl-6 md:pl-8">
                                            <p className="font-mono text-3xl font-bold tracking-normal text-primary">
                                                {displayTutor.stat2Value}
                                            </p>
                                            <p className="mt-1 font-mono text-xs font-medium text-slate-600 tracking-wide">
                                                {displayTutor.stat2Label}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* THANH ĐIỀU HƯỚNG DOTS */}
                        {tutors.length > 1 ? (
                            <div className="flex gap-2 pt-2">
                                {tutors.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleTutorChange(index)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                                        aria-label={`Show tutor ${index + 1}`}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>

                </div>
            </Container>
        </section>
    )
}