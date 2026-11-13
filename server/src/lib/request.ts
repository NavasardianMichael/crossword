import type { Request } from 'express'
import { createHash } from 'node:crypto'
import { isIPv4, isIPv6 } from 'node:net'

/**
 * Body-reading helpers shared by the routers. The server carries no schema validator, so
 * every route hand-reads `req.body` through these.
 */

export const MAX_EMAIL_LENGTH = 254

export const isEmail = (value: string): boolean => value.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

/** Lowercased, or null when it is not an email. */
export const asEmail = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return isEmail(email) ? email : null
}

const MAX_NAME_LENGTH = 100

/** A display name: trimmed, collapsed spaces, within the column. */
export const asFullName = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const name = value.trim().replace(/\s+/g, ' ')
  return name.length > 0 && name.length <= MAX_NAME_LENGTH ? name : undefined
}

/** Trimmed text within `max`, or null when it is empty or too long. */
export const asBoundedString = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null
}

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

const expandIpv6 = (ip: string): string[] => {
  const [head = '', tail = ''] = ip.split('::')
  const start = head ? head.split(':') : []
  const end = tail ? tail.split(':') : []
  return [...start, ...Array<string>(Math.max(0, 8 - start.length - end.length)).fill('0'), ...end]
}

/**
 * The address limits are keyed on. An IPv6 client is its /64 — one household or phone gets a
 * whole /64 and could otherwise rotate through it without end — and an IPv4-mapped address
 * (`::ffff:1.2.3.4`) is the IPv4 address itself.
 */
export const clientAddress = (req: Pick<Request, 'ip'>): string => {
  const ip = (req.ip ?? '').split('%')[0]!
  const mapped = ip.toLowerCase().startsWith('::ffff:') ? ip.slice('::ffff:'.length) : ''
  if (isIPv4(mapped)) return mapped
  if (!isIPv6(ip)) return ip
  const prefix = expandIpv6(ip)
    .slice(0, 4)
    .map((group) => parseInt(group, 16).toString(16))
    .join(':')
  return `${prefix}::/64`
}

/** Guests are keyed by a hash of their address — enough to stop one person retiring a clue alone. */
export const reporterKeyFor = (req: Pick<Request, 'ip'>): string =>
  `ip:${createHash('sha256')
    .update(clientAddress(req))
    .digest('hex')
    .slice(0, 32)}`
