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
import NavLinks from '../components/NavLinks'
import { ROUTES } from '@/lib/routes'

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
  const { siteTitle, logoUrl, navigation, announcementText, announcementUrl, header } = settings
  const navItems = navigation?.items ?? []
  const showNav = header?.showNav !== false
  const showLogo = header?.showLogo !== false

  return (
    <div className="min-h-screen flex flex-col bg-mist-100 dark:bg-mist-950">
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
          showNav ? (
            <NavLinks items={navItems} />
          ) : null
        }
        logo={
          showLogo ? (
            <NavbarLogo href="/">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteTitle}
                  className="h-7 w-auto"
                  width={85}
                  height={85}
                />
              ) : (
                <span
                  className="text-3xl font-bold tracking-normal light:text-primary text-mist-950 dark:text-white"
                  style={{ fontFamily: "'Instrument Serif', serif", color: 'var(--primary)' }}
                >
                  {siteTitle}
                </span>
              )}
            </NavbarLogo>
          ) : null
        }
        actions={
          <>
            <PlainButtonLink href={ROUTES.POSTS} className="max-sm:hidden">
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
