import type { MetadataRoute } from 'next'
import { getDirection, type Locale } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { APP_NAME } from '@constants/app'
import { SCREENSHOT_SIZES, type ScreenshotFormFactor, screenshotPath, SCREENSHOTS } from '@constants/pwa'
import { ROUTES } from '@constants/routes'
import { CREAM } from '@styles/tokens'

/** Launchers cut a longer home-screen label; the English brand fits. */
const SHORT_NAME_MAX = 12

export const manifestPath = (locale: Locale): string => `/manifests/${locale}.webmanifest`

/**
 * The web manifest for one language: an app installed from a Russian page opens in Russian.
 * `id` is the same for every language, so switching language never installs a second copy.
 * `start_url` is the language's home page, never `/` — `localePrefix` is 'always', so the
 * root is a redirect.
 */
export const buildManifest = (locale: Locale, copy: { name: string; description: string }): MetadataRoute.Manifest => ({
  id: '/',
  name: copy.name,
  short_name: copy.name.length <= SHORT_NAME_MAX ? copy.name : APP_NAME,
  description: copy.description,
  lang: locale,
  dir: getDirection(locale),
  start_url: localePath(locale, ROUTES.home),
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
      url: localePath(locale, ROUTES.crossword),
      icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
    },
    {
      name: 'Scanword',
      description: 'Start a new scanword',
      url: localePath(locale, ROUTES.scanword),
      icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
    },
  ],
})

const screenshot = (formFactor: ScreenshotFormFactor, name: string, label: string) => ({
  src: screenshotPath(formFactor, name),
  sizes: SCREENSHOT_SIZES[formFactor],
  type: 'image/png',
  form_factor: formFactor,
  label,
})
