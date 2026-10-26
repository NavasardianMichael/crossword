import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { ContentPage } from '@components/marketing/ContentPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.rules, title: t('rulesTitle'), description: t('rulesDescription') })
}

export default function RulesPage() {
  return <ContentPage namespace='Rules' path={ROUTES.rules} navKey='rules' schema='howTo' />
}
