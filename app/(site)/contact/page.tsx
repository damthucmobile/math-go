import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import { ButtonLink, PlainButtonLink } from '@/app/components/oatmeal/elements/button'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Mail, Phone, MapPin } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `Contact | ${settings.siteTitle}`,
    description: settings.tagline || 'Liên hệ với MathGo để nhận tư vấn học tập.',
  }
}

export default function ContactPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="bg-[#0b2f5d] py-24 text-white">
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            Liên hệ MathGo
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Gửi thông tin liên hệ, đặt câu hỏi về lộ trình học, gia sư hoặc khóa đào tạo. Đội ngũ tư vấn sẽ phản hồi trong vòng 24h.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href="mailto:contact@MathGo.edu.vn"
              className="rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
            >
              Gửi email ngay
            </ButtonLink>
            <PlainButtonLink
              href="/"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Quay lại trang chủ
            </PlainButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-500">
                  Form liên hệ
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  Hãy để chúng tôi giúp bạn bắt đầu
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Nhập thông tin cơ bản, và chúng tôi sẽ liên hệ bạn sớm nhất có thể.
                </p>
              </div>

              <form className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span>Họ và tên</span>
                    <input
                      type="text"
                      placeholder="Nhập họ tên"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span>Số điện thoại</span>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-700">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span>Lời nhắn</span>
                  <textarea
                    rows={5}
                    placeholder="Mô tả yêu cầu của bạn"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#0b2f5d] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-[#0a294f]"
                >
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                Thông tin liên hệ
              </p>
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3 text-slate-900">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <p className="text-sm">Hà Nội, Việt Nam</p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-slate-900">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <p className="text-sm">0123 456 789</p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-slate-900">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <p className="text-sm">contact@MathGo.edu.vn</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">
                Giờ làm việc
              </p>
              <p className="text-sm text-slate-700">Thứ 2 - Thứ 7: 08:00 - 20:00</p>
              <p className="text-sm text-slate-700">Chủ nhật: Nghỉ</p>
            </div>

            <div className="space-y-3 rounded-2xl bg-[#0b2f5d] p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Gặp ngay chuyên viên</p>
              <p className="text-sm leading-6 text-slate-100">
                Bạn có thể gọi ngay hoặc gửi email để nhận tư vấn cá nhân hoá ngay hôm nay.
              </p>
              <ButtonLink
                href="mailto:contact@MathGo.edu.vn"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Email ngay
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>
    </main>
  )
}
