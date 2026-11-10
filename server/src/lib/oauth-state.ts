import type { Request } from 'express'
import jwt from 'jsonwebtoken'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { config } from '../config.js'

/**
 * passport-oauth2 state store. The nonce goes to Google; the cookie holds the PKCE verifier
 * and where to send the user afterwards. Signing the cookie stops `returnPath` being edited.
 */
export type OAuthFlowContext = { returnPath: string | null }

type OAuthFlowCookie = OAuthFlowContext & { nonce: string; verifier: string }

const COOKIE_PATH = '/identity/google'

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: config.nodeEnv === 'production',
  path: COOKIE_PATH,
  ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
})

const nonceMatches = (received: string, expected: string): boolean => {
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export const oauthStateStore = {
  store(
    req: Request,
    verifier: string,
    state: unknown,
    _meta: unknown,
    callback: (err: Error | null, state?: string) => void
  ): void {
    const context = (state ?? {}) as Partial<OAuthFlowContext>
    const nonce = randomBytes(32).toString('hex')
    const payload: OAuthFlowCookie = { nonce, verifier, returnPath: context.returnPath ?? null }

    try {
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: Math.floor(config.oauthFlowTtlMs / 1000) })
      req.res?.cookie(config.oauthCookieName, token, { ...cookieOptions(), maxAge: config.oauthFlowTtlMs })
    } catch (error) {
      return callback(error as Error)
    }
    return callback(null, nonce)
  },

  verify(
    req: Request,
    state: string,
    _meta: unknown,
    callback: (err: Error | null, ok?: string | false, info?: { message: string }) => void
  ): void {
    const raw = req.cookies?.[config.oauthCookieName] as string | undefined
    req.res?.clearCookie(config.oauthCookieName, cookieOptions())

    if (!raw) return callback(null, false, { message: 'google_state_missing' })

    let payload: OAuthFlowCookie
    try {
      payload = jwt.verify(raw, config.jwtSecret) as OAuthFlowCookie
    } catch {
      return callback(null, false, { message: 'google_state_missing' })
    }

    if (typeof state !== 'string' || !state || !nonceMatches(state, payload.nonce)) {
      return callback(null, false, { message: 'google_state_mismatch' })
    }

    req.oauthFlow = { returnPath: payload.returnPath }
    return callback(null, payload.verifier)
  },
}
