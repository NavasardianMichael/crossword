import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { guidePath, ROUTES } from '@constants/routes'
import { guidesFor, guideSubject } from '@content/index'
import { GUIDE_LOCALES, hasGuides } from '@content/locales'
import type { Guide } from '@content/types'
import { breadcrumbSchema, collectionPageSchema } from '@linkedDataSchema/index'
import { GuideCard } from '@components/content/GuideParts'
import { JsonLd } from '@components/seo/JsonLd'
import { PageHeader } from '@components/ui/layout/PageHeader'
import { Section } from '@components/ui/layout/Section'

/** Only the languages with guides have this page: the others 404 and stay out of the sitemap. */
const hubLanguages = () => Object.fromEntries(GUIDE_LOCALES.map((locale) => [locale, ROUTES.guides]))

export async function generateMetadata(): Promise<Metadata> {
  if (!hasGuides(await currentLocale())) return {}
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.guides, title: t('guidesTitle'), description: t('guidesDescription'), languages: hubLanguages() })
}

export default async function GuidesPage() {
  const locale = await currentLocale()
  if (!hasGuides(locale)) notFound()

  const t = await getTranslations('Content')
  const nav = await getTranslations('Nav')
  const guides = guidesFor(locale)
  // This language's own guides first, then its guides to puzzles in other languages.
  const isElsewhere = (guide: Guide) => {
    const subject = guideSubject(guide.key)
    return subject !== undefined && subject !== locale
  }
  const main = guides.filter((guide) => !isElsewhere(guide))
  const languages = guides.filter(isElsewhere)
  const updated = guides.reduce((latest, guide) => (guide.updated > latest ? guide.updated : latest), '')

  return (
    <>
      <JsonLd
        data={collectionPageSchema(
          { locale, name: t('hubTitle'), description: t('hubSubtitle'), path: ROUTES.guides, dateModified: new Date(`${updated}T12:00:00Z`) },
          guides.map((guide) => ({ name: guide.shortTitle, path: guidePath(guide.slug) }))
        )}
      />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('guides'), path: ROUTES.guides },
        ])}
      />
      <PageHeader title={t('hubTitle')} subtitle={t('hubSubtitle')} />
      <div className='container-page pb-6'>
        <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {main.map((guide) => (
            <li key={guide.slug}>
              <GuideCard locale={locale} guide={guide} headingLevel='h2' />
            </li>
          ))}
        </ul>
      </div>
      {languages.length > 0 && (
        <Section id='languages' title={t('languagesTitle')} subtitle={t('languagesSubtitle')}>
          <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {languages.map((guide) => (
              <li key={guide.slug}>
                <GuideCard locale={locale} guide={guide} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
