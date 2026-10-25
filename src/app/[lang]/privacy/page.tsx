import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { ContentPage } from '@components/marketing/ContentPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.privacy, title: t('privacyTitle'), description: t('privacyDescription') })
}

export default function PrivacyPage() {
  return <ContentPage namespace='Privacy' legal />
}
