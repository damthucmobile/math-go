
'use client' // Cần thiết để sử dụng useState trong Next.js App Router

import { useState } from 'react'
import Image from 'next/image'
import { Container } from '@/app/components/oatmeal/elements/container'
import { 
  BookOpen, 
  CheckCircle2, 
  Sigma, 
  Compass, 
  Award, 
  Check, 
  Calendar,
  ArrowRight
} from 'lucide-react'

// 1. Toàn bộ dữ liệu được đưa về dạng MẢNG PHẲNG phẳng đồng nhất
const coursesData = [
  // ================= TIỂU HỌC =================
  {
    id: 'course-1',
    level: 'tieu-hoc',
    type: 'section-complex',
    title: 'Toán Tư Duy Tiểu Học (Cơ bản & Nâng cao)',
    image: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=600&auto=format&fit=crop&q=80',
    badges: ['Lớp 1-5', 'CPA Singapore', 'Critical Thinking'],
    description: 'Áp dụng phương pháp CPA (Cụ thể - Hình ảnh - Trừu tượng) của Singapore, giúp học sinh tiểu học nắm vững bản chất tư duy thay vì học vẹt công thức.',
    content: ['Số học & Tư duy logic phân tích', 'Hình học trực quan khối phẳng', 'Giải toán đố có lời văn (Word Problems)'],
    result: ['Kích thích niềm yêu thích môn Toán', 'Tự tin tự giải quyết vấn đề độc lập', 'Xây dựng nền tảng vững chắc lên THCS'],
    schedule: 'Tối T2-T4 hoặc Sáng Thứ 7 & CN'
  },
  {
    id: 'course-2',
    level: 'tieu-hoc',
    type: 'section-complex',
    title: 'Toán Luyện Thi Học Sinh Giỏi & Kangaroo (SASMO/IKMC)',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    badges: ['Lớp 3-5', 'Toán Olympic', 'Problem Solving'],
    description: 'Khóa học chuyên sâu dành cho học sinh khá giỏi muốn thử thách bản thân với các kỳ thi Toán quốc tế phổ biến như Olympic Kangaroo, SASMO.',
    content: ['Toán rời rạc và quy luật dãy số', 'Bài toán tư duy Logic nâng cao', 'Phương pháp giải đề thi thử các năm trước'],
    result: ['Đạt giải thưởng tại các kỳ thi quốc tế', 'Phát triển tư duy đột phá', 'Làm quen áp lực phòng thi'],
    schedule: 'Chiều Thứ 7 & Chủ Nhật'
  },

  // ================= TRUNG HỌC CƠ SỞ =================
  {
    id: 'course-3',
    level: 'thcs',
    type: 'grid-cards',
    title: 'Toán Trung Học Cơ Sở (Lớp 6-9) - Hệ Đại Trà & Chất Lượng Cao',
    description: 'Giai đoạn vàng để hình thành tư duy trừu tượng, củng cố toàn bộ kiến thức đại số hình học cốt lõi của Bộ GD&ĐT.',
    rightBadge: 'Bám sát chương trình chuẩn & Nâng cao',
    cards: [
      {
        icon: <Sigma className="h-4 w-4" />,
        iconBg: 'bg-blue-50 text-blue-600',
        borderTop: '',
        title: 'Đại Số & Số Học',
        desc: 'Làm chủ phương trình, hệ thức, căn thức và các biểu thức đại số phức tạp thông qua các mẹo và thuật toán tối ưu.'
      },
      {
        icon: <Compass className="h-4 w-4" />,
        iconBg: 'bg-amber-50 text-amber-600',
        borderTop: 'border-t-2 border-t-amber-600',
        title: 'Hình Học Phẳng & Không Gian',
        desc: 'Phát triển trí tưởng tượng không gian, kỹ năng vẽ hình phụ và các phương pháp chứng minh hình học chặt chẽ, logic.'
      },
      {
        icon: <Award className="h-4 w-4" />,
        iconBg: 'bg-emerald-50 text-emerald-600',
        borderTop: '',
        title: 'Luyện Lớp Chuyên (9 Lên 10)',
        desc: 'Lộ trình rèn luyện chuyên sâu các chuyên đề Toán bất đẳng thức, tổ hợp... cho học sinh thi vào trường Chuyên.'
      }
    ]
  },

  // ================= TRUNG HỌC PHỔ THÔNG =================
  {
    id: 'course-4',
    level: 'thpt',
    type: 'grid-cards',
    title: 'Toán Trung Học Phổ Thông (Lớp 10-12) - Luyện Thi Tốt Nghiệp & ĐGNL',
    description: 'Tăng tốc bứt phá điểm số phục vụ Kỳ thi Tốt nghiệp THPT Quốc gia và xét tuyển vào các trường Đại học Top đầu.',
    rightBadge: 'Trọng tâm & Đột phá kỹ năng trắc nghiệm',
    cards: [
      {
        icon: <Sigma className="h-4 w-4" />,
        iconBg: 'bg-indigo-50 text-indigo-600',
        borderTop: '',
        title: 'Giải Tích & Hình Học Oxyz',
        desc: 'Khảo sát hàm số, nguyên hàm, tích phân và tọa độ hóa không gian giải quyết nhanh gọn bài toán vận dụng cao.'
      },
      {
        icon: <Compass className="h-4 w-4" />,
        iconBg: 'bg-rose-50 text-rose-600',
        borderTop: 'border-t-2 border-t-rose-600',
        title: 'Mẹo Bấm Máy Casio Thần Tốc',
        desc: 'Tối ưu hóa thời gian thi trắc nghiệm bằng phương pháp chuẩn hóa, loại trừ đáp án và kỹ thuật giải nhanh bằng máy tính.'
      },
      {
        icon: <Award className="h-4 w-4" />,
        iconBg: 'bg-amber-50 text-amber-600',
        borderTop: '',
        title: 'Luyện Đề Đánh Giá Năng Lực',
        desc: 'Kho đề thi ĐGNL ĐHQG chuẩn cấu trúc mới, rèn kỹ năng đọc hiểu và xử lý số liệu logic, tư duy định lượng.'
      }
    ]
  },

  // ================= TOÁN QUỐC TẾ =================
  {
    id: 'course-5',
    level: 'toan-quoc-te',
    type: 'split-columns',
    title: 'Chương Trình Luyện Thi Các Chứng Chỉ Toán Quốc Tế',
    columns: [
      {
        badge: 'SAT/ACT Math',
        sub: 'Dành cho du học Mỹ',
        badgeBg: 'bg-amber-500',
        desc: 'Chiến thuật giải nhanh, mẹo loại trừ đáp án và làm chủ áp lực thời gian 80 phút trong kỳ thi SAT Digital mới nhất.',
        points: ['Cam kết tăng từ 100-150 điểm Math sau lộ trình', 'Kho đề thi thử độc quyền cập nhật từ College Board']
      },
      {
        badge: 'IB / AP / A-Level',
        sub: 'Tích lũy tín chỉ Đại học sớm',
        badgeBg: 'bg-emerald-500',
        desc: 'Hỗ trợ học thuật chuyên sâu cho các môn Toán HL/SL, giải tích nâng cao của hệ thống tú tài quốc tế Anh, Mỹ.',
        points: ['Giáo trình 100% bằng Tiếng Anh chuẩn quốc tế', 'Đội ngũ mentor đạt điểm tuyệt đối từ các trường đại học lớn']
      }
    ]
  }
]

