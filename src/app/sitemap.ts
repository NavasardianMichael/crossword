import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE, type Locale, LOCALES } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { CONTENT_UPDATED_AT, LEGAL_UPDATED_AT } from '@constants/legal'
import { TOPICS } from '@constants/puzzle'
import { guidePath, INDEXABLE_ROUTES, type RouteKey, ROUTES, topicPath } from '@constants/routes'
import { GUIDES } from '@content/index'
import { GUIDE_LOCALES } from '@content/locales'
import type { Guide } from '@content/types'
import { absoluteUrl } from '@helpers/url'

const CHANGE_FREQUENCY: Partial<Record<RouteKey, MetadataRoute.Sitemap[number]['changeFrequency']>> = {
  home: 'daily',
  crossword: 'weekly',
  scanword: 'weekly',
  topics: 'weekly',
  rules: 'monthly',
  faq: 'monthly',
  credits: 'monthly',
  about: 'yearly',
  contact: 'monthly',
  privacy: 'yearly',
  terms: 'yearly',
}

const PRIORITY: Partial<Record<RouteKey, number>> = { home: 1, crossword: 0.9, scanword: 0.9, topics: 0.7, faq: 0.6 }

const LEGAL: readonly RouteKey[] = ['privacy', 'terms']

/**
 * Every public page × every locale, each entry carrying the full `hreflang` set (and
 * `x-default`) so crawlers see one page in three languages rather than competing
 * near-duplicates. Topic landing pages are included: each has real sample clues on it. Guides
 * exist in some languages only, so each lists just the languages it is written in.
 * `lastModified` is when the copy changed, not the build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
    lastModified: Date
  ) => {
    const languages = {
      ...Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(localePath(locale, path))])),
      'x-default': absoluteUrl(localePath(DEFAULT_LOCALE, path)),
    }
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }))
  }

  /**
   * A page that exists in some languages only, each at its own path (a guide, the guides hub):
   * one entry per language, with that page's own `hreflang` set. `x-default` is the English
   * page when there is one.
   */
  const partial = (
    paths: Partial<Record<Locale, string>>,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
    lastModified: (locale: Locale) => Date
  ) => {
    const present = Object.entries(paths) as [Locale, string][]
    const languages = {
      ...Object.fromEntries(present.map(([locale, path]) => [locale, absoluteUrl(localePath(locale, path))])),
      ...(paths[DEFAULT_LOCALE] ? { 'x-default': absoluteUrl(localePath(DEFAULT_LOCALE, paths[DEFAULT_LOCALE])) } : {}),
    }
    return present.map(([locale, path]) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: lastModified(locale),
      changeFrequency,
      priority,
      alternates: { languages },
    }))
  }

  const guides = (Object.entries(GUIDES) as [Locale, readonly Guide[]][]).flatMap(([locale, list]) => list.map((guide) => ({ locale, guide })))
  const dateOf = (iso: string) => new Date(`${iso}T12:00:00Z`)
  const latestGuide = (locale: Locale) =>
    dateOf(guides.filter((each) => each.locale === locale).reduce((latest, { guide }) => (guide.updated > latest ? guide.updated : latest), ''))
  const guidePages = [...new Set(guides.map(({ guide }) => guide.key))].flatMap((key) => {
    const versions = guides.filter(({ guide }) => guide.key === key)
    return partial(
      Object.fromEntries(versions.map(({ locale, guide }) => [locale, guidePath(guide.slug)])),
      'monthly',
      0.6,
      (locale) => dateOf(versions.find((each) => each.locale === locale)?.guide.updated ?? '')
    )
  })

  return [
    ...INDEXABLE_ROUTES.flatMap((key) =>
      entry(
        ROUTES[key],
        CHANGE_FREQUENCY[key],
        PRIORITY[key] ?? 0.5,
        LEGAL.includes(key) ? LEGAL_UPDATED_AT : CONTENT_UPDATED_AT
      )
    ),
    ...TOPICS.flatMap((topic) => entry(topicPath(topic), 'weekly', 0.6, CONTENT_UPDATED_AT)),
    ...partial(Object.fromEntries(GUIDE_LOCALES.map((locale) => [locale, ROUTES.guides])), 'weekly', 0.6, latestGuide),
    ...guidePages,
  ]
}
