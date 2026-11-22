import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@helpers/url'

/**
 * Every page is locale-prefixed, so each private path needs the `*` wildcard. The play shell
 * is personal, not content.
 *
 * Two noindexed pages are deliberately *not* disallowed, because a crawler that may not fetch
 * a page never sees its `noindex`:
 * - "My puzzles" (`/<lang>/history`): the navigation links it from every page, and a blocked
 *   URL with links to it can be indexed bare ("Indexed, though blocked by robots.txt").
 * - Shared puzzles (`/<lang>/p/<id>`): link-preview bots (X, LinkedIn, Slack…) honour
 *   robots.txt and would show a bare link.
 *
 * Robots is a crawling hint, never an access control.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*/play', '/*/payments', '/monitoring'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
