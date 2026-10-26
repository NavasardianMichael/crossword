import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { APP_NAME } from '@constants/app'
import { ROUTES } from '@constants/routes'
import { CREAM } from '@styles/tokens'

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Stable identity: changing the landing page must not install a second copy.
    id: '/',
    name: APP_NAME,
    short_name: 'Crossword',
    description: 'Free AI crosswords and scanwords in English, Russian and Armenian — new words every game.',
    lang: DEFAULT_LOCALE,
    dir: 'ltr',
    // localePrefix is 'always', so '/' is a redirect; a start_url that redirects can loop.
    start_url: localePath(DEFAULT_LOCALE, ROUTES.home),
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui', 'browser'],
    orientation: 'any',
    launch_handler: { client_mode: ['navigate-existing', 'auto'] },
    background_color: CREAM[100],
    theme_color: CREAM[100],
    categories: ['games', 'entertainment', 'education'],
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Crossword', url: localePath(DEFAULT_LOCALE, ROUTES.crossword), icons: [{ src: '/icon', sizes: '512x512' }] },
      { name: 'Scanword', url: localePath(DEFAULT_LOCALE, ROUTES.scanword), icons: [{ src: '/icon', sizes: '512x512' }] },
    ],
  }
}
