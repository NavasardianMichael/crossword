import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { SavedGames } from '@components/history/SavedGames'
import { PageHeader } from '@components/ui/layout/PageHeader'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.history, title: t('historyTitle'), description: t('historyDescription'), noIndex: true })
}

export default async function HistoryPage() {
  const t = await getTranslations('History')
  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className='container-page pb-12'>
        <SavedGames emptyText={t('empty')} />
      </div>
    </>
  )
}
