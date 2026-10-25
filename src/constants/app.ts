import { MAX_EXCLUDE } from './puzzle'

/**
 * The English brand: the web manifest (one per site) and JSON-LD `alternateName`. Everything a
 * visitor reads uses the translated `Common.appName`.
 */
export const APP_NAME = 'Crossword AI'

export const SITE_URL_FALLBACK = 'http://localhost:7007'

export const API_URL_FALLBACK = 'http://localhost:9007'

export const API_REQUEST_TIMEOUT_MS = 20_000
/** A request the pool cannot fill waits for one Gemini batch (and its judge pass). */
export const API_PUZZLE_TIMEOUT_MS = 90_000

export const AUTHOR = {
  name: 'Michael Navasardyan',
  url: 'https://www.linkedin.com/in/michael-navasardyan/',
} as const

/** Every localStorage key in one place, namespaced so nothing collides on a shared origin. */
export const STORAGE_KEYS = {
  settings: 'crossword:settings',
  /** The last generator choices, so "new puzzle" repeats them. */
  generator: 'crossword:generator',
  /** Suffixed with the locale: `crossword:seen:ru`. */
  seenPrefix: 'crossword:seen:',
  pwaInstalledAt: 'crossword:pwa-installed',
  iosHintClosedAt: 'crossword:ios-hint-closed',
} as const

/** Entry ids a device remembers per language, so no word ever comes back. */
export const SEEN_LIMIT = MAX_EXCLUDE

export const IDB_NAME = 'crossword'
export const IDB_VERSION = 1

/** Puzzles kept on the device for "continue" and offline play. */
export const SAVED_PUZZLES_LIMIT = 30
