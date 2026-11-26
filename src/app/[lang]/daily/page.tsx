import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { ROUTES } from '@constants/routes'
import { fetchDaily } from '@helpers/serverData'
import { DailyPage } from '@components/daily/DailyPage'

/** The puzzle changes at 00:00 UTC: re-read every ten minutes, so a new day shows within minutes. */
export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({ path: ROUTES.daily, title: t('dailyTitle'), description: t('dailyDescription') })
}

export default async function Daily() {
  const locale = await currentLocale()
  return <DailyPage locale={locale} daily={await fetchDaily(locale)} />
}
