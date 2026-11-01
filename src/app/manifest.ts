import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { APP_NAME } from '@constants/app'
import { SCREENSHOT_SIZES, type ScreenshotFormFactor, screenshotPath, SCREENSHOTS } from '@constants/pwa'
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
      { src: '/icon-192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Chrome's richer install sheet: `narrow` on phones, `wide` on desktop. Regenerate with `pnpm screenshots`.
    screenshots: [
      ...SCREENSHOTS.map(({ name, label }) => screenshot('narrow', name, label)),
      ...SCREENSHOTS.map(({ name, label }) => screenshot('wide', name, label)),
    ],
    shortcuts: [
      {
        name: 'Crossword',
        description: 'Start a new crossword',
        url: localePath(DEFAULT_LOCALE, ROUTES.crossword),
        icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Scanword',
        description: 'Start a new scanword',
        url: localePath(DEFAULT_LOCALE, ROUTES.scanword),
        icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
      },
    ],
  }
}

const screenshot = (formFactor: ScreenshotFormFactor, name: string, label: string) => ({
  src: screenshotPath(formFactor, name),
  sizes: SCREENSHOT_SIZES[formFactor],
  type: 'image/png',
  form_factor: formFactor,
  label,
})
