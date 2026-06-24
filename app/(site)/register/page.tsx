
import Image from 'next/image'
import { Container } from '@/app/components/oatmeal/elements/container'
import { 
  User, 
  GraduationCap, 
  LineChart, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export default function RegisterPage() {
  return (
    <main className="bg-[#f8fafc] text-slate-900 font-sans antialiased bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] min-h-screen flex flex-col justify-between">
      
      {/* Main Content Area */}
      <Container className="max-w-5xl py-16 grid gap-12 lg:grid-cols-12 items-start flex-1">
        
        {/* Left Column: Marketing & Testimonial */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-[#0f4c81] border border-blue-100">
              <GraduationCap className="h-3.5 w-3.5" /> Tuyển sinh 2024
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#0b2f5d] leading-none sm:text-5xl">
              Làm chủ<br />Môn Toán với<br />
              <span className="text-[#9a5103]">Sự tự tin.</span>
            </h1>
            <p className="mt-4 text-xs leading-relaxed text-slate-500 font-medium">
              Gia nhập cộng đồng hơn 5.000 học sinh đang chinh phục ước mơ học tập thông qua lộ trình hướng dẫn học Toán từng bước, bài bản của chúng tôi.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-5">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-[#0f4c81] text-white shrink-0 shadow-sm shadow-[#0f4c81]/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0b2f5d]">Gia sư Cá nhân hóa 1-kèm-1</h3>
                <p className="text-[11px] leading-relaxed text-slate-400 mt-1">
                  Giáo án được thiết kế riêng biệt, phù hợp với tốc độ học và học lực hiện tại của từng học sinh.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-orange-400 text-white shrink-0 shadow-sm shadow-orange-400/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0b2f5d]">Đội ngũ Giáo viên Chuyên gia</h3>
                <p className="text-[11px] leading-relaxed text-slate-400 mt-1">
                  Học hỏi từ các giáo viên giàu kinh nghiệm và có chuyên môn sâu về toán học nâng cao.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm shadow-emerald-600/20">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0b2f5d]">Theo dõi Tiến độ sát sao</h3>
                <p className="text-[11px] leading-relaxed text-slate-400 mt-1">
                  Bảng điều khiển thời gian thực hiển thị sự tiến bộ, điểm số bài kiểm tra và mức độ làm chủ kiến thức.
                </p>
              </div>
            </div>
          </div>

          {/* Left Mini Testimonial */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 max-w-sm">
            <p className="text-[11px] leading-relaxed text-slate-600 italic font-medium">
              "Phương pháp học bài bản tại MathGo đã giúp em cải thiện từ điểm kém lên điểm A- chỉ trong một học kỳ."
            </p>
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                <Image 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" 
                  alt="Sarah J." 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="text-[10px]">
                <p className="font-bold text-slate-900">Thuý Hiền.</p>
                <p className="text-slate-400 mt-0.5">Học sinh lớp Cô Hà</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0b2f5d] mb-6">Đăng ký Nhập học</h2>
          
          <form className="space-y-6">
            
            {/* Section 1: Student Information */}
            <div className="relative border-t border-slate-200/80 pt-4">
              <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-[#0f4c81] tracking-wider uppercase">
                Thông tin học sinh
              </span>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Họ và tên</label>
                  <input type="text" placeholder="Nhập họ và tên học sinh" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] outline-none transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Tuổi</label>
                  <input type="text" placeholder="Tuổi của học sinh" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] outline-none transition" />
                </div>
              </div>
            </div>

            {/* Section 2: Parent Contact */}
            <div className="relative border-t border-slate-200/80 pt-4 mt-8">
              <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-[#0f4c81] tracking-wider uppercase">
                Liên hệ Phụ huynh / Người giám hộ
              </span>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Người liên hệ</label>
                  <input type="text" placeholder="Họ và tên phụ huynh" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] outline-none transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Địa chỉ Email</label>
                  <input type="email" placeholder="email@viethong.com" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] outline-none transition" />
                </div>
              </div>
            </div>

            {/* Section 3: Academic Details */}
            <div className="relative border-t border-slate-200/80 pt-4 mt-8">
              <span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold text-[#0f4c81] tracking-wider uppercase">
                Thông tin học tập
              </span>
              <div className="grid gap-4 sm:grid-cols-12 items-end">
                <div className="sm:col-span-7 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Khóa học mong muốn</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 outline-none focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_auto] bg-[right_16px_center] bg-no-repeat">
                    <option>Chọn một khóa học</option>
                    <option>Toán Tư Duy Tiểu Học</option>
                    <option>Toán Trung Học Cơ Sở</option>
                    <option>Toán Luyện Thi THPT</option>
                    <option>Toán Quốc Tế (SAT/IB)</option>
                  </select>
                </div>
                
                {/* Learning Format Radio Buttons */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Hình thức học</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-center p-3 rounded-xl border border-blue-600 bg-blue-50/20 text-xs font-semibold text-[#0f4c81] cursor-pointer transition select-none">
                      <input type="radio" name="format" value="1-on-1" defaultChecked className="sr-only" />
                      Lớp 1-kèm-1
                    </label>
                    <label className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-500 cursor-pointer transition select-none">
                      <input type="radio" name="format" value="group" className="sr-only" />
                      Học theo Nhóm
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Consent Checklist */}
            <div className="pt-2 flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-0.5 rounded border-slate-300 text-[#0f4c81] focus:ring-[#0f4c81] h-3.5 w-3.5 cursor-pointer" />
              <label htmlFor="terms" className="text-[10px] text-slate-500 leading-relaxed cursor-pointer select-none">
                Tôi đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật, đồng thời hiểu rằng cuộc gọi tư vấn sẽ được lên lịch trong vòng 24 giờ.
              </label>
            </div>

            {/* Action Submit Button */}
            <div className="space-y-4 pt-2">
              <button type="submit" className="w-full py-4 bg-[#9a5103] hover:bg-[#804302] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-amber-900/10">
                Đăng ký Ngay <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                <span>Hệ thống đăng ký bảo mật được vận hành bởi MathGo Cloud.</span>
              </div>
            </div>

          </form>
        </div>
      </Container>
    </main>
  )
}

