import { LOCALES } from '@constants/puzzle'
import { emblemSvg } from './brand'

export const SERVICE_WORKER_URL = '/sw.js'

/**
 * Bump when the worker's behaviour or the offline document changes. The deployed worker's
 * version also carries the build (`sw.js/route.ts`), so every deploy installs a fresh worker:
 * it precaches the new play shell and drops the old caches, chunks of past builds included.
 */
export const PWA_CACHE_VERSION = 'v3'

/** The worker's URL for a language: it precaches that language's play shell (`?locale=`). */
export const serviceWorkerUrl = (locale: string): string => `${SERVICE_WORKER_URL}?locale=${encodeURIComponent(locale)}`

const OFFLINE_URL = '/__offline__'

/**
 * Always available offline: the app chrome, and the visitor's language's play shell — the
 * static page that opens any saved puzzle from the device (`app/[lang]/play`) — with the
 * scripts and styles it loads, so it can start with no connection at all.
 */
export const PRECACHE_URLS = ['/manifest.webmanifest', '/icon', '/apple-icon']

/** Visited pages kept for offline, newest first; one-time links (`/auth/…`) never. */
const MAX_CACHED_PAGES = 50

export type OfflineColors = { background: string; text: string; muted: string; accent: string; onAccent: string }

/**
 * The last-resort page for a navigation that is neither online nor cached. Inlined into the
 * worker so it can never be missing. English only, like `global-error.tsx`: it lives
 * outside the catalogue. Rarely seen — pages are cached as they are visited, and saved
 * puzzles open through the play shell.
 */
export const buildOfflineDocument = (colors: OfflineColors): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="${colors.background}" />
    <title>Crossword AI — offline</title>
    <style>
      html, body { margin: 0; }
      body { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        background: ${colors.background}; color: ${colors.text}; font-family: system-ui, -apple-system, sans-serif; text-align: center; }
      main { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; max-width: 30rem; }
      .emblem { width: 96px; height: 96px; }
      h1 { margin: 0; font-size: 1.5rem; }
      p { margin: 0; color: ${colors.muted}; }
      a { margin-top: 0.5rem; min-height: 2.75rem; padding: 0 1.5rem; display: inline-flex; align-items: center;
        border-radius: 12px; border: 2px solid ${colors.text}; background: ${colors.accent}; color: ${colors.onAccent};
        font-weight: 700; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <div class="emblem">${emblemSvg()}</div>
      <h1>You're offline</h1>
      <p>This page hasn't been saved on this device yet. Puzzles you have opened before still play offline — find them under "My puzzles".</p>
      <a href="">Try again</a>
    </main>
  </body>
</html>
`

/**
 * - Navigations: network first (with navigation preload), cached by path (the last
 *   `MAX_CACHED_PAGES`; never `/auth/…`, whose pages carry one-time tokens); offline, the same
 *   path from cache — a puzzle page never cached goes to the language's play shell, which
 *   opens the puzzle from IndexedDB — else the locale's home page, else the offline document.
 * - `/_next/static/`: cache first — content-hashed, never stale; a new build's worker starts
 *   a new cache, so past builds' chunks do not pile up.
 * - Images, icons, fonts (incl. Google Fonts): stale-while-revalidate.
 * - Never intercepted: non-GET, the API (another origin), RSC payloads, analytics.
 * - `CACHE_URLS` message: the page hands over assets it loaded before the worker took control.
 */
export const buildServiceWorkerScript = (options: { version: string; offlineDocument: string }): string => {
  const cacheName = JSON.stringify(`crossword-${options.version}`)
  const pagesCacheName = JSON.stringify(`crossword-pages-${options.version}`)
  return `'use strict';
const CACHE = ${cacheName};
const PAGES = ${pagesCacheName};
const MAX_CACHED_PAGES = ${MAX_CACHED_PAGES};
const OFFLINE_URL = ${JSON.stringify(OFFLINE_URL)};
const OFFLINE_HTML = ${JSON.stringify(options.offlineDocument)};
const PRECACHE_URLS = ${JSON.stringify(PRECACHE_URLS)};
const LOCALES = ${JSON.stringify(LOCALES)};
const LOCALE = new URL(self.location.href).searchParams.get('locale');
const SHELL_URL = LOCALES.includes(LOCALE) ? '/' + LOCALE + '/play' : null;
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
/** A precache miss is skipped on purpose: one missing file must not fail the install. */
const skip = () => undefined;

/** The play shell and every build asset its HTML names, so it starts offline. */
const precacheShell = async (cache) => {
  if (!SHELL_URL) return;
  const response = await fetch(SHELL_URL, { credentials: 'same-origin' });
  if (!response.ok) return;
  const html = await response.clone().text();
  await cache.put(SHELL_URL, response);
  const assets = new Set(Array.from(html.matchAll(/(?:src|href)="(\\/_next\\/static\\/[^"]+)"/g), (match) => match[1]));
  await Promise.all(Array.from(assets, (asset) => cache.add(asset).catch(skip)));
};

const isOneTimePage = (pathname) => /^\\/[a-z]{2,3}\\/auth\\//.test(pathname);

/** Keeps the newest pages only: Cache keys come back in insertion order. */
const putPage = async (key, response) => {
  const pages = await caches.open(PAGES);
  await pages.delete(key);
  await pages.put(key, response);
  const keys = await pages.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_CACHED_PAGES)).map((request) => pages.delete(request)));
};

