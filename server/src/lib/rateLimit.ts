/**
 * A fixed-window, per-key request counter.
 *
 * In-memory and per-process: counters reset on restart and are not shared across instances,
 * so this is a cheap abuse brake, not an accounting boundary. One API process holds all
 * traffic, so it is accurate today. It matters most in front of Gemini, whose free quota is
 * shared by every visitor.
 */

type Window = {
  count: number
  /** Epoch ms at which `count` resets. */
  resetAt: number
}

export type RateLimitVerdict = { allowed: true } | { allowed: false; retryAfterSeconds: number }

export type RateLimiter = (key: string) => RateLimitVerdict

/** Entries are swept lazily on write, so an idle process holds no interval. */
export const createRateLimiter = ({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter => {
  const windows = new Map<string, Window>()

  return (key) => {
    const now = Date.now()

    for (const [existing, window] of windows) {
      if (window.resetAt <= now) windows.delete(existing)
    }

    const window = windows.get(key)
    if (!window || window.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs })
      return { allowed: true }
    }

    if (window.count >= limit) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((window.resetAt - now) / 1000)) }
    }

    window.count += 1
    return { allowed: true }
  }
}
