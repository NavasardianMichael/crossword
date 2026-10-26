import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { pageMetadata } from '@i18n/metadata'
import { OfflinePlay } from '@components/puzzle/OfflinePlay'

/**
 * The play shell: a static page that opens a saved puzzle from the device by `?id=`. The
 * service worker precaches it per language and sends offline visits to an uncached puzzle
 * link here, so every puzzle the device received plays without a connection.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return pageMetadata({ path: '/play', title: t('Play.title'), description: t('Seo.puzzleDescription'), noIndex: true })
}

export default function PlayPage() {
  return <OfflinePlay />
}
