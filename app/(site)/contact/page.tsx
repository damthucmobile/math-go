import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import { getRecordAsync } from '@/lib/cms'
import { ButtonLink, PlainButtonLink } from '@/app/components/oatmeal/elements/button'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from './contact-form'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `Contact | ${settings.siteTitle}`,
    description: settings.tagline || 'Liên hệ với MathGo để nhận tư vấn học tập.',
  }
}

export default async function ContactPage() {
  const contactData = (await getRecordAsync('contact')) ?? {}
  const title = typeof contactData.title === 'string' && contactData.title.trim() ? contactData.title : 'Chúng tôi luôn sẵn sàng hỗ trợ bạn'
  const subtitle = typeof contactData.subtitle === 'string' && contactData.subtitle.trim()
    ? contactData.subtitle
    : 'Gửi thông tin liên hệ, đặt câu hỏi về lộ trình học, gia sư hoặc khóa đào tạo. Đội ngũ tư vấn sẽ phản hồi trong vòng 24h.'
  const buttonLabel = typeof contactData.buttonLabel === 'string' && contactData.buttonLabel.trim()
    ? contactData.buttonLabel
    : 'Gửi email ngay'
  const buttonHref = typeof contactData.buttonHref === 'string' && contactData.buttonHref.trim()
    ? contactData.buttonHref
    : 'mailto:contact@MathGo.edu.vn'
  const formTitle = typeof contactData.formTitle === 'string' && contactData.formTitle.trim()
    ? contactData.formTitle
    : 'Hãy để chúng tôi giúp bạn bắt đầu'
  const formSubtitle = typeof contactData.formSubtitle === 'string' && contactData.formSubtitle.trim()
    ? contactData.formSubtitle
    : 'Nhập thông tin cơ bản, và chúng tôi sẽ liên hệ bạn sớm nhất có thể.'
  const email = typeof contactData.email === 'string' && contactData.email.trim() ? contactData.email : 'contact@MathGo.edu.vn'
  const phone = typeof contactData.phone === 'string' && contactData.phone.trim() ? contactData.phone : '0123 456 789'
  const address = typeof contactData.address === 'string' && contactData.address.trim() ? contactData.address : 'Hà Nội, Việt Nam'
  const workingHours = typeof contactData.workingHours === 'string' && contactData.workingHours.trim()
    ? contactData.workingHours
    : 'Thứ 2 - Thứ 7: 08:00 - 20:00\nChủ nhật: Nghỉ'
  const ctaTitle = typeof contactData.ctaTitle === 'string' && contactData.ctaTitle.trim() ? contactData.ctaTitle : 'Gặp ngay chuyên viên'
  const ctaDescription = typeof contactData.ctaDescription === 'string' && contactData.ctaDescription.trim()
    ? contactData.ctaDescription
    : 'Bạn có thể gọi ngay hoặc gửi email để nhận tư vấn cá nhân hoá ngay hôm nay.'
  const ctaButtonLabel = typeof contactData.ctaButtonLabel === 'string' && contactData.ctaButtonLabel.trim()
    ? contactData.ctaButtonLabel
    : 'Email ngay'
  const ctaButtonHref = typeof contactData.ctaButtonHref === 'string' && contactData.ctaButtonHref.trim()
    ? contactData.ctaButtonHref
    : 'mailto:contact@MathGo.edu.vn'
  const submitUrl = typeof contactData.submitUrl === 'string' && contactData.submitUrl.trim() ? contactData.submitUrl.trim() : ''
  const submitMethod = typeof contactData.submitMethod === 'string' && contactData.submitMethod.trim() ? contactData.submitMethod.trim().toUpperCase() : 'POST'
  const successMessage = typeof contactData.successMessage === 'string' && contactData.successMessage.trim()
    ? contactData.successMessage
    : 'Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm.'
  const errorMessage = typeof contactData.errorMessage === 'string' && contactData.errorMessage.trim()
    ? contactData.errorMessage
    : 'Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
  const hoursList = workingHours.split('\n').map((line) => line.trim()).filter(Boolean)

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="bg-[#0b2f5d] py-24 text-white">
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            Liên hệ MathGo
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href={buttonHref}
              className="rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
            >
              {buttonLabel}
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
                  {formTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {formSubtitle}
                </p>
              </div>

              <ContactForm
                formTitle={formTitle}
                formSubtitle={formSubtitle}
                submitUrl={submitUrl}
                submitMethod={submitMethod}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />
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
                  <p className="text-sm">{address}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-slate-900">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <p className="text-sm">{phone}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-slate-900">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <p className="text-sm">{email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">
                Giờ làm việc
              </p>
              {hoursList.map((line) => (
                <p key={line} className="text-sm text-slate-700">
                  {line}
                </p>
              ))}
            </div>

            <div className="space-y-3 rounded-2xl bg-[#0b2f5d] p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">{ctaTitle}</p>
              <p className="text-sm leading-6 text-slate-100">
                {ctaDescription}
              </p>
              <ButtonLink
                href={ctaButtonHref}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {ctaButtonLabel}
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>
    </main>
  )
}
