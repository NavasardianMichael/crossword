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

/** Arabic, Persian, Urdu and Hebrew read right to left. The grid mirrors with the page. */
const RTL = new Set<Locale>(['ar', 'fa', 'ur', 'he'])

export const getDirection = (locale: Locale): Direction => (RTL.has(locale) ? 'rtl' : 'ltr')

/**
 * Endonyms — each language named in itself, which is what a language switcher must show:
 * someone who cannot read the current UI language still has to find their own. Never
 * translate these.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  hy: 'Հայերեն',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  id: 'Bahasa Indonesia',
  mr: 'मराठी',
  it: 'Italiano',
  pl: 'Polski',
  vi: 'Tiếng Việt',
  uk: 'Українська',
  ar: 'العربية',
  hi: 'हिन्दी',
  ko: '한국어',
  bn: 'বাংলা',
  ja: '日本語',
  zh: '中文',
  fa: 'فارسی',
  nl: 'Nederlands',
  ro: 'Română',
  el: 'Ελληνικά',
  cs: 'Čeština',
  sv: 'Svenska',
  hu: 'Magyar',
  he: 'עברית',
  fil: 'Filipino',
  ms: 'Bahasa Melayu',
  ur: 'اردو',
  th: 'ไทย',
  ta: 'தமிழ்',
  sw: 'Kiswahili',
}

/** OpenGraph wants `ll_CC`. Filipino and Swahili have no antd bundle; the tag is still real. */
export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  hy: 'hy_AM',
  es: 'es_ES',
  pt: 'pt_BR',
  fr: 'fr_FR',
  de: 'de_DE',
  id: 'id_ID',
  mr: 'mr_IN',
  it: 'it_IT',
  pl: 'pl_PL',
  vi: 'vi_VN',
  uk: 'uk_UA',
  ar: 'ar_EG',
  hi: 'hi_IN',
  ko: 'ko_KR',
  bn: 'bn_BD',
  ja: 'ja_JP',
  zh: 'zh_CN',
  fa: 'fa_IR',
  nl: 'nl_NL',
  ro: 'ro_RO',
  el: 'el_GR',
  cs: 'cs_CZ',
  sv: 'sv_SE',
  hu: 'hu_HU',
  he: 'he_IL',
  fil: 'fil_PH',
  ms: 'ms_MY',
  ur: 'ur_PK',
  th: 'th_TH',
  ta: 'ta_IN',
  sw: 'sw_KE',
}
