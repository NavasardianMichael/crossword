import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { CONTENT_UPDATED_AT } from '@constants/legal'
import { ROUTES } from '@constants/routes'
import { breadcrumbSchema, faqSchema } from '@linkedDataSchema/index'
import { FaqAccordion, type FaqItem } from '@components/marketing/FaqAccordion'
import { JsonLd } from '@components/seo/JsonLd'
import { ButtonLink } from '@components/ui/bare/AppLink'
import { PageHeader } from '@components/ui/layout/PageHeader'
import { Section } from '@components/ui/layout/Section'

/**
 * Every question in one place, grouped — the page answer engines quote. Groups come from the
 * catalogue as `groups: [{ title, items: [{ question, answer }] }]`, so each language phrases
 * and counts its own; one FAQPage block covers them all.
 */
type Group = { title: string; items: FaqItem[] }

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.faq, title: t('faqTitle'), description: t('faqDescription') })
}

export default async function FaqPage() {
  const locale = await currentLocale()
  const t = await getTranslations('Faq')
  const nav = await getTranslations('Nav')
  const groups = t.raw('groups') as Group[]

  return (
    <>
      <JsonLd
        data={faqSchema(
          groups.flatMap(({ items }) => items),
          { locale, name: t('title'), path: ROUTES.faq, dateModified: CONTENT_UPDATED_AT }
        )}
      />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('faq'), path: ROUTES.faq },
        ])}
      />
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {groups.map(({ title, items }, index) => (
        <Section key={title} id={`faq-${index + 1}`} title={title} align='center' className='py-8 sm:py-10'>
          <FaqAccordion items={items} />
        </Section>
      ))}

      <Section id='faq-more' title={t('ctaTitle')} subtitle={t('ctaText')} align='center'>
        <div className='flex flex-wrap justify-center gap-3'>
          <ButtonLink href={ROUTES.home} variant='primary'>
            {t('cta')}
          </ButtonLink>
          <ButtonLink href={ROUTES.rules} variant='outline'>
            {nav('rules')}
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
