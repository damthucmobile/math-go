import { Section } from '@/app/components/oatmeal/elements/section'
import { Container } from '@/app/components/oatmeal/elements/container'
import { AdminButtonLink } from '@/app/components/admin/AdminButtons'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-mist-100 dark:bg-mist-950 flex flex-col items-center justify-center">
      <Section className="py-16 flex-1 flex flex-col justify-center">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-2xl font-bold text-mist-950 dark:text-white font-display">Page not found</h1>
          <p className="text-mist-600 dark:text-mist-400 max-w-md">
            The page you’re looking for doesn’t exist or may have been moved. Head back home to find what you need.
          </p>
          <AdminButtonLink href="/" variant="primary">
            Go to home
          </AdminButtonLink>
        </Container>
      </Section>
    </main>
  )
}
