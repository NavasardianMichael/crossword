import { getFormatter, getTranslations } from 'next-intl/server'
import { currentLocale } from '@i18n/metadata'
import { CONTENT_UPDATED_AT, LEGAL_UPDATED_AT } from '@constants/legal'
import { ROUTES } from '@constants/routes'
import { aboutPageSchema, breadcrumbSchema, howToSchema, webPageSchema } from '@linkedDataSchema/index'
import { JsonLd } from '@components/seo/JsonLd'
import { PageHeader } from '@components/ui/layout/PageHeader'
import { Prose } from '@components/ui/layout/Prose'

/**
 * A long-form page (rules, about, privacy, terms) from its catalogue namespace: `title`,
 * `subtitle` and `sections` — an array of `{ title, paragraphs }`, so each language can use
 * as many paragraphs as it needs. Its JSON-LD is built from the same copy: a breadcrumb, and
 * the page as `schema` says — a HowTo (each section a step), an AboutPage or a plain WebPage.
 */
type Section = { title: string; paragraphs: string[] }

type ContentPageProps = {
  namespace: string
  /** Locale-free route path, for the breadcrumb and the page URL. */
  path: string
  /** `Nav` key naming the page in the breadcrumb. */
  navKey: string
  schema?: 'page' | 'about' | 'howTo'
  legal?: boolean
}

export const ContentPage = async ({ namespace, path, navKey, schema = 'page', legal = false }: ContentPageProps) => {
  const locale = await currentLocale()
  const t = await getTranslations(namespace)
  const common = await getTranslations('Common')
  const nav = await getTranslations('Nav')
  const format = await getFormatter()
  const sections = t.raw('sections') as Section[]

  const page = {
    locale,
    name: t('title'),
    description: t('subtitle'),
    path,
    dateModified: legal ? LEGAL_UPDATED_AT : CONTENT_UPDATED_AT,
  }
  const pageSchema =
    schema === 'howTo'
      ? howToSchema(
          page,
          sections.map(({ title, paragraphs }) => ({ title, text: paragraphs.join(' ') }))
        )
      : schema === 'about'
        ? aboutPageSchema(page)
        : webPageSchema(page)

  return (
    <>
      <JsonLd data={pageSchema} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav(navKey), path },
        ])}
      />
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
