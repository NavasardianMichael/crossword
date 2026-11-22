#!/usr/bin/env node
/**
 * Tells IndexNow engines (Bing, Yandex, Seznam, Naver; Bing's index also feeds ChatGPT search
 * and Copilot) that the public pages changed, so they recrawl now rather than whenever they
 * next pass. Google does not take IndexNow: it reads the sitemap's `lastmod`.
 *
 * The URLs are the live sitemap's own `<loc>` entries — every public page in every language —
 * so the list can never drift from what the site serves. `deploy.yml` runs it after a deploy
 * that bumped `CONTENT_UPDATED_AT` / `LEGAL_UPDATED_AT` (src/constants/legal.ts), which is the
 * rule for changing public copy, and on a manual run. The guides announce only the pages they
 * changed, from their own pipeline (`scripts/content/indexnow.mjs`, through `submit` here).
 *
 *   node scripts/indexnow.mjs              announce every sitemap URL
 *   node scripts/indexnow.mjs --dry-run    print them without sending
 *
 * The site comes from NEXT_PUBLIC_SITE_URL; the key is the `public/<32 hex>.txt` file whose
 * content is its own name (the protocol's proof that the key belongs to the host).
 *
 * A failed notification is a warning, never a failed deploy: the pages are live either way.
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENDPOINT = 'https://api.indexnow.org/indexnow'
/** The protocol's limit per request. */
const BATCH = 10_000

export const warn = (message) => {
  // GitHub Actions shows `::warning::` lines as annotations; elsewhere they read fine as text.
  console.log(`::warning::indexnow: ${message}`)
}

export const readKey = () => {
  const dir = path.join(ROOT, 'public')
  const file = readdirSync(dir).find((name) => /^[0-9a-f]{32}\.txt$/.test(name))
  if (!file) throw new Error('no public/<32 hex>.txt key file')
  const key = readFileSync(path.join(dir, file), 'utf8').trim()
  if (`${key}.txt` !== file) throw new Error(`public/${file} must contain exactly its own name`)
  return key
}

/** NEXT_PUBLIC_SITE_URL without a trailing slash, or `null` (with a warning) when it is not https. */
export const siteOrigin = () => {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '')
  if (/^https:\/\//.test(site)) return site
  warn('NEXT_PUBLIC_SITE_URL is not an https origin; nothing sent')
  return null
}

/** Only the entries' own `<loc>`; the hreflang alternates are `<xhtml:link href>`, not `<loc>`. */
export const sitemapUrls = (xml, site) =>
  [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map(([, url]) => url.replace(/&amp;/g, '&'))
    .filter((url) => url.startsWith(`${site}/`))

/** Posts the URLs in batches of the protocol's limit. A refusal is a warning. */
export const submit = async (site, urls) => {
  const key = readKey()
  for (let start = 0; start < urls.length; start += BATCH) {
    const urlList = urls.slice(start, start + BATCH)
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
      signal: AbortSignal.timeout(30_000),
    })
    // 200: received. 202: received, key not yet verified (the first time). Anything else: say so.
    if (response.status === 200 || response.status === 202) console.log(`indexnow: ${urlList.length} accepted (HTTP ${response.status})`)
    else warn(`HTTP ${response.status} ${(await response.text()).slice(0, 300)}`)
  }
}

const main = async () => {
  const site = siteOrigin()
  if (!site) return

  const sitemap = await fetch(`${site}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) })
  if (!sitemap.ok) {
    warn(`sitemap.xml answered HTTP ${sitemap.status}; nothing sent`)
    return
  }
  const urls = [...new Set(sitemapUrls(await sitemap.text(), site))]
  if (urls.length === 0) {
    warn('sitemap.xml lists no URL on this site; nothing sent')
    return
  }
  console.log(`indexnow: ${urls.length} URL(s) from ${site}/sitemap.xml`)
  if (process.argv.includes('--dry-run')) {
    console.log(urls.map((url) => `  ${url}`).join('\n'))
    return
  }
  await submit(site, urls)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => warn(error instanceof Error ? error.message : String(error)))
}
