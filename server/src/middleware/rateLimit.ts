import type { RequestHandler } from 'express'
import { config } from '../config.js'
import { fail } from '../lib/api-response.js'
import { createRateLimiter } from '../lib/rateLimit.js'

/**
 * Express wrapper over `lib/rateLimit.ts`, keyed on the IP (`trust proxy` is 1, so `req.ip`
 * is the client behind nginx). There are no accounts, so the IP is the only key.
 */
export const rateLimit = (name: string, options: { limit: number; windowMs: number }): RequestHandler => {
  const limiter = createRateLimiter(options)

  return (req, res, next) => {
    if (!config.rateLimitEnabled) return next()
    const verdict = limiter(`${name}:${req.ip ?? 'unknown'}`)
    if (verdict.allowed) return next()

    res.setHeader('Retry-After', String(verdict.retryAfterSeconds))
    return fail(res, 'Too many requests', 429, 429)
  }
}