const isStaticAsset = (url) =>
  url.pathname.startsWith('/_next/image') ||
  url.pathname === '/manifest.webmanifest' ||
  url.pathname === '/icon' || url.pathname === '/icon-192' || url.pathname === '/apple-icon' || url.pathname === '/icon-maskable' ||
  /\\.(woff2?|ttf|png|jpe?g|webp|avif|svg|ico|json)$/.test(url.pathname);

const isPage = (url) => url.origin === self.location.origin && !url.pathname.startsWith('/_next/') && !isStaticAsset(url);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.put(OFFLINE_URL, new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
    await Promise.all([...PRECACHE_URLS.map((url) => cache.add(url).catch(skip)), precacheShell(cache).catch(skip)]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE && key !== PAGES).map((key) => caches.delete(key)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'CACHE_URLS' || !Array.isArray(event.data.urls)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(event.data.urls.map(async (href) => {
      try {
        const url = new URL(href, self.location.origin);
        if (url.origin !== self.location.origin) return;
        if (isPage(url)) {
          if (isOneTimePage(url.pathname)) return;
          const response = await fetch(url.pathname, { credentials: 'same-origin' });
          if (response.ok) await putPage(url.pathname, response);
        } else if (isStaticAsset(url) || url.pathname.startsWith('/_next/static/')) {
          await cache.add(url.href);
        }
      } catch (error) { /* offline or gone: skip it */ }
    }));
  })());
});

const localeOf = (pathname) => pathname.split('/')[1] || 'en';
const PUZZLE_PATH = /^\\/([a-z]{2,3})\\/p\\/([0-9A-Za-z]{10})\\/?$/;

const networkFirst = async (event) => {
  const key = new URL(event.request.url).pathname;
  try {
    const response = (await event.preloadResponse) || (await fetch(event.request));
    if (response.ok && !isOneTimePage(key)) event.waitUntil(putPage(key, response.clone()).catch(skip));
    return response;
  } catch (error) {
    // Both caches: visited pages, and the precached shell.
    const cached = await caches.match(key);
    if (cached) return cached;
    const puzzle = key.match(PUZZLE_PATH);
    if (puzzle) return Response.redirect('/' + puzzle[1] + '/play?id=' + puzzle[2], 302);
    return (await caches.match('/' + localeOf(key))) || (await caches.match(OFFLINE_URL)) ||
      new Response(OFFLINE_HTML, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request, { ignoreVary: true });
  const network = fetch(request)
    .then((response) => {
      if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  return cached || network;
};

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (FONT_HOSTS.includes(url.hostname)) { event.respondWith(staleWhileRevalidate(request)); return; }
  if (url.origin !== self.location.origin) return;
  // React Server Component payloads are per-navigation data; caching them would serve stale trees.
  if (url.searchParams.has('_rsc') || request.headers.get('RSC')) return;

  if (request.mode === 'navigate') { event.respondWith(networkFirst(event)); return; }
  if (url.pathname.startsWith('/_next/static/')) { event.respondWith(cacheFirst(request)); return; }
  if (isStaticAsset(url)) event.respondWith(staleWhileRevalidate(request));
});
`
}
