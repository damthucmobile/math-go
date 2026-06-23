'use client'

import { useEffect } from 'react'
import { Section } from '@/app/components/oatmeal/elements/section'
import { Container } from '@/app/components/oatmeal/elements/container'
import { AdminButton, AdminButtonLink } from '@/app/components/admin/AdminButtons'

export default function RootError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-mist-100 dark:bg-mist-950 flex flex-col items-center justify-center" role="alert">
      <Section className="py-16 flex-1 flex flex-col justify-center">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h1 id="error-heading" className="text-xl font-semibold text-mist-950 dark:text-white font-display">
            Something went wrong
          </h1>
          <p id="error-message" className="max-w-md text-mist-600 dark:text-mist-400">
            An unexpected error occurred. You can try again or return to the home page.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <AdminButton
              onClick={reset}
              variant="primary"
              aria-describedby="error-message"
            >
              Try again
            </AdminButton>
            <AdminButtonLink href="/" variant="secondary">
              Go to home
            </AdminButtonLink>
          </div>
        </Container>
      </Section>
    </div>
  )
}
