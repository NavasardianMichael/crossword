import type { Locale } from '@constants/puzzle'

/**
 * The UI languages are exactly the puzzle languages: an interface in a language with no word
 * pool would have nothing to offer, so `src/constants/puzzle.ts` owns the list.
 *
 * The locale is a path segment: every route lives under `app/[lang]/` and every URL names
 * its language, English included (`localePrefix: 'always'`). `src/proxy.ts` negotiates a
 * locale only for unprefixed traffic — `NEXT_LOCALE` cookie, then `Accept-Language`.
 */
export { isLocale, type Locale, LOCALES } from '@constants/puzzle'

export const DEFAULT_LOCALE: Locale = 'en'

/** The cookie an explicit switcher choice writes. Read by `src/proxy.ts`. */
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export type Direction = 'ltr' | 'rtl'

/** All three languages read left to right; kept so `<html dir>` stays explicit when an RTL one joins. */
export const getDirection = (_locale: Locale): Direction => 'ltr'

/**
 * Endonyms — each language named in itself, which is what a language switcher must show:
 * someone who cannot read the current UI language still has to find their own. Never
 * translate these.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  hy: 'Հայերեն',
}

/** OpenGraph wants `ll_CC`. */
export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  hy: 'hy_AM',
}
