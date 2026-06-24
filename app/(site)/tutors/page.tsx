'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Container } from '@/app/components/oatmeal/elements/container'
import { 
  GraduationCap, 
  Briefcase, 
  Search, 
  ChevronDown,
  Share2,
  Mail
} from 'lucide-react'

const tutorsData = [
  {
    name: 'Thầy Nguyễn Văn A',
    role: 'Chuyên luyện thi Đại học',
    experience: '15+ Năm Kinh nghiệm',
    levels: ['Trung học Phổ thông'],
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    description: 'Cựu trưởng bộ môn Toán tại trường THPT Chuyên trọng điểm quốc gia. Chuyên gia về Giải tích nâng cao và hình thức thi trắc nghiệm đại học...',
    tags: ['Giải tích', 'Đại số', 'Trung học Phổ thông']
  },
  {
    name: 'Cô Trần Thị B',
    role: 'Huấn luyện viên Học sinh giỏi môn Toán',
    experience: '8 Năm Kinh nghiệm',
    levels: ['Trung học Cơ sở', 'Trung học Phổ thông'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    description: 'Giảng viên đạt nhiều giải thưởng lớn, chuyên bồi dưỡng phương pháp giải toán tư duy đột phá và các chuyên đề hình học khó môn chuyên...',
    tags: ['Hình học', 'Số học', 'Trung học Cơ sở']
  },
  {
    name: 'Thầy Lê Hoàng C',
    role: 'Chuyên gia Toán Tiểu học',
    experience: '5 Năm Kinh nghiệm',
    levels: ['Tiểu học'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    description: 'Chuyên xây dựng nền tảng tư duy vững chắc cho học sinh nhỏ tuổi. Áp dụng phương pháp trực quan sinh động và các bài toán thực tế...',
    tags: ['Số học', 'Toán nền tảng', 'Tiểu học']
  },
  {
    name: 'GS. Đặng Minh D',
    role: 'Chuyên gia Xác suất Thống kê',
    experience: '30+ Năm Kinh nghiệm',
    levels: ['Đại học'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    description: 'Giáo sư ưu tú với hàng chục năm nghiên cứu, giảng dạy Xác suất Thống kê cấp Đại học. Chuyên luyện đề chuyên sâu nâng cao tư duy logic...',
    tags: ['Thống kê', 'Xác suất', 'Đại học']
  },
  {
    name: 'Cô Phạm Ngọc E',
    role: 'Chuyên gia Hình học Không gian',
    experience: '12 Năm Kinh nghiệm',
    levels: ['Trung học Cơ sở', 'Trung học Phổ thông'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    description: 'Nổi tiếng với cách đơn giản hóa các mô hình không gian phức tạp thông qua giáo cụ trực quan. Giúp học sinh bứt phá điểm số hình học...',
    tags: ['Hình học', 'Lượng giác', 'Trung học Phổ thông']
  },
  {
    name: 'Thầy Vũ Minh F',
    role: 'Luyện thi Đại số & Chứng chỉ SAT',
    experience: '20 Năm Kinh nghiệm',
    levels: ['Trung học Phổ thông'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
    description: 'Bậc thầy về phương pháp giải nhanh và mẹo phòng thi trắc nghiệm. Đóng góp lớn giúp học sinh nâng cao điểm số SAT/ACT ngoạn mục...',
    tags: ['Toán SAT', 'Đại số', 'Toán Quốc tế']
  }
]

// Danh sách các chuyên ngành học cố định để hiển thị trong select option
const specializations = ['Giải tích', 'Đại số', 'Hình học', 'Số học', 'Thống kê', 'Xác suất', 'Toán SAT']

export default function TutorsPage() {
  // 1. Quản lý 3 trạng thái của bộ lọc
  const [selectedLevel, setSelectedLevel] = useState('Tất cả')
  const [selectedSpec, setSelectedSpec] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')

  // 2. Hàm lọc đa điều kiện kết hợp liên hoàn
  const filteredTutors = tutorsData.filter((tutor) => {
    // Điều kiện 1: Khớp Cấp độ
    const matchesLevel = selectedLevel === 'Tất cả' || tutor.levels.includes(selectedLevel)
    
    // Điều kiện 2: Khớp Chuyên ngành (Kiểm tra trong mảng `tags`)
    const matchesSpec = selectedSpec === 'Tất cả' || tutor.tags.includes(selectedSpec)
    
    // Điều kiện 3: Khớp từ khóa tìm kiếm tên (Không phân biệt hoa thường)
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesLevel && matchesSpec && matchesSearch
  })

  return (
    <main className="bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Header */}
      <section className="bg-white pt-16 pb-12 border-b border-slate-100">
        <Container className="max-w-5xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0f4c81] border border-blue-100">
            <GraduationCap className="h-3.5 w-3.5" /> Giảng Viên Kỹ Năng Cao
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0b2f5d] lg:text-5xl leading-tight">
            Học hỏi từ những bộ óc Toán học xuất sắc nhất
          </h1>
        </Container>
      </section>

      {/* Thanh tìm kiếm và bộ lọc */}
      <section className="py-8 bg-slate-50 border-b border-slate-200/60">
        <Container className="max-w-5xl">
          <div className="grid gap-6 md:flex md:items-end md:justify-between bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            
            {/* Lọc theo cấp độ */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Lọc theo cấp độ</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Tất cả Cấp độ', value: 'Tất cả' },
                  { label: 'Tiểu học', value: 'Tiểu học' },
                  { label: 'Trung học Cơ sở', value: 'Trung học Cơ sở' },
                  { label: 'Trung học Phổ thông', value: 'Trung học Phổ thông' }
                ].map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setSelectedLevel(btn.value)}
                    className={`px-4 py-1.5 font-medium text-xs rounded-full transition shadow-sm border ${
                      selectedLevel === btn.value
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chuyên ngành học & Ô Tìm kiếm tên */}
            <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
              
              {/* Lọc theo Chuyên ngành (Đã hoạt động) */}
              <div className="space-y-2 sm:w-48">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Chuyên ngành học</label>
                <div className="relative">
                  <select 
                    value={selectedSpec}
                    onChange={(e) => setSelectedSpec(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-xs font-medium text-slate-700 outline-none appearance-none cursor-pointer focus:border-slate-400 transition"
                  >
                    <option value="Tất cả">Tất cả Môn học</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Tìm kiếm theo Tên (Đã hoạt động) */}
              <div className="space-y-2 flex-1 sm:w-64">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">&nbsp;</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên giảng viên..." 
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 transition"
                  />
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Danh sách hiển thị sau khi lọc */}
      <section className="py-12">
        <Container className="max-w-5xl">
          {filteredTutors.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTutors.map((tutor, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100 border border-slate-100 shrink-0">
                        <Image src={tutor.avatar} alt={tutor.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#0b2f5d] leading-snug">{tutor.name}</h3>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">{tutor.role}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {tutor.experience}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-500">{tutor.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tutor.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-0.5 bg-blue-50 text-[#0f4c81] text-[10px] font-semibold rounded-md border border-blue-100/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-6 py-2.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[#0f4c81] font-bold text-xs rounded-xl transition">
                    Xem Hồ Sơ Chi Tiết
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
              Không tìm thấy giảng viên nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}