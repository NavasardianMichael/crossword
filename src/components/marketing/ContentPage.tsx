import { getFormatter, getTranslations } from 'next-intl/server'
import { LEGAL_UPDATED_AT } from '@constants/legal'
import { PageHeader } from '@components/ui/layout/PageHeader'
import { Prose } from '@components/ui/layout/Prose'

/**
 * A long-form page (rules, about, privacy, terms) from its catalogue namespace: `title`,
 * `subtitle` and `sections` — an array of `{ title, paragraphs }`, so each language can use
 * as many paragraphs as it needs.
 */
type Section = { title: string; paragraphs: string[] }

export const ContentPage = async ({ namespace, legal = false }: { namespace: string; legal?: boolean }) => {
  const t = await getTranslations(namespace)
  const common = await getTranslations('Common')
  const format = await getFormatter()
  const sections = t.raw('sections') as Section[]

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <Prose>
        {legal && (
          <p className='text-body-sm text-ink-500'>
            {common('lastUpdated', { date: format.dateTime(LEGAL_UPDATED_AT, { dateStyle: 'long' }) })}
          </p>
        )}
        {sections.map(({ title, paragraphs }) => (
          <section key={title}>
            <h2>{title}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className='mt-3'>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </Prose>
    </>
  )
}
