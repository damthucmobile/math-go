'use client'
import { ButtonLink, PlainButtonLink } from '@/app/components/oatmeal/elements/button'
import { Container } from '@/app/components/oatmeal/elements/container'
import Image from 'next/image'
import {
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Star,
  ChevronRight,
} from 'lucide-react'
import TrialRegistrationDialog from '../components/dialog/TrialRegistrationDialog'
import { useState } from 'react'
import { ROUTE_BUILDERS } from '@/lib/routes'
import Link from 'next/link'

const programCards = [
  {
    title: 'Toán Tiểu Học',
    description: 'Xây dựng nền tảng vững chắc, kích thích tư duy logic và niềm yêu thích môn Toán từ nhỏ.',
    icon: GraduationCap,
    href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('tieu-hoc')
  },
  {
    title: 'Toán THCS',
    description: 'Lấy lại gốc nhanh chóng, nâng cao kỹ năng giải quyết vấn đề và chuẩn bị thi vào 10.',
    icon: BookOpen,
    href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('trung-hoc')
  },
  {
    title: 'Toán THPT & Luyện Thi',
    description: 'Chiến thuật giải đề trắc nghiệm nhanh, bao quát kiến thức và tối ưu hoá điểm số thi Đại học.',
    icon: Award,
    href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('trung-hoc-pho-thong')
  },
  {
    title: 'Toán Quốc Tế',
    description: 'Chuẩn bị cho các kỳ thi SAT, IGCSE, A-Level với giáo trình chuẩn quốc tế và tư duy chuyên sâu.',
    icon: Globe,
    href: ROUTE_BUILDERS.CURRICULUM_BY_SLUG('toan-quoc-te')
  },
]

const testimonials = [
  {
    quote: 'Trước đây em rất sợ môn Toán và luôn bị điểm kém. Nhờ sự tận tình của các thầy cô tại MathGo, em đã lấy lại được căn bản và đạt điểm 9.0 trong kỳ thi học kỳ vừa qua.',
    author: 'Bạn Minh Anh',
    role: 'Học sinh lớp 12',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    quote: 'Lộ trình học tập cá nhân hoá là điều tôi ưng nhất. Con tôi từ chỗ lười học đã trở nên chủ động và yêu thích việc giải các bài toán khó hơn mỗi ngày.',
    author: 'Chị Thu Trang',
    role: 'Phụ huynh học sinh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  },
]

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  return (
    <main className="bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f4c81] to-[#0b2f5d] pb-24 pt-20 text-white min-h-[600px] flex items-center">
        {/* Decorative Background Graphics */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />

        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center relative z-10 w-full">
          <div className="max-w-2xl lg:col-span-7">
            <span className="inline-flex rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 border border-orange-500/30">
              HỌC TẬP TOÀN DIỆN
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Chinh Phục Môn Toán<br />Cùng MathGo
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Gia sư tận tâm, phương pháp hiện đại, giúp học sinh bứt phá điểm số thông qua lộ trình cá nhân hóa.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(true);
                }}
                className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition duration-300"
              >
                Đăng Ký Học Thử Miễn Phí
              </ButtonLink>
              <PlainButtonLink
                href="#courses"
                className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white hover:bg-white/20 backdrop-blur-sm transition duration-300"
              >
                Xem Chương Trình
              </PlainButtonLink>
            </div>
          </div>

          {/* Right Floating Card */}
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

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-slate-100">
        <Container>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="p-6 text-center border-r border-slate-100 last:border-0">
              <p className="text-4xl font-bold text-[#0b2f5d]">1000+</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Học sinh đã theo học</p>
            </div>
            <div className="p-6 text-center border-r border-slate-100 last:border-0">
              <p className="text-4xl font-bold text-[#0b2f5d]">10+</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Năm kinh nghiệm giảng dạy</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-[#0b2f5d]">95%</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Học sinh tiến bộ rõ rệt</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-slate-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Chương Trình Đào Tạo</p>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 mb-4" />
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Lộ trình học được thiết kế cho mọi cấp độ và mục tiêu.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programCards.map((program) => {
              const IconComponent = program.icon
              return (
                <div key={program.title} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
                  <div>
                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{program.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{program.description}</p>
                  </div>
                  <Link href={program?.href}>
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

      {/* Tutor Section */}
      <section id="tutors" className="bg-slate-100 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-[#0b2f5d] rounded-2xl opacity-10 blur-lg group-hover:opacity-20 transition" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80"
                    alt="Thầy Nguyễn Văn A"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Đội Ngũ Giảng Viên</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Thầy Nguyễn Văn A</h3>
              </div>
              <blockquote className="text-2xl font-semibold italic tracking-tight text-[#0b2f5d] leading-snug">
                “Môn Toán không khó, cái khó là chưa tìm được chìa khoá để mở cánh cửa tư duy.”
              </blockquote>
              <p className="text-sm leading-relaxed text-slate-600">
                Thạc sĩ chuyên ngành Toán học với hơn 15 năm kinh nghiệm luyện thi chuyên. Thầy nổi tiếng với phương pháp giảng dạy trực quan, giúp học sinh nắm vững bản chất thay vì học vẹt công thức.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-2xl font-bold text-[#0b2f5d]">15+</p>
                  <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">Năm kinh nghiệm</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                  <p className="text-2xl font-bold text-[#0b2f5d]">5000+</p>
                  <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">Học sinh đỗ đạt</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Chia Sẻ Từ Học Viên</h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-4" />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.map((item, index) => (
              <div key={index} className="relative rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm flex flex-col justify-between">
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
                    <Image src={item.avatar} alt={item.author} fill className="object-cover" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{item.author}</p>
                    <p className="text-slate-400 mt-0.5">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#0b2f5d] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <Container className="max-w-5xl relative z-10">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-xl sm:p-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  TƯ VẤN MIỄN PHÍ
                </span>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Tư vấn lộ trình học tập miễn phí
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ và hỗ trợ kiểm tra
                  năng lực trong vòng 24h.
                </p>
              </div>

              <form className="lg:col-span-7 space-y-4 rounded-xl bg-slate-50 p-6 border border-slate-200 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên của bạn..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Lớp học hiện tại
                  </label>

                  <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition appearance-none">
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
                  Gửi Yêu Cầu Tư Vấn
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