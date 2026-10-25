import type { BreadcrumbList, FAQPage, ItemList, VideoGame, WebSite, WithContext } from 'schema-dts'
import type { Locale } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { APP_NAME, AUTHOR } from '@constants/app'
import { absoluteUrl } from '@helpers/url'

/**
 * JSON-LD builders. Every URL is absolute and locale-prefixed, matching the page's canonical.
 * Typed with `schema-dts`, so a misspelt property is a compile error rather than a silently
 * ignored field.
 */
/** `name` is the brand in the page's language; the English brand is the `alternateName`. */
export const websiteSchema = (locale: Locale, name: string, description: string): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  ...(name !== APP_NAME ? { alternateName: APP_NAME } : {}),
  url: absoluteUrl(localePath(locale, '/')),
  inLanguage: locale,
  description,
  author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
})

export const gameSchema = (locale: Locale, name: string, description: string, path: string): WithContext<VideoGame> => ({
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name,
  description,
  url: absoluteUrl(localePath(locale, path)),
  inLanguage: locale,
  genre: ['Puzzle', 'Word game', 'Crossword'],
  gamePlatform: ['Web browser', 'Android', 'iOS', 'Windows', 'macOS'],
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  playMode: 'SinglePlayer',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
})

export const faqSchema = (items: { question: string; answer: string }[]): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

export const breadcrumbSchema = (locale: Locale, crumbs: { name: string; path: string }[]): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(({ name, path }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: absoluteUrl(localePath(locale, path)),
  })),
})

/** Sample clues on a topic page, as a list of the words they define. */
export const sampleCluesSchema = (name: string, items: { clue: string; answer: string }[]): WithContext<ItemList> => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map(({ clue, answer }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: `${clue} — ${answer}`,
  })),
})
