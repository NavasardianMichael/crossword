import { getTranslations } from 'next-intl/server'
import { faqSchema } from '@linkedDataSchema/index'
import { JsonLd } from '@components/seo/JsonLd'
import { FaqAccordion } from './FaqAccordion'

/**
 * Copy and JSON-LD resolved on the server; the accordion is a small client island. Questions
 * live as `faq<N>Question` / `faq<N>Answer` pairs in the given namespace.
 */
export const FaqSection = async ({ namespace, count }: { namespace: string; count: number }) => {
  const t = await getTranslations(namespace)
  const items = Array.from({ length: count }, (_, index) => ({
    question: t(`faq${index + 1}Question`),
    answer: t(`faq${index + 1}Answer`),
  }))

  return (
    <>
      <JsonLd data={faqSchema(items)} />
      <FaqAccordion items={items} />
    </>
  )
}
