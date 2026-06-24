import Link from 'next/link'
import type { SiteSettings } from '@/lib/settings'
import { getSafeHref } from '@/lib/url-utils'
import { sanitizeHtmlSnippet } from '@/lib/sanitize'
import { Container } from './oatmeal/elements'

interface SiteFooterProps {
  settings: SiteSettings
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const { footer, navigation, siteTitle } = settings
  const year = new Date().getFullYear()
  const copyrightText =
    footer.showCopyright && footer.copyrightText
      ? footer.copyrightText.replace(/\{year\}/g, String(year))
      : footer.showCopyright && siteTitle
        ? `© ${year} ${siteTitle}`
        : ''

  const subText = footer.text

  return (
    <footer className="bg-white py-12 border-t border-slate-200 text-xs text-slate-500 w-full mt-auto">
        <Container className="max-w-5xl grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          
          <div className="space-y-3 lg:col-span-5">
            <p className="text-base font-bold text-[#0b2f5d] tracking-tight">MathGo</p>
            <p className="leading-relaxed max-w-sm text-slate-400 text-[11px]">
              {subText}
            </p>
          </div>
          
          <div className="lg:col-span-2 space-y-3">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Trung tâm</p>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-slate-800 transition text-slate-400 underline underline-offset-2">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-slate-800 transition text-slate-400 underline underline-offset-2">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Tài nguyên</p>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-slate-800 transition text-slate-400 underline underline-offset-2">Câu hỏi thường gặp (FAQ)</a></li>
              <li><a href="#" className="hover:text-slate-800 transition text-slate-400 underline underline-offset-2">Blog</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Mạng xã hội</p>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-slate-800 transition text-slate-400 underline underline-offset-2">LinkedIn</a></li>
              <li><a href="#" className="hover:text-slate-800 transition text-slate-400 underline underline-offset-2">Twitter</a></li>
            </ul>
          </div>

        </Container>
        
        <div className="max-w-5xl mx-auto px-4 mt-8 pt-4 border-t border-slate-100 flex flex-wrap justify-between gap-4 text-[10px] text-slate-400">
          <p>{copyrightText}</p>
        </div>
      </footer>
  )
}
