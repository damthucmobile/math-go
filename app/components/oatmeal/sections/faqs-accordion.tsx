'use client'

import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import { useId, useState } from 'react'
import { Subheading } from '@/app/components/oatmeal/elements/subheading'
import { Text } from '@/app/components/oatmeal/elements/text'
import { MinusIcon } from '@/app/components/oatmeal/icons/minus-icon'
import { PlusIcon } from '@/app/components/oatmeal/icons/plus-icon'

export function Faq({
  id: idProp,
  question,
  answer,
  ...props
}: { question: ReactNode; answer: ReactNode } & ComponentProps<'div'>) {
  const autoId = useId()
  const id = idProp || autoId
  const [open, setOpen] = useState(false)

  return (
    <div id={id} {...props}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-answer`}
        id={`${id}-question`}
        className="flex w-full items-start justify-between gap-6 rounded-lg py-4 text-left text-base/7 text-mist-950 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mist-500 focus-visible:ring-offset-2"
      >
        {question}
        {open ? <MinusIcon className="size-4 shrink-0" /> : <PlusIcon className="size-4 shrink-0" />}
      </button>
      <div
        id={`${id}-answer`}
        role="region"
        aria-labelledby={`${id}-question`}
        hidden={!open}
        className={clsx(
          '-mt-2 flex flex-col gap-2 pr-12 pb-4 text-sm/7 text-mist-700 dark:text-mist-400',
          !open && 'hidden',
        )}
      >
        {answer}
      </div>
    </div>
  )
}

export function FAQsAccordion({
  headline,
  subheadline,
  className,
  children,
  ...props
}: {
  headline?: ReactNode
  subheadline?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 lg:max-w-5xl lg:px-10">
        <div className="flex flex-col gap-6">
          <Subheading>{headline}</Subheading>
          {subheadline && <Text className="flex flex-col gap-4 text-pretty">{subheadline}</Text>}
        </div>
        <div className="divide-y divide-mist-950/10 border-y border-mist-950/10 dark:divide-white/10 dark:border-white/10">
          {children}
        </div>
      </div>
    </section>
  )
}
