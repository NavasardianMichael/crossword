import { NextResponse } from 'next/server'
import { buildOfflineDocument, buildServiceWorkerScript, PWA_CACHE_VERSION } from '@helpers/pwa'
import { CORAL, CREAM, INK } from '@styles/tokens'

/**
 * The service worker script. A Route Handler rather than a file in `public/`, so the offline
 * page is built from `tokens.ts` and the emblem instead of duplicating them (bookie's
 * pattern). `/sw.js` has an extension, so the proxy never locale-prefixes it.
 *
 * The version carries the build (`BUILD_ID`, set in next.config.ts), so each deploy's worker
 * differs byte for byte and replaces the last one. `?locale=` is read by the worker itself;
 * the response is the same for every language, so it stays static.
 */
export const dynamic = 'force-static'

export function GET(): NextResponse {
  const script = buildServiceWorkerScript({
    version: `${PWA_CACHE_VERSION}-${process.env.BUILD_ID ?? 'dev'}`,
    offlineDocument: buildOfflineDocument({
      background: CREAM[100],
      text: INK[900],
      muted: INK[700],
      accent: CORAL[400],
      onAccent: INK[900],
    }),
  })

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
