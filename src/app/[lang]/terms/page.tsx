import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { ContentPage } from '@components/marketing/ContentPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.terms, title: t('termsTitle'), description: t('termsDescription') })
}

export default function TermsPage() {
  return <ContentPage namespace='Terms' path={ROUTES.terms} navKey='terms' legal />
}
