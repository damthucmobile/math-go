import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'
import { getSafeHref } from '@/lib/url-utils'
import { sanitizeHtmlSnippet } from '@/lib/sanitize'
import { PlainButtonLink } from '@/app/components/oatmeal/elements/button'
import { Main } from '@/app/components/oatmeal/elements/main'
import { AnnouncementBadge } from '@/app/components/oatmeal/elements/announcement-badge'
import { SiteFooter } from '@/app/components/SiteFooter'
import {
  NavbarLink,
  NavbarLogo,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/app/components/oatmeal/sections/navbar-with-links-actions-and-centered-logo'

/** Static/cached at build; frontend shows new data after each deployment (triggered from admin on save). */
export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings.siteTitle,
    description: settings.tagline || undefined,
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const { siteTitle, logoUrl, navigation, announcementText, announcementUrl } = settings
  const navItems = navigation?.items ?? []

  return (
    <div className="min-h-screen flex flex-col bg-mist-100 dark:bg-mist-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-mist-950 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-mist-500 dark:focus:bg-white dark:focus:text-mist-950"
      >
        Skip to main content
      </a>
      {announcementText?.trim() && (
        <div className="border-b border-mist-200/50 dark:border-mist-800/50 bg-mist-50 dark:bg-mist-900/50">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 sm:px-6 lg:px-8">
            <AnnouncementBadge
              text={announcementText}
              href={getSafeHref(announcementUrl?.trim() || '#')}
              cta=""
              className="shrink-0"
            />
          </div>
        </div>
      )}
      <NavbarWithLinksActionsAndCenteredLogo
        id="navbar"
        links={
          <>
            {navItems.map((item, i) => (
              <NavbarLink key={i} href={getSafeHref(item.url) || '#'}>
                {item.label}
              </NavbarLink>
            ))}
          </>
        }
        logo={
          <NavbarLogo href="/">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteTitle}
                className="h-7 w-auto"
                width={85}
                height={28}
              />
            ) : (
              <span className="font-display text-xl font-semibold tracking-tight text-mist-950 dark:text-white">
                {siteTitle}
              </span>
            )}
          </NavbarLogo>
        }
        actions={
          <>
            <PlainButtonLink href="/posts" className="max-sm:hidden">
              Posts
            </PlainButtonLink>
            {settings.header?.customHtml?.trim() ? (
              <div
                className="max-sm:hidden [&_a]:text-mist-950 dark:[&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtmlSnippet(settings.header.customHtml ?? ''),
                }}
              />
            ) : null}
          </>
        }
      />

      <Main id="main" className="flex-1" tabIndex={-1}>{children}</Main>

      <SiteFooter settings={settings} />
    </div>
  )
}
