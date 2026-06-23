import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '@/app/components/oatmeal/elements/container'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'

export function CallToActionSimpleCentered({
  headline,
  subheadline,
  cta,
  className,
  ...props
}: {
  headline: ReactNode
  subheadline?: ReactNode
  cta?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className="flex flex-col items-center gap-10">
        <div className="flex flex-col gap-6">
          <Subheading className="max-w-4xl text-center">{headline}</Subheading>
          {subheadline != null && (
            <Text className="flex max-w-3xl flex-col gap-4 text-center text-pretty">{subheadline}</Text>
          )}
        </div>
        {cta}
      </Container>
    </section>
  )
}
