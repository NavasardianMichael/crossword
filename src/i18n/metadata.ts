import type { Metadata } from 'next'
import { lang } from 'next/root-params'
import { DEFAULT_LOCALE, isLocale, type Locale, LOCALES, OG_LOCALES } from './config'
import { localePath } from './pathname'

/** The locale of the page being rendered, from the `[lang]` root segment. */
export const currentLocale = async (): Promise<Locale> => {
  const segment = await lang()
  return isLocale(segment) ? segment : DEFAULT_LOCALE
}

/**
 * `alternates` for a page, given its **locale-free** path.
 *
 * Every locale variant is self-canonical — `/es/play` canonicals to itself, not to
 * `/en/play`. Pointing every locale at one canonical would tell Google the others are
 * duplicates and deindex them. `hreflang` is what says "same page, other language".
 * Paths stay root-relative; `metadataBase` in the root layout makes them absolute.
 */
export const localizedAlternates = async (path: string): Promise<Metadata['alternates']> => {
  const locale = await currentLocale()
  const languages = Object.fromEntries(LOCALES.map((each) => [each, localePath(each, path)]))

  return {
    canonical: localePath(locale, path),
    languages: { ...languages, 'x-default': localePath(DEFAULT_LOCALE, path) },
  }
}

type PageMetadataInput = {
  /** Locale-free route path. */
  path: string
  title: string
  description: string
  /** Private pages (profile, settings) stay out of the index. */
  noIndex?: boolean
}

/** The one builder every page's `generateMetadata` goes through: title, description, alternates, OpenGraph. */
export const pageMetadata = async ({ path, title, description, noIndex }: PageMetadataInput): Promise<Metadata> => {
  const locale = await currentLocale()
  return {
    title,
    description,
    alternates: await localizedAlternates(path),
    openGraph: {
      title,
      description,
      url: localePath(locale, path),
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((each) => each !== locale).map((each) => OG_LOCALES[each]),
    },
    twitter: { card: 'summary_large_image', title, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
