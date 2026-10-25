import { SEEN_LIMIT, STORAGE_KEYS } from '@constants/app'
import type { Locale } from '@constants/puzzle'
import { readJson, writeJson } from '@helpers/storage'

/**
 * The words this device has been shown, per language, as pool entry ids — sent as `exclude`
 * with every new puzzle, so no word comes back. Ids are added when a puzzle **arrives**
 * (created, prefetched or opened from a link), not when it is solved: the clues were seen.
 *
 * Newest last, capped at `SEEN_LIMIT` (about 130 puzzles); past that the oldest fall off.
 * Clearing site data resets it — the price of needing no account.
 */
const key = (locale: Locale) => `${STORAGE_KEYS.seenPrefix}${locale}`

export const readSeen = (locale: Locale): number[] => {
  const stored = readJson<unknown>(key(locale), [])
  return Array.isArray(stored) ? stored.filter((id): id is number => Number.isInteger(id)) : []
}

/** Pure, for tests: `ids` appended (moved to the end when already present), capped. */
export const mergeSeen = (seen: readonly number[], ids: readonly number[], limit = SEEN_LIMIT): number[] => {
  const added = new Set(ids)
  return [...seen.filter((id) => !added.has(id)), ...added].slice(-limit)
}

export const addSeen = (locale: Locale, ids: readonly number[]): void => {
  if (!ids.length) return
  writeJson(key(locale), mergeSeen(readSeen(locale), ids))
}
