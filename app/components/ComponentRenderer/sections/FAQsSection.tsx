import type { JsonValue } from '@/types/json'
import { FAQsAccordion, Faq } from '@/app/components/oatmeal/sections/faqs-accordion'
import type { ComponentContextData } from '../types'

export function FAQsSection({
  context,
  blockData
}: { context: ComponentContextData; blockData?: Record<string, JsonValue> }) {
  const blockFaqs = blockData?.faqs as { question: string; answer: string }[] | undefined
  const faqs: { question: string; answer: string }[] = blockFaqs ?? context.sectionData?.faqs ?? []
  const headline = (blockData?.headline as string | undefined) ?? context.title ?? 'Frequently asked questions'
  if (faqs.length === 0) return null
  return (
    <FAQsAccordion
      className="bg-mist-100 dark:bg-mist-950/50"
      headline={headline}
      subheadline={null}
    >
      {faqs.map((faq, i) => (
        <Faq key={i} question={faq.question} answer={faq.answer} />
      ))}
    </FAQsAccordion>
  )
}
