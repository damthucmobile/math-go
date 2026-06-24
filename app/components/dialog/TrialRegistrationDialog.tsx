'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  School, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  ChevronDown, 
  ArrowRight,
  CheckCircle2,
  Loader2,
  GraduationCap
} from 'lucide-react'

interface TrialRegistrationDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function TrialRegistrationDialog({ isOpen, onClose }: TrialRegistrationDialogProps) {
  // Trạng thái Form
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')
  const [learningFormat, setLearningFormat] = useState<'1-on-1' | 'group' | ''>('')
  
  // Trạng thái Xử lý Gửi Form
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  // Ngăn cuộn trang phía sau khi Dialog đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset lại form khi đóng
      setTimeout(() => {
        setStatus('idle')
        setFullName('')
        setPhone('')
        setEmail('')
        setGrade('')
        setLearningFormat('')
      }, 300)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!learningFormat) {
      alert('Vui lòng chọn hình thức học!')
      return
    }

    setStatus('loading')
    
    // Giả lập gửi API trong 1.5 giây giống logic nguyên bản
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => {
        onClose()
      }, 1500)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Backdrop nền mờ đặc trưng */}
      <div 
        className="fixed inset-0 bg-[#00355f]/40 backdrop-blur-md transition-opacity duration-300"
        onClick={status === 'loading' ? undefined : onClose}
      />

      {/* Modal Surface Container */}
      <div className="relative bg-white w-full max-w-[600px] rounded-2xl shadow-[0px_4px_40px_rgba(15,76,129,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[90vh]">
        
        {/* Họa tiết lưới toán học nền mờ nhạt (Math Grid Background) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#00355f 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Header Section */}
        <div className="relative px-6 pt-10 pb-5 text-center border-b border-slate-100 shrink-0">
          {/* Nút Đóng Modal */}
          <button 
            disabled={status === 'loading'}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition disabled:opacity-50"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Biểu tượng Mũ cử nhân */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#0f4c81] mb-3.5 animate-bounce [animation-duration:3s]">
            <GraduationCap className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-[#00355f] tracking-tight sm:text-2xl">
            Đăng ký Học thử Miễn phí
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Bắt đầu lộ trình chinh phục môn Toán cùng chuyên gia.
          </p>
        </div>

        {/* Form Nội dung chính (Hỗ trợ scroll nội bộ nếu màn hình quá nhỏ) */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 overflow-y-auto custom-scrollbar grow">
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Họ và tên */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Họ và tên</label>
              <div className="relative group">
                <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00355f] transition-colors" />
                <input
                  type="text"
                  required
                  disabled={status === 'loading'}
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#00355f] focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Số điện thoại</label>
              <div className="relative group">
                <Phone className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00355f] transition-colors" />
                <input
                  type="tel"
                  required
                  disabled={status === 'loading'}
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#00355f] focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Email (Gmail)</label>
            <div className="relative group">
              <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00355f] transition-colors" />
              <input
                type="email"
                required
                disabled={status === 'loading'}
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#00355f] focus:ring-2 focus:ring-blue-500/10 transition disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Lớp Học */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Toán lớp mấy?</label>
              <div className="relative">
                <BookOpen className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  required
                  disabled={status === 'loading'}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#00355f] focus:ring-2 focus:ring-blue-500/10 transition appearance-none cursor-pointer disabled:opacity-60"
                >
                  <option value="" disabled>Chọn lớp học</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{`Lớp ${i + 1}`}</option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Hình thức học */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Hình thức học</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={status === 'loading'}
                  onClick={() => setLearningFormat('1-on-1')}
                  className={`flex-1 py-3 px-2 text-center text-xs font-semibold rounded-xl border transition duration-200 active:scale-[0.97] ${
                    learningFormat === '1-on-1'
                      ? 'bg-[#00355f] text-white border-[#00355f]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  } disabled:opacity-50`}
                >
                  Học 1-kèm-1
                </button>
                <button
                  type="button"
                  disabled={status === 'loading'}
                  onClick={() => setLearningFormat('group')}
                  className={`flex-1 py-3 px-2 text-center text-xs font-semibold rounded-xl border transition duration-200 active:scale-[0.97] ${
                    learningFormat === 'group'
                      ? 'bg-[#00355f] text-white border-[#00355f]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  } disabled:opacity-50`}
                >
                  Lớp nhóm nhỏ
                </button>
              </div>
            </div>
          </div>

          {/* Điều khoản chính sách */}
          <p className="text-[10px] leading-relaxed text-slate-400 text-center px-4 pt-2">
            Bằng việc nhấn "Xác nhận Đăng ký", bạn đồng ý với các Điều khoản & Chính sách bảo mật của MathGo.
          </p>
          
          {/* Nút Submit cố định ở chân form có kèm các Micro-interactions */}
          <div className="pt-3 border-t border-slate-50 shrink-0">
            {status === 'idle' && (
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.99] transition duration-200"
              >
                <span>Xác nhận Đăng ký</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {status === 'loading' && (
              <button
                type="button"
                disabled
                className="w-full bg-[#00562a] text-white font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý dữ liệu...</span>
              </button>
            )}

            {status === 'success' && (
              <button
                type="button"
                disabled
                className="w-full bg-[#52d17e] text-[#00210c] font-bold py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Đăng ký thành công!</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  )
}