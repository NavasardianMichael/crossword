import type {
  AboutPage,
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  HowTo,
  ItemList,
  Person,
  VideoGame,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts'
import type { Locale } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { APP_NAME, AUTHOR, OG_IMAGE_PATH } from '@constants/app'
import { absoluteUrl } from '@helpers/url'

/**
 * JSON-LD builders. Every URL is absolute and locale-prefixed, matching the page's canonical.
 * Typed with `schema-dts`, so a misspelt property is a compile error rather than a silently
 * ignored field.
 */
const author: Person = { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url }

/** `name` is the brand in the page's language; the English brand is the `alternateName`. */
export const websiteSchema = (locale: Locale, name: string, description: string): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  ...(name !== APP_NAME ? { alternateName: APP_NAME } : {}),
  url: absoluteUrl(localePath(locale, '/')),
  inLanguage: locale,
  description,
  image: absoluteUrl('/icon'),
  author,
  publisher: author,
})

export const gameSchema = (
  locale: Locale,
  name: string,
  description: string,
  path: string
): WithContext<VideoGame> => ({
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
  image: absoluteUrl(OG_IMAGE_PATH),
  author,
})

/** `page` names the FAQ page itself; a FAQ that is one section of a larger page leaves it out. */
export const faqSchema = (
  items: { question: string; answer: string }[],
  page?: { locale: Locale; name: string; path: string; dateModified: Date }
): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  ...(page
    ? {
        name: page.name,
        url: absoluteUrl(localePath(page.locale, page.path)),
        inLanguage: page.locale,
        dateModified: page.dateModified.toISOString(),
      }
    : {}),
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})

export const breadcrumbSchema = (
  locale: Locale,
  crumbs: { name: string; path: string }[]
): WithContext<BreadcrumbList> => ({
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

type PageInput = { locale: Locale; name: string; description: string; path: string; dateModified: Date }

const pageFields = ({ locale, name, description, path, dateModified }: PageInput) => ({
  name,
  description,
  url: absoluteUrl(localePath(locale, path)),
  inLanguage: locale,
  dateModified: dateModified.toISOString(),
  isPartOf: { '@type': 'WebSite' as const, name: APP_NAME, url: absoluteUrl(localePath(locale, '/')) },
})

/** A plain content page (privacy, terms). */
export const webPageSchema = (page: PageInput): WithContext<WebPage> => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  ...pageFields(page),
})

export const aboutPageSchema = (page: PageInput): WithContext<AboutPage> => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  ...pageFields(page),
  author,
})

/** The topics hub: the page and the topic landing pages it links to. */
export const collectionPageSchema = (
  page: PageInput,
  items: { name: string; path: string }[]
): WithContext<CollectionPage> => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  ...pageFields(page),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      url: absoluteUrl(localePath(page.locale, path)),
    })),
  },
})

/** "How to play": each section of the rules is a step. */
export const howToSchema = (page: PageInput, steps: { title: string; text: string }[]): WithContext<HowTo> => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  ...pageFields(page),
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: 0 },
  step: steps.map(({ title, text }, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: title,
    text,
  })),
})
