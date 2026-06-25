import type { Metadata } from 'next'
import { listRecordsAsync } from '@/lib/cms'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import { LinkEl } from '@/app/components/oatmeal/elements/link'

export const metadata: Metadata = {
  title: 'Pages',
  description: 'Explore services, how I work, and how to get in touch.',
}

export default async function PagesListPage() {
  const pages = (await listRecordsAsync('pages')) as { id: number; slug: string; title: string; body?: string }[]

  return (
    <div className="bg-mist-100 dark:bg-mist-950">
      <Section className="border-b border-mist-200/60 bg-mist-50 dark:border-mist-800/60 dark:bg-mist-900/30 py-12 sm:py-16" aria-labelledby="pages-heading">
        <Container>
          <Subheading id="pages-heading">Pages</Subheading>
          <Text size="lg" className="mt-2 max-w-2xl text-pretty">
            Explore services, how I work, and how to get in touch.
          </Text>
          {pages.length > 0 ? (
            <ul className="mt-10 divide-y divide-mist-200 dark:divide-mist-700" role="list">
              {pages.map((page) => (
                <li key={page.id} className="py-6 first:pt-0">
                  <LinkEl
                    href={`/pages/${page.slug}`}
                    className="block text-xl font-semibold underline-offset-4 hover:underline"
                  >
                    {page.title}
                  </LinkEl>
                </li>
              ))}
            </ul>
          ) : (
            <Text size="md" className="mt-8">
              No pages published yet.
            </Text>
          )}
        </Container>
      </Section>
    </div>
  )
}
