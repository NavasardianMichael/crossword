import type { Metadata } from 'next'
import { lang } from 'next/root-params'
import { getTranslations } from 'next-intl/server'
import { OG_IMAGE_SIZE, ogImagePath } from '@constants/app'
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
export const localizedAlternates = async (
  path: string,
  paths: Partial<Record<Locale, string>> = Object.fromEntries(LOCALES.map((each) => [each, path]))
): Promise<Metadata['alternates']> => {
  const locale = await currentLocale()
  const languages = Object.fromEntries((Object.entries(paths) as [Locale, string][]).map(([each, own]) => [each, localePath(each, own)]))
  const fallback = paths[DEFAULT_LOCALE]

  return {
    canonical: localePath(locale, path),
    languages: { ...languages, ...(fallback ? { 'x-default': localePath(DEFAULT_LOCALE, fallback) } : {}) },
  }
}

type PageMetadataInput = {
  /** Locale-free route path. */
  path: string
  title: string
  description: string
  /** Private pages (profile, settings) stay out of the index. */
  noIndex?: boolean
  /** The title is complete already: skip the layout's `%s | {appName}` template (the home page). */
  absoluteTitle?: boolean
  /** A preview of its own (a shared puzzle's card); otherwise the language's site card. */
  image?: { url: string; alt: string }
  /**
   * A page that exists in some languages only, each under its own path (a guide): its
   * `hreflang` set. Every language at `path` when left out.
   */
  languages?: Partial<Record<Locale, string>>
  /** An article (a guide): OpenGraph `article` with its dates (ISO, YYYY-MM-DD). */
  article?: { published: string; updated: string }
}

/**
 * The one builder every page's `generateMetadata` goes through: title, description, alternates,
 * OpenGraph and the Twitter card. Next merges `openGraph` shallowly — a page's object replaces
 * the layout's — so the site name, type and preview image are repeated here for every page.
 */
export const pageMetadata = async ({
  path,
  title,
  description,
  noIndex,
  absoluteTitle,
  image: ownImage,
  languages,
  article,
}: PageMetadataInput): Promise<Metadata> => {
  const locale = await currentLocale()
  const t = await getTranslations()
  const image = { ...(ownImage ?? { url: ogImagePath(locale), alt: t('Seo.ogImageAlt') }), ...OG_IMAGE_SIZE, type: 'image/png' }
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: await localizedAlternates(path, languages),
    openGraph: {
      ...(article ? { type: 'article', publishedTime: article.published, modifiedTime: article.updated } : { type: 'website' }),
      siteName: t('Common.appName'),
      title,
      description,
      url: localePath(locale, path),
      locale: OG_LOCALES[locale],
      alternateLocale: (languages ? (Object.keys(languages) as Locale[]) : LOCALES).filter((each) => each !== locale).map((each) => OG_LOCALES[each]),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
