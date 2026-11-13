import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE } from '@i18n/config'
import { APP_NAME } from '@constants/app'
import { buildManifest } from '@helpers/manifest'

/**
 * `/manifest.webmanifest`: the English one, for anything that asks for the conventional path.
 * Pages link their own language's (`/manifests/<locale>.webmanifest`, `[lang]/layout.tsx`).
 */
export default function manifest(): MetadataRoute.Manifest {
  return buildManifest(DEFAULT_LOCALE, {
    name: APP_NAME,
    description: 'AI crosswords and scanwords in your language — new words every game, the first puzzle each month free.',
  })
}
