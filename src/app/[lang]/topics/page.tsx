import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { CONTENT_UPDATED_AT } from '@constants/legal'
import { TOPICS } from '@constants/puzzle'
import { ROUTES, topicPath } from '@constants/routes'
import { breadcrumbSchema, collectionPageSchema } from '@linkedDataSchema/index'
import { TopicGrid } from '@components/marketing/TopicGrid'
import { JsonLd } from '@components/seo/JsonLd'
import { PageHeader } from '@components/ui/layout/PageHeader'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.topics, title: t('topicsTitle'), description: t('topicsDescription') })
}

export default async function TopicsPage() {
  const locale = await currentLocale()
  const t = await getTranslations('TopicsPage')
  const topics = await getTranslations('Topics')
  const nav = await getTranslations('Nav')
  return (
    <>
      <JsonLd
        data={collectionPageSchema(
          {
            locale,
            name: t('title'),
            description: t('subtitle'),
            path: ROUTES.topics,
            dateModified: CONTENT_UPDATED_AT,
          },
          TOPICS.map((topic) => ({ name: topics(`${topic}.name`), path: topicPath(topic) }))
        )}
      />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav('home'), path: ROUTES.home },
          { name: nav('topics'), path: ROUTES.topics },
        ])}
      />
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <div className='container-page pb-12'>
        <TopicGrid withDescriptions />
      </div>
    </>
  )
}
