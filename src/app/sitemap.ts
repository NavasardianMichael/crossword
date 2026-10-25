import type { MetadataRoute } from 'next'
import { LOCALES } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { TOPICS } from '@constants/puzzle'
import { INDEXABLE_ROUTES, type RouteKey, ROUTES, topicPath } from '@constants/routes'
import { absoluteUrl } from '@helpers/url'

const CHANGE_FREQUENCY: Partial<Record<RouteKey, MetadataRoute.Sitemap[number]['changeFrequency']>> = {
  home: 'daily',
  crossword: 'weekly',
  scanword: 'weekly',
  topics: 'weekly',
  rules: 'monthly',
  about: 'yearly',
  privacy: 'yearly',
  terms: 'yearly',
}

const PRIORITY: Partial<Record<RouteKey, number>> = { home: 1, crossword: 0.9, scanword: 0.9, topics: 0.7 }

/**
 * Every public page × every locale, each entry carrying the full `hreflang` set so crawlers
 * see one page in three languages rather than competing near-duplicates. Topic landing pages
 * are included: each has real sample clues on it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const entry = (path: string, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number) => {
    const languages = Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(localePath(locale, path))]))
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }))
  }

  return [
    ...INDEXABLE_ROUTES.flatMap((key) => entry(ROUTES[key], CHANGE_FREQUENCY[key], PRIORITY[key] ?? 0.5)),
    ...TOPICS.flatMap((topic) => entry(topicPath(topic), 'weekly', 0.6)),
  ]
}
