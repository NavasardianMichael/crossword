import type { Request } from 'express'
import { createHash } from 'node:crypto'

/**
 * Body-reading helpers shared by the routers. The server carries no schema validator, so
 * every route hand-reads `req.body` through these.
 */

/** `undefined` for anything that is not a non-empty string once trimmed. */
export const asTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

export const asInteger = (value: unknown, min: number, max: number): number | undefined => {
  const parsed = typeof value === 'string' ? Number(value) : value
  if (typeof parsed !== 'number' || !Number.isInteger(parsed)) return undefined
  return parsed >= min && parsed <= max ? parsed : undefined
}

/** Distinct integers of an array (from `min`: entry ids start at 1, word ids at 0), capped at `max` — the last ones win. */
export const asIdArray = (value: unknown, max: number, min = 1): number[] => {
  if (!Array.isArray(value)) return []
  const ids = new Set<number>()
  for (const item of value) {
    if (typeof item === 'number' && Number.isInteger(item) && item >= min && item < 2 ** 31) ids.add(item)
  }
  return [...ids].slice(-max)
}

const PUZZLE_ID_PATTERN = /^[0-9A-Za-z]{10}$/

export const isPuzzleId = (value: unknown): value is string => typeof value === 'string' && PUZZLE_ID_PATTERN.test(value)

/** Guests are keyed by a hash of their IP — enough to stop one person retiring a clue alone. */
export const reporterKeyFor = (req: Request): string =>
  `ip:${createHash('sha256')
    .update(req.ip ?? '')
    .digest('hex')
    .slice(0, 32)}`
