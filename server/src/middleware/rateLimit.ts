import type { RequestHandler, Response } from 'express'
import { config } from '../config.js'
import { fail } from '../lib/api-response.js'
import { createRateLimiter, type RateLimitVerdict } from '../lib/rateLimit.js'
import { asEmail, clientAddress } from '../lib/request.js'

type Limit = { limit: number; windowMs: number }

const refuse = (res: Response, verdict: Extract<RateLimitVerdict, { allowed: false }>) => {
  res.setHeader('Retry-After', String(verdict.retryAfterSeconds))
  return fail(res, 'Too many requests', 429, 429)
}

/**
 * Express wrapper over `lib/rateLimit.ts`, keyed on the client's address (`trust proxy` is 1,
 * so `req.ip` is the client behind nginx; an IPv6 client counts as its /64).
 *
 * `signedIn`, when given, is a separate and higher ceiling for signed-in requests from one
 * address: many accounts behind an office or a carrier's address are normal, and each account is
 * held to its own limit by `accountRateLimit`. Guests from that address keep `limit`.
 */
export const rateLimit = (name: string, options: Limit & { signedIn?: Limit }): RequestHandler => {
  const guests = createRateLimiter(options)
  const accounts = options.signedIn ? createRateLimiter(options.signedIn) : null

  return (req, res, next) => {
    if (!config.rateLimitEnabled) return next()
    const address = clientAddress(req) || 'unknown'
    const verdict = accounts && req.session ? accounts(`${name}:user:${address}`) : guests(`${name}:${address}`)
    return verdict.allowed ? next() : refuse(res, verdict)
  }
}

/**
 * Per signed-in account, whatever address it comes from — one account rotating through proxies
 * meets the same limit. Every window must allow the request. Guests pass straight through: their
 * address limit (`rateLimit`) is what holds them.
 */
export const accountRateLimit = (name: string, ...limits: Limit[]): RequestHandler => {
  const limiters = limits.map(createRateLimiter)

  return (req, res, next) => {
    if (!config.rateLimitEnabled || !req.session) return next()
    for (const limiter of limiters) {
      const verdict = limiter(`${name}:${req.session.userId}`)
      if (!verdict.allowed) return refuse(res, verdict)
    }
    return next()
  }
}

/**
 * Per email address in the body, whatever address the requests come from: password guessing
 * against one account spread over many IPs meets this limit. Every attempt counts — a real
 * player does not sign in ten times in a quarter of an hour. It slows guessing for that email
 * only; Google sign-in and a password reset still work. A body without a valid email passes,
 * and the route refuses it.
 */
export const emailRateLimit = (name: string, options: Limit): RequestHandler => {
  const limiter = createRateLimiter(options)

  return (req, res, next) => {
    const email = asEmail(req.body?.email)
    if (!config.rateLimitEnabled || !email) return next()
    const verdict = limiter(`${name}:${email}`)
    return verdict.allowed ? next() : refuse(res, verdict)
  }
}
