import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { FormatPage } from '@components/marketing/FormatPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.scanword, title: t('scanwordTitle'), description: t('scanwordDescription') })
}

export default async function ScanwordPage() {
  return <FormatPage format='scanword' locale={await currentLocale()} />
}
