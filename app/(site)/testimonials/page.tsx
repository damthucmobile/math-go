'use client'

import React from 'react'
import { TrendingUp, Verified, Timer, School, Share2, Globe } from 'lucide-react'

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased selection:bg-primary-container/10">
      <main className="min-h-screen pb-24">
        
        {/* HERO SECTION */}
        <section className="relative py-12 px-6 md:px-10 max-w-[1200px] mx-auto">
          <div className="absolute inset-0 opacity-20 -z-10" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div>
            <span className="inline-block px-3 py-1 bg-primary-container/10 text-primary rounded-full text-sm font-medium mb-4">Câu chuyện thành công</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-normal mb-6 leading-tight md:leading-[56px]">Kết quả thực tế từ những học viên nỗ lực</h1>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">Khám phá cách phương pháp tiếp cận toán học có cấu trúc của chúng tôi đã thay đổi hành trình học tập của hàng ngàn học sinh trên khắp thế giới.</p>
          </div>
        </section>

        {/* MEASURED PROGRESS (STATS) */}
        <section className="px-6 md:px-10 max-w-[1200px] mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-primary mb-8 text-center">Tiến độ được kiểm chứng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-tertiary size-8" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">+42% Điểm số tăng trưởng</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">Mức cải thiện trung bình ở phần thi toán SAT/ACT sau 12 tuần được huấn luyện chuyên sâu.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mb-4">
                <Verified className="text-secondary size-8" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">98% Tỷ lệ đạt mục tiêu</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">Số học sinh tham gia khóa học cấp tốc Giải tích đạt thành công điểm số tối đa A hoặc B.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-4">
                <Timer className="text-primary size-8" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">Giải toán nhanh hơn 50%</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">Thời gian làm bài trung bình giảm rõ rệt cho mỗi phương trình nhờ tối ưu hóa tư duy logic.</p>
              </div>
            </div>
          </div>
        </section>

        {/* VOICES OF EXCELLENCE (BENTO GRID) */}
        <section className="px-6 md:px-10 max-w-[1200px] mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-primary mb-6">Đánh giá xuất sắc</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Large Featured Testimonial (8 Cols) */}
            <div className="md:col-span-8 bg-white rounded-xl p-8 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl font-serif select-none pointer-events-none">“</div>
              <div className="w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border-4 border-white bg-slate-200">
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256" alt="Julian Chen" />
              </div>
              <div className="flex-grow">
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-xl">★</span>)}
                </div>
                <p className="text-base text-on-surface mb-6 italic leading-relaxed">
                  "Trước khi đến với MathMastery, em từng sợ hãi môn Đại số. Các thầy cô không chỉ đưa ra đáp án mà còn giúp em hiểu rõ bản chất logic đằng sau. Chỉ trong một học kỳ, điểm của em đã nhảy vọt từ D lên A-. Giờ đây em rất mong chờ đến giờ học Toán, điều mà trước đây em chưa từng nghĩ tới!"
                </p>
                <div>
                  <span className="block text-xl font-bold text-primary">Julian Chen</span>
                  <span className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mt-0.5">Học sinh lớp 11 • Los Angeles</span>
                </div>
              </div>
            </div>

            {/* Dark Side Testimonial (4 Cols) */}
            <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between shadow-lg">
              <div>
                <School className="text-on-primary-container size-10 mb-4" />
                <p className="text-sm leading-relaxed mb-6 opacity-95">
                  "Chương trình học được xây dựng cực kỳ bài bản và khoa học. Là một phụ huynh, việc nhìn thấy con gái lấy lại được sự tự tin của mình thực sự là điều vô giá."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-white/20">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128" alt="Sarah Williams" />
                </div>
                <div>
                  <span className="block text-sm font-bold">Sarah Williams</span>
                  <span className="block text-xs opacity-75 mt-0.5">Phụ huynh học sinh lớp 9</span>
                </div>
              </div>
            </div>

            {/* Bottom Card 1 */}
            <div className="md:col-span-4 bg-white rounded-xl p-6 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3 text-sm">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-sm text-on-surface leading-relaxed mb-6">
                  "Báo cáo tiến độ học tập chi tiết giúp tôi biết chính xác phần kiến thức nào mình còn yếu và cách mình cải thiện qua từng tuần học."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=128" alt="Marcus Thorne" />
                </div>
                <span className="text-sm font-medium text-primary">Marcus Thorne</span>
              </div>
            </div>

            {/* Bottom Card 2 */}
            <div className="md:col-span-4 bg-white rounded-xl p-6 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3 text-sm">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-sm text-on-surface leading-relaxed mb-6">
                  "Làm chủ hình học không gian từng là nỗi sợ lớn, nhưng bây giờ nó là phần học yêu thích của tôi nhờ các công cụ trực quan hóa tương tác tuyệt vời."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=128" alt="Elena Rodriguez" />
                </div>
                <span className="text-sm font-medium text-primary">Elena Rodriguez</span>
              </div>
            </div>

            {/* Bottom Card 3 */}
            <div className="md:col-span-4 bg-white rounded-xl p-6 border border-slate-100 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3 text-sm">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-sm text-on-surface leading-relaxed mb-6">
                  "Hiệu quả, rõ ràng và vô cùng chuyên nghiệp. Các giáo viên tại đây thực sự quan tâm sát sao đến sự tiến bộ lâu dài của học viên."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128" alt="Dr. David Miller" />
                </div>
                <span className="text-sm font-medium text-primary">Tiến sĩ David Miller</span>
              </div>
            </div>

          </div>
        </section>

        {/* VISUALIZING TRANSFORMATION (BEFORE & AFTER PROGRESS BARS) */}
        <section className="bg-surface-container py-12 px-6 md:px-10 border-y border-slate-200">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-primary">Trực quan hóa sự thay đổi</h2>
              <p className="text-sm text-on-surface-variant max-w-2xl mx-auto mt-2">Chúng tôi ghi nhận từng cột mốc. Dưới đây là dữ liệu thực tế về chu kỳ cải thiện điểm số của học sinh trong suốt quá trình học tập.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Progress Card 1: SAT Math */}
              <div className="bg-white p-8 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-primary">Luyện thi Toán SAT</h4>
                    <p className="text-xs font-mono text-on-surface-variant tracking-wide mt-0.5">Mã số học viên: #MM-4029</p>
                  </div>
                  <span className="px-4 py-1 bg-tertiary-container/10 text-tertiary rounded-full text-xs font-semibold">Đã hoàn thành</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-on-surface-variant">Đánh giá đầu vào (Tuần 1)</span>
                      <span className="text-xl font-bold text-on-surface">520</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-outline rounded-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-primary font-semibold">Thi thử đầu ra (Tuần 12)</span>
                      <span className="text-xl font-bold text-tertiary">780</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-container rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-container-highest flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-primary-container/5 text-primary rounded-lg text-xs font-medium">Làm chủ Đại số</span>
                  <span className="px-3 py-1 bg-primary-container/5 text-primary rounded-lg text-xs font-medium">Phân tích Dữ liệu</span>
                  <span className="px-3 py-1 bg-primary-container/5 text-primary rounded-lg text-xs font-medium">Toán học Cao cấp</span>
                </div>
              </div>

              {/* Progress Card 2: AP Calculus */}
              <div className="bg-white p-8 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-primary">Giải tích AP Calculus AB</h4>
                    <p className="text-xs font-mono text-on-surface-variant tracking-wide mt-0.5">Mã số học viên: #MM-5112</p>
                  </div>
                  <span className="px-4 py-1 bg-tertiary-container/10 text-tertiary rounded-full text-xs font-semibold">Đã hoàn thành</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-on-surface-variant">Bài kiểm tra chẩn đoán đầu vào</span>
                      <span className="text-xl font-bold text-on-surface">C- (71%)</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-outline rounded-full" style={{ width: '71%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm text-primary font-semibold">Điểm kiểm tra định kỳ cuối khóa</span>
                      <span className="text-xl font-bold text-tertiary">A (96%)</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-container rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-container-highest flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-primary-container/5 text-primary rounded-lg text-xs font-medium">Đạo hàm</span>
                  <span className="px-3 py-1 bg-primary-container/5 text-primary rounded-lg text-xs font-medium">Tích phân</span>
                  <span className="px-3 py-1 bg-primary-container/5 text-primary rounded-lg text-xs font-medium">Giới hạn</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-16 px-6 text-center max-w-[1200px] mx-auto relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Câu chuyện thành công của bạn bắt đầu từ hôm nay.</h2>
          <p className="text-base text-on-surface-variant mb-8 max-w-xl mx-auto">Tham gia cùng hàng ngàn học sinh đã làm chủ môn toán với sự tự tin và chính xác tuyệt đối.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-secondary text-white px-10 py-3.5 rounded-lg text-base font-semibold shadow-md hover:bg-on-secondary-container transition-all active:scale-95 w-full sm:w-auto">
              Tham gia lớp học
            </button>
            <button className="bg-white text-primary border-2 border-primary px-10 py-3.5 rounded-lg text-base font-semibold hover:bg-primary/5 transition-all w-full sm:w-auto">
              Đặt lịch đánh giá miễn phí
            </button>
          </div>
        </section>

      </main>
    </div>
  )
}
