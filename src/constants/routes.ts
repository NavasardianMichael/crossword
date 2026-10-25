import type { Topic } from './puzzle'

/** Every internal path, locale-free. `@i18n/navigation` adds the prefix. */
export const ROUTES = {
  home: '/',
  crossword: '/crossword',
  scanword: '/scanword',
  topics: '/topics',
  history: '/history',
  rules: '/rules',
  faq: '/faq',
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
} as const

export type RouteKey = keyof typeof ROUTES

/** Public pages, each emitted once per locale into the sitemap. */
export const INDEXABLE_ROUTES: readonly RouteKey[] = [
  'home',
  'crossword',
  'scanword',
  'topics',
  'rules',
  'faq',
  'about',
  'privacy',
  'terms',
]

/** URL slugs for the topic landing pages (`/topics/local-culture`). */
export const TOPIC_SLUGS: Record<Topic, string> = {
  general: 'general',
  nature: 'nature',
  animals: 'animals',
  food: 'food',
  geography: 'geography',
  history: 'history',
  science: 'science',
  sport: 'sport',
  arts: 'arts',
  home: 'home-and-everyday',
  professions: 'professions',
  localCulture: 'local-culture',
}

export const topicPath = (topic: Topic): string => `${ROUTES.topics}/${TOPIC_SLUGS[topic]}`

export const topicFromSlug = (slug: string): Topic | undefined =>
  (Object.entries(TOPIC_SLUGS) as [Topic, string][]).find(([, value]) => value === slug)?.[0]

/** A stored puzzle — shareable, but not indexed (its words are someone's unseen words). */
export const PUZZLE_ROUTE_PREFIX = '/p'

export const puzzlePath = (id: string): string => `${PUZZLE_ROUTE_PREFIX}/${id}`
