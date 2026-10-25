#!/usr/bin/env node
/**
 * Encodes an API env file to base64 for the `ENV_API_BASE64` GitHub secret.
 *
 *   pnpm env:base64 production        -> reads server/.env.production.local
 *   pnpm env:base64 staging           -> reads server/.env.staging.local
 *   pnpm env:base64 production . | clip     (Windows)
 *   pnpm env:base64 production | pbcopy     (macOS)
 *
 * The base64 is the ONLY thing on stdout, so it pipes cleanly. Everything else —
 * the banner, the key list, the warnings — goes to stderr.
 *
 * It prints a secret to your terminal by design. Do not run it on a shared screen,
 * and remember most shells keep scrollback.
 *
 * Usage: node scripts/env-to-base64.mjs <environment> [directory]
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const [environment, dir = 'server'] = process.argv.slice(2)

if (!environment) {
  console.error('Usage: pnpm env:base64 <environment> [directory]')
  console.error('   e.g. pnpm env:base64 production')
  process.exit(1)
}

const fileName = `.env.${environment}.local`
const filePath = path.resolve(rootDir, dir, fileName)

if (!existsSync(filePath)) {
  console.error(`Not found: ${path.relative(rootDir, filePath)}`)
  console.error(`Create it from ${path.join(dir, '.env.example')} and fill in production values.`)
  process.exit(1)
}

// Normalised to LF before encoding. A CRLF file checked out on Windows would otherwise
// carry \r into every value on the Linux host — `HOST=127.0.0.1\r` is not an IP address.
// The deploy workflow strips them too, belt and braces.
const content = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')

/** Key names only — values are never echoed. */
const keys = content
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split('=')[0]?.trim())
  .filter(Boolean)

const warn = (message) => console.error(`  WARNING  ${message}`)

// The deploy workflow strips and rewrites these three so they cannot drift from the ports
// the systemd units use. Keeping them here just invites a confusing diff.
const OWNED_BY_DEPLOY = ['NODE_ENV', 'PORT', 'HOST']
const owned = keys.filter((key) => OWNED_BY_DEPLOY.includes(key))

const REQUIRED = ['DATABASE_URL', 'CORS_ORIGIN']
const missing = REQUIRED.filter((key) => !keys.includes(key))

console.error('')
console.error(`Encoded ${path.relative(rootDir, filePath)} — ${keys.length} variables`)
console.error(`  ${keys.join(', ')}`)
console.error('')

if (missing.length) warn(`missing required: ${missing.join(', ')}`)
if (owned.length) warn(`${owned.join(', ')} — the deploy overwrites these; remove them`)
if (/DATABASE_URL=[^\n]*:5432\//.test(content)) {
  warn('DATABASE_URL uses :5432 — production publishes Postgres on 5007')
}
// Dev and production both publish Postgres on 5007, so `localhost` vs `127.0.0.1` is
// the only thing distinguishing a dev URL from a production one. Worth shouting about.
if (/DATABASE_URL="?postgresql:\/\/[^\n]*@localhost:/.test(content)) {
  warn('DATABASE_URL uses `localhost` — that is the dev spelling; production needs 127.0.0.1')
}
if (content.includes('crossword:crossword@')) warn('DATABASE_URL still has the dev password')
if (owned.length || missing.length) console.error('')

console.error('Paste the line below into the ENV_API_BASE64 GitHub secret:')
console.error('')

console.log(Buffer.from(content, 'utf8').toString('base64'))
