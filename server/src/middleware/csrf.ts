import type { NextFunction, Request, Response } from 'express'
import { config } from '../config.js'
import { fail } from '../lib/api-response.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/**
 * Origin check on every state-changing request.
 *
 * `sameSite: 'lax'` is not enough on its own: in production the web app and the API are
 * sibling subdomains (same *site*), and in dev `:7007` and `:9007` differ only by port,
 * which is not part of the site either — so `lax` restricts nothing locally. `Origin` is
 * browser-set and cannot be written from script.
 */
export const requireSameOrigin = (req: Request, res: Response, next: NextFunction): void => {
  if (SAFE_METHODS.has(req.method)) return next()

  const blocked = () => fail(res, 'Cross-origin request blocked', 403, 403)

  const origin = req.get('origin')
  if (origin) {
    if (origin !== config.corsOrigin) return blocked()
    return next()
  }

  const referer = req.get('referer')
  if (referer) {
    try {
      if (new URL(referer).origin !== config.corsOrigin) return blocked()
      return next()
    } catch {
      return blocked()
    }
  }

  // Neither header: curl or a test. Allowed outside production only.
  if (config.nodeEnv === 'production') return blocked()
  return next()
}
