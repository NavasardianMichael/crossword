import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { CreditsView } from '@components/billing/CreditsView'
import { PageHeader } from '@components/ui/layout/PageHeader'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.credits, title: t('creditsTitle'), description: t('creditsDescription') })
}

export default async function CreditsPage() {
  const t = await getTranslations('Credits')
  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <div className='container-page max-w-4xl pb-12'>
        <CreditsView />
      </div>
    </>
  )
}
