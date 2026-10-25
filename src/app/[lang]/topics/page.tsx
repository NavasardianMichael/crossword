import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { TopicGrid } from '@components/marketing/TopicGrid'
import { PageHeader } from '@components/ui/layout/PageHeader'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.topics, title: t('topicsTitle'), description: t('topicsDescription') })
}

export default async function TopicsPage() {
  const t = await getTranslations('TopicsPage')
  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      <div className='container-page pb-12'>
        <TopicGrid withDescriptions />
      </div>
    </>
  )
}
