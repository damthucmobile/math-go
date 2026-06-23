import type { Metadata } from 'next'
import { listRecordsAsync } from '@/lib/cms'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import { LinkEl } from '@/app/components/oatmeal/elements/link'

export const metadata: Metadata = {
  title: 'Insights & Articles',
  description: 'Practical ideas on conversion-first design, eCommerce performance, and storefront development.',
}

export default async function PostsListPage() {
  const posts = (await listRecordsAsync('posts')) as { id: number; title: string; excerpt?: string; content?: string }[]

  return (
    <div className="bg-mist-100 dark:bg-mist-950">
      <nav
        className="border-b border-mist-200/60 bg-mist-50/80 py-3 dark:border-mist-800/60 dark:bg-mist-900/30"
        aria-label="Breadcrumb"
      >
        <Container>
          <ol className="flex items-center gap-2 text-sm list-none" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <LinkEl href="/" itemProp="item">← Home</LinkEl>
            </li>
            <li aria-hidden className="text-mist-400 dark:text-mist-600">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page">
              <span itemProp="name" className="text-mist-500 dark:text-mist-400">Posts</span>
            </li>
          </ol>
        </Container>
      </nav>

      <Section className="border-b border-mist-200/60 bg-mist-50 dark:border-mist-800/60 dark:bg-mist-900/30 py-12 sm:py-16" aria-labelledby="posts-heading">
        <Container>
          <Subheading id="posts-heading">Insights &amp; Articles</Subheading>
          <Text size="lg" className="mt-2 max-w-2xl text-pretty">
            Practical ideas on conversion-first design, eCommerce performance, and storefront development.
          </Text>
          {posts.length > 0 ? (
            <ul className="mt-10 divide-y divide-mist-200 dark:divide-mist-700" role="list">
              {posts.map((post) => (
                <li key={post.id} className="py-6 first:pt-0">
                  <LinkEl
                    href={`/posts/${post.id}`}
                    className="block text-xl font-semibold underline-offset-4 hover:underline"
                  >
                    {post.title}
                  </LinkEl>
                  {post.excerpt && (
                    <Text size="md" className="mt-1 line-clamp-2">
                      {post.excerpt}
                    </Text>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <Text size="md" className="mt-8">
              No articles yet. Check back soon for insights on eCommerce, conversion, and storefront development.
            </Text>
          )}
        </Container>
      </Section>
    </div>
  )
}
