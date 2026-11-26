import type { Topic } from './puzzle'

/** Every internal path, locale-free. `@i18n/navigation` adds the prefix. */
export const ROUTES = {
  home: '/',
  /** One URL per language; its puzzle changes at 00:00 UTC. */
  daily: '/daily',
  crossword: '/crossword',
  scanword: '/scanword',
  topics: '/topics',
  /** Only in the languages that have guides (`@content/locales`). */
  guides: '/guides',
  history: '/history',
  rules: '/rules',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  credits: '/credits',
  /** Paddle's "default payment link": Paddle.js opens the overlay here (`?_ptxn=txn_…`). */
  paymentsCheckout: '/payments/checkout',
  /** Where a paid checkout lands, waiting for the webhook (`?id=txn_…`). */
  paymentsReturn: '/payments/return',
} as const

export type RouteKey = keyof typeof ROUTES

/** Public pages, each emitted once per locale into the sitemap. */
export const INDEXABLE_ROUTES: readonly RouteKey[] = [
  'home',
  'daily',
  'crossword',
  'scanword',
  'topics',
  'rules',
  'faq',
  'credits',
  'about',
  'contact',
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

/** A guide, in its own language's slug (`src/content/guides/<locale>/<slug>.ts`). */
export const guidePath = (slug: string): string => `${ROUTES.guides}/${slug}`

/** A stored puzzle — shareable, but not indexed (its words are someone's unseen words). */
export const PUZZLE_ROUTE_PREFIX = '/p'

export const puzzlePath = (id: string): string => `${PUZZLE_ROUTE_PREFIX}/${id}`
