import { describe, expect, it } from 'vitest'
import { accountRateLimit, emailRateLimit, rateLimit } from '../../server/src/middleware/rateLimit.js'

// Express's types live in the server package; take them from the middleware itself.
type Handler = ReturnType<typeof rateLimit>
type Req = Parameters<Handler>[0]
type Res = Parameters<Handler>[1]

/** Runs a middleware once: 'next' when it let the request through, else the HTTP status it answered. */
const run = (handler: Handler, req: { ip?: string; userId?: string; email?: string }): 'next' | number => {
  let status = 0
  let passed = false
  const res = {
    setHeader: () => res,
    status: (code: number) => {
      status = code
      return res
    },
    json: () => res,
  }
  const request = {
    ip: req.ip ?? '203.0.113.1',
    body: req.email ? { email: req.email } : {},
    session: req.userId ? { userId: req.userId, tokenVersion: 0 } : undefined,
  }
  void handler(request as unknown as Req, res as unknown as Res, () => {
    passed = true
  })
  return passed ? 'next' : status
}

const times = (count: number, call: () => 'next' | number) => Array.from({ length: count }, call)

describe('rateLimit', () => {
  it('holds guests from one address to the limit', () => {
    const limit = rateLimit('t1', { limit: 2, windowMs: 60_000 })
    expect(times(3, () => run(limit, {}))).toEqual(['next', 'next', 429])
    expect(run(limit, { ip: '203.0.113.2' })).toBe('next')
  })

  it('gives signed-in requests from one address their own, higher ceiling', () => {
    const limit = rateLimit('t2', { limit: 1, windowMs: 60_000, signedIn: { limit: 3, windowMs: 60_000 } })
    expect(run(limit, {})).toBe('next')
    expect(run(limit, {})).toBe(429)
    expect(times(4, () => run(limit, { userId: `u${Math.random()}` }))).toEqual(['next', 'next', 'next', 429])
  })
})

describe('accountRateLimit', () => {
  it('follows one account across addresses, through every window', () => {
    const limit = accountRateLimit('t3', { limit: 2, windowMs: 60_000 }, { limit: 10, windowMs: 3_600_000 })
    expect(run(limit, { userId: 'a', ip: '198.51.100.1' })).toBe('next')
    expect(run(limit, { userId: 'a', ip: '198.51.100.2' })).toBe('next')
    expect(run(limit, { userId: 'a', ip: '198.51.100.3' })).toBe(429)
    expect(run(limit, { userId: 'b' })).toBe('next')
  })

  it('lets guests through: their address limit holds them', () => {
    const limit = accountRateLimit('t4', { limit: 1, windowMs: 60_000 })
    expect(times(3, () => run(limit, {}))).toEqual(['next', 'next', 'next'])
  })
})

describe('emailRateLimit', () => {
  it('holds one email to the limit from any address, case and spaces aside', () => {
    const limit = emailRateLimit('t5', { limit: 2, windowMs: 60_000 })
    expect(run(limit, { email: 'player@example.com', ip: '198.51.100.1' })).toBe('next')
    expect(run(limit, { email: ' Player@Example.com', ip: '198.51.100.2' })).toBe('next')
    expect(run(limit, { email: 'player@example.com', ip: '198.51.100.3' })).toBe(429)
    expect(run(limit, { email: 'other@example.com' })).toBe('next')
  })

  it('lets a body without a valid email through to the route', () => {
    const limit = emailRateLimit('t6', { limit: 1, windowMs: 60_000 })
    expect(times(2, () => run(limit, { email: 'not-an-email' }))).toEqual(['next', 'next'])
  })
})
