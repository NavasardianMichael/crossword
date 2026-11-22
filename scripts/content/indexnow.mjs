#!/usr/bin/env node
/**
 * Tells IndexNow engines (Bing, Yandex, Seznam, Naver; Bing feeds ChatGPT search and Copilot)
 * which guides a deploy changed, so they recrawl them now rather than whenever they next pass.
 * Google does not take IndexNow: it reads the sitemap, whose `lastmod` for a guide is its
 * `updated` date. Run by `.github/workflows/content.yml` once the pages are live.
 *
 *   node scripts/content/indexnow.mjs --base <sha> --head <sha>   guides changed between two commits
 *   node scripts/content/indexnow.mjs --all                       every guide and hub
 *   add --dry-run to print the URLs without sending them
 *
 * The site, the key and the sending are `scripts/indexnow.mjs`'s.
 */
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteOrigin, submit, warn } from '../indexnow.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
/** `src/content/guides/<locale>/<slug>.ts` is served at `/<locale>/guides/<slug>` (src/constants/routes.ts). */
const GUIDES_DIR = 'src/content/guides'
/** What content.yml deploys. */
const CONTENT_ROOTS = ['src/content', 'public/content']

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const option = (name) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? '' : (args[index + 1] ?? '')
}

const isCommit = (sha) => {
  if (!/^[0-9a-f]{7,40}$/.test(sha) || /^0+$/.test(sha)) return false
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: ROOT, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/** The languages that have guides now: the folders under `src/content/guides`. */
const guideLocales = () =>
  readdirSync(path.join(ROOT, GUIDES_DIR), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

/** Every guide file, or those a range changed (deleted ones too: engines then drop them). */
const contentFiles = (base, head) => {
  if (!base) {
    return guideLocales().flatMap((locale) =>
      readdirSync(path.join(ROOT, GUIDES_DIR, locale)).map((name) => `${GUIDES_DIR}/${locale}/${name}`)
    )
  }
  const out = execFileSync('git', ['diff', '--name-only', base, head, '--', ...CONTENT_ROOTS], { cwd: ROOT, encoding: 'utf8' })
  return out.split('\n').filter(Boolean)
}

/**
 * Paths to announce: each changed guide and its language's hub. A language's `index.ts` (its
 * hub's list) announces that hub; the shared registry or types announce every hub.
 */
export const pathsFor = (files, locales) => {
  const paths = new Set()
  for (const file of files) {
    const guide = /^src\/content\/guides\/([a-z]{2,3})\/([a-z0-9-]+)\.ts$/.exec(file)
    if (guide && guide[2] !== 'index') {
      paths.add(`/${guide[1]}/guides/${guide[2]}`)
      paths.add(`/${guide[1]}/guides`)
    } else if (guide) {
      paths.add(`/${guide[1]}/guides`)
    } else if (CONTENT_ROOTS.some((root) => file.startsWith(`${root}/`))) {
      for (const locale of locales) paths.add(`/${locale}/guides`)
    }
  }
  return [...paths].sort()
}

const main = async () => {
  const site = siteOrigin()
  if (!site) return

  const head = option('head') || 'HEAD'
  const base = flag('all') ? '' : option('base')
  if (base && !isCommit(base)) warn(`base ${base} is not a commit here; announcing every guide`)
  const paths = pathsFor(contentFiles(base && isCommit(base) ? base : '', head), guideLocales())
  if (paths.length === 0) {
    console.log('indexnow: no guide changed')
    return
  }

  const urls = paths.map((p) => `${site}${p}`)
  console.log(`indexnow: ${urls.length} URL(s)\n${urls.map((url) => `  ${url}`).join('\n')}`)
  if (flag('dry-run')) return
  await submit(site, urls)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => warn(error instanceof Error ? error.message : String(error)))
}
