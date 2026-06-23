import type { SiteSettings } from '@/lib/settings'
import { getSafeHref } from '@/lib/url-utils'
import { sanitizeHtmlSnippet } from '@/lib/sanitize'
import {
  FooterWithLinksAndSocialIcons,
  FooterLinkSimple,
} from '@/app/components/oatmeal/sections/footer-with-links-and-social-icons'
import { Text } from '@/app/components/oatmeal/elements/text'

interface SiteFooterProps {
  settings: SiteSettings
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const { footer, navigation } = settings
  const year = new Date().getFullYear()
  const copyrightText =
    footer.showCopyright && footer.copyrightText
      ? footer.copyrightText.replace(/\{year\}/g, String(year))
      : footer.showCopyright && settings.siteTitle
        ? `© ${year} ${settings.siteTitle}`
        : ''

  const navItems = navigation?.items ?? []
  const links = navItems.length > 0 ? (
    <>
      {navItems.map((item, i) => (
        <FooterLinkSimple key={i} href={getSafeHref(item.url) || '#'}>
          {item.label}
        </FooterLinkSimple>
      ))}
    </>
  ) : (
    <FooterLinkSimple href="/">Home</FooterLinkSimple>
  )

  const fineprint = (
    <>
      {footer.text && (
        <div
          className="prose prose-sm max-w-none text-mist-600 dark:text-mist-500 [&_a]:text-mist-950 dark:[&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline"
          dangerouslySetInnerHTML={{ __html: sanitizeHtmlSnippet(footer.text) }}
        />
      )}
      {copyrightText && (
        <Text size="md" className="mt-2 text-mist-600 dark:text-mist-500">
          {copyrightText}
        </Text>
      )}
    </>
  )

  return (
    <FooterWithLinksAndSocialIcons
      className="mt-auto border-t border-mist-200/80 dark:border-mist-800/50"
      role="contentinfo"
      links={links}
      fineprint={fineprint}
    />
  )
}
