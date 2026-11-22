import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { CONTENT_UPDATED_AT } from '@constants/legal'
import { ROUTES } from '@constants/routes'
import { breadcrumbSchema, webPageSchema } from '@linkedDataSchema/index'
import { CreditsView } from '@components/billing/CreditsView'
import { JsonLd } from '@components/seo/JsonLd'
import { PageHeader } from '@components/ui/layout/PageHeader'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.credits, title: t('creditsTitle'), description: t('creditsDescription') })
}

/** Indexed: "is it free, what does it cost" is one of the first things people and AI assistants ask. */
export default async function CreditsPage() {
  const locale = await currentLocale()
  const t = await getTranslations('Credits')
  const nav = await getTranslations('Nav')
  return (
    <>
      <JsonLd
        data={webPageSchema({
          locale,
          name: t('title'),
          description: t('subtitle'),
          path: ROUTES.credits,
          dateModified: CONTENT_UPDATED_AT,
        })}
      />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('credits'), path: ROUTES.credits },
        ])}
      />
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className='container-page max-w-4xl pb-12'>
        <CreditsView />
      </div>
    </>
  )
}