export default function CoursesPage() {
  // Quản lý Tab được chọn bằng state (mặc định chọn 'tieu-hoc')
  const [activeTab, setActiveTab] = useState('tieu-hoc')

  // Dùng hàm .filter() trực tiếp trên mảng phẳng phẳng
  const filteredCourses = coursesData.filter(course => course.level === activeTab)

  return (
    <main className="bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* 1. Header Section */}
      <section className="bg-white pt-16 pb-12 text-center border-b border-slate-100">
        <Container className="max-w-4xl">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#0f4c81] border border-blue-100">
            PROGRAMS & CURRICULUM
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#0b2f5d] sm:text-4xl lg:text-5xl leading-tight">
            Chương trình học Toán chuẩn Quốc tế<br />tại MathGo
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-slate-500 max-w-2xl mx-auto">
            Từ nền tảng tư duy tiểu học đến các chứng chỉ quốc tế cấp trung học, chúng tôi đồng hành cùng học sinh trên con đường chinh phục đỉnh cao tri thức.
          </p>
        </Container>
      </section>

      {/* 2. Sub Navigation Tabs */}
      <div className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <Container className="max-w-5xl">
          <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar text-xs font-medium text-slate-500">
            {[
              { id: 'tieu-hoc', label: 'Tiểu Học' },
              { id: 'thcs', label: 'Trung Học Cơ Sở' },
              { id: 'thpt', label: 'Trung Học Phổ Thông' },
              { id: 'toan-quoc-te', label: 'Toán Quốc Tế (SAT/IB/AP)' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-bold shrink-0 transition ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-[#0f4c81]' 
                    : 'hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Main Content Area - Render danh sách sau khi dùng .filter() */}
      <Container className="max-w-5xl py-12 space-y-12">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="animate-fade-in duration-200">
              
              {/* KIỂU 1: Hiển thị Banner Phức hợp (Ví dụ: Các khóa Tiểu học) */}
              {course.type === 'section-complex' && (
                <section className="bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                        <Image 
                          src={course.image || ''} 
                          alt={course.title} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.badges?.map((badge, bIdx) => (
                          <span key={bIdx} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md">{badge}</span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-[#0b2f5d] md:text-2xl">{course.title}</h2>
                        <p className="mt-3 text-xs leading-relaxed text-slate-500">{course.description}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                          <div className="flex items-center gap-2 font-bold text-xs text-amber-700 mb-3">
                            <BookOpen className="h-4 w-4" />
                            <span>Nội dung học tập</span>
                          </div>
                          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                            {course.content?.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20">
                          <div className="flex items-center gap-2 font-bold text-xs text-emerald-700 mb-3">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Mục tiêu đầu ra</span>
                          </div>
                          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                            {course.result?.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs">
                          <span className="block font-bold text-amber-600">Lịch học linh hoạt:</span>
                          <span className="text-slate-500 mt-1 block">{course.schedule}</span>
                        </div>
                        <button className="px-6 py-3 bg-[#9a5103] hover:bg-[#804302] text-white font-bold text-xs rounded-xl transition shadow-md">
                          Đăng ký học thử miễn phí
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* KIỂU 2: Giao diện Thẻ Lưới Lựa chọn (Ví dụ: Khóa THCS, THPT) */}
              {course.type === 'grid-cards' && (
                <section className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-xl">
                      <h2 className="text-2xl font-bold text-[#0b2f5d]">{course.title}</h2>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">{course.description}</p>
                    </div>
                    <span className="px-4 py-2 bg-blue-50 text-[#0f4c81] text-[11px] font-semibold rounded-lg border border-blue-100">
                      {course.rightBadge}
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    {course.cards?.map((card, cIdx) => (
                      <div key={cIdx} className={`bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col justify-between ${card.borderTop}`}>
                        <div>
                          <div className={`h-8 w-8 inline-flex items-center justify-center rounded-lg mb-4 ${card.iconBg}`}>
                            {card.icon}
                          </div>
                          <h3 className="text-base font-bold text-[#0b2f5d]">{card.title}</h3>
                          <p className="mt-3 text-xs leading-relaxed text-slate-500">{card.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Banner Bứt Phá Điểm Số đặt cố định ở cuối Layout Grid */}
                  <div className="bg-[#043363] rounded-2xl p-6 md:p-8 text-white flex flex-wrap items-center justify-between gap-6 shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-5 text-9xl font-black select-none font-serif tracking-tighter">MATH</div>
                    <div className="space-y-1 z-10">
                      <h3 className="text-lg font-bold">Bạn đang tìm kiếm lộ trình bứt phá điểm số thi THPT hoặc Chuyên?</h3>
                      <p className="text-xs text-blue-200">Tham gia ngay buổi kiểm tra đánh giá năng lực tư duy hoàn toàn miễn phí.</p>
                    </div>
                    <button className="px-6 py-3 bg-[#9a5103] hover:bg-[#804302] text-white font-bold text-xs rounded-xl transition shadow-md whitespace-nowrap z-10">
                      Đăng ký ngay
                    </button>
                  </div>
                </section>
              )}

              {/* KIỂU 3: Giao diện Chia Cột Đôi kèm Sidebar (Ví dụ: Toán Quốc Tế) */}
              {course.type === 'split-columns' && (
                <section className="grid gap-8 lg:grid-cols-12 items-start">
                  <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="relative h-44 bg-[#0a2342] p-8 flex items-end">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 to-transparent" />
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                      <h3 className="text-lg font-bold text-white z-10">{course.title}</h3>
                    </div>
                    
                    <div className="p-6 md:p-8 grid gap-8 sm:grid-cols-2">
                      {course.columns?.map((col, colIdx) => (
                        <div key={colIdx} className={`space-y-4 ${colIdx > 0 ? 'sm:border-l sm:border-slate-100 sm:pl-6' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-white font-bold text-[9px] rounded ${col.badgeBg}`}>{col.badge}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{col.sub}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-600">{col.desc}</p>
                          <ul className="text-xs text-slate-600 space-y-2">
                            {col.points.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> 
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Lịch Khai Giảng Dự Kiến */}
                  <div className="lg:col-span-4 space-y-6 w-full">
                    <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200/60 space-y-4 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Lịch khai giảng dự kiến</span>
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-slate-200/30">
                          <div className="bg-[#043363] text-white text-center rounded-lg p-2 min-w-[50px]">
                            <span className="block text-[9px] font-semibold uppercase opacity-70 leading-none">Tháng</span>
                            <span className="text-base font-bold leading-none mt-1 block">09</span>
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-slate-800">Lớp SAT Cam Kết Đầu Ra</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">Còn 3 vị trí trống</p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-slate-200/30">
                          <div className="bg-slate-400 text-white text-center rounded-lg p-2 min-w-[50px]">
                            <span className="block text-[9px] font-semibold uppercase opacity-70 leading-none">Tháng</span>
                            <span className="text-base font-bold leading-none mt-1 block">10</span>
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-slate-800">Toán IB HL Analysis</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">Đang tiếp nhận đăng ký</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-[#9a5103] hover:bg-[#804302] text-white font-bold text-xs rounded-xl transition shadow-sm">
                        Đăng ký ngay
                      </button>
                    </div>

                    <div className="bg-[#053c75] rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                      <div className="absolute -right-6 -bottom-6 opacity-5 bg-white w-24 h-24 rounded-full border-[8px] border-white" />
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider">1:1 Cá Nhân Hóa</h4>
                        <p className="text-xs text-slate-100 leading-relaxed">
                          Giải pháp lớp học gia sư một kèm một tăng tốc cho học sinh trường quốc tế, song ngữ.
                        </p>
                      </div>
                      <a href="#" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200 pt-3 group">
                        Liên hệ tư vấn <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </section>
              )}

            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            Hiện tại chưa có khóa học nào thuộc cấp học này.
          </div>
        )}
      </Container>
    </main>
  )
}

