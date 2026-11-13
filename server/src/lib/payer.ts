import type { Request, Response } from 'express'
import { randomBytes } from 'node:crypto'
import { reporterKeyFor } from './request.js'
import { sessionCookieOptions } from './session.js'
import { config } from '../config.js'

/** Who pays for a puzzle: an account, or a guest device. `ipKey` caps guest devices per address. */
export type Payer = { userId: string; ipKey: string } | { guestId: string; ipKey: string }

const GUEST_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/
const GUEST_COOKIE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

/**
 * The signed-in account, or else the guest device behind the `crossword-guest` cookie — issued
 * on first sight. It only marks whose monthly free credits a device spends; clearing it is
 * why guests are also capped per IP address.
 */
export const payerOf = (req: Request, res: Response): Payer => {
  const ipKey = reporterKeyFor(req)
  if (req.session) return { userId: req.session.userId, ipKey }

  let guestId = req.cookies?.[config.guestCookieName] as unknown
  if (typeof guestId !== 'string' || !GUEST_ID_PATTERN.test(guestId)) {
    guestId = randomBytes(16).toString('base64url')
    res.cookie(config.guestCookieName, guestId, { ...sessionCookieOptions(), maxAge: GUEST_COOKIE_MAX_AGE_MS })
  }
  return { guestId: guestId as string, ipKey }
}
