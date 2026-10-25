import type { MetadataRoute } from 'next'
import { ROUTES } from '@constants/routes'
import { absoluteUrl } from '@helpers/url'

/**
 * Every page is locale-prefixed, so each private path needs the `*` wildcard. The play shell
 * and the device's history are personal, not content.
 *
 * Shared puzzles (`/<lang>/p/<id>`) are deliberately *not* disallowed: link-preview bots (X,
 * LinkedIn, Slack…) honour robots.txt and would show a bare link, and a crawler that may not
 * fetch a page never sees its `noindex` either. The page's own `robots: noindex` keeps it out
 * of search. Robots is a crawling hint, never an access control.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*/play', `/*${ROUTES.history}`, '/monitoring'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
