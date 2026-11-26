import { defineRouting } from 'next-intl/routing'
import { DEFAULT_LOCALE, LOCALES } from './config'

/**
 * The locale lives in the path — `/en/play`, `/hy/play` — so every language is a distinct,
 * crawlable URL with its own metadata and JSON-LD.
 *
 * `localeDetection` is off on purpose; `src/proxy.ts` negotiates instead, because
 * next-intl's built-in matcher lets an exact match on a lower-preference tag beat a
 * best-fit match on a higher one (`pt-PT,en;q=0.9` → `en` rather than `pt-BR`).
 *
 * `alternateLinks` is off: `pageMetadata()` already writes each page's hreflang set into its
 * head, and the middleware's `Link` header named every language at the same path — wrong for
 * guides, whose slugs differ per language, and over 3 KB, which pushed long guide URLs past
 * nginx's 4 KB header buffer (a 502).
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: false,
  alternateLinks: false,
})
