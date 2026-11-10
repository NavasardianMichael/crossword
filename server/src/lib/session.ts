import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export type SessionPayload = {
  userId: string
  /** The `User.tokenVersion` this cookie was minted against. A newer row revokes it. */
  tokenVersion: number
}

const COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export const signSession = (payload: SessionPayload): string => jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' })

export const verifySession = (token: string): SessionPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    if (typeof decoded !== 'object' || decoded === null) return null
    const { userId, tokenVersion } = decoded as Partial<SessionPayload>
    if (typeof userId !== 'string' || typeof tokenVersion !== 'number') return null
    return { userId, tokenVersion }
  } catch {
    return null
  }
}

/** Shared by set and clear: a browser only overwrites a cookie whose path and domain match. */
export const sessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: config.nodeEnv === 'production',
  path: '/',
  ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
})

export const setSessionCookie = (res: Response, payload: SessionPayload): void => {
  res.cookie(config.cookieName, signSession(payload), { ...sessionCookieOptions(), maxAge: COOKIE_MAX_AGE_MS })
}

export const clearSessionCookie = (res: Response): void => {
  res.clearCookie(config.cookieName, sessionCookieOptions())
}
