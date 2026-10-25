import type { MetadataRoute } from 'next'
import { PUZZLE_ROUTE_PREFIX, ROUTES } from '@constants/routes'
import { absoluteUrl } from '@helpers/url'

/**
 * Every page is locale-prefixed, so each private path needs the `*` wildcard. Stored puzzles
 * and the device's history are personal, not content. Robots is a crawling hint, never an
 * access control.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [`/*${PUZZLE_ROUTE_PREFIX}/`, '/*/play', `/*${ROUTES.history}`, '/monitoring'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
