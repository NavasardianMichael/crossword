#!/usr/bin/env node
/**
 * The deploy's first job (`deploy.yml` → "Check configuration"): checks the secrets the pipeline
 * and the production API need, so a missing or wrong one fails the run in seconds, not after the
 * tests and builds, or halfway through the release swap. Errors are what would break the deploy,
 * stop the API, or quietly break a flow in production; warnings are features that are off.
 * Prints GitHub annotations and never prints a value.
 *
 * Input, from the environment: DEPLOY_WEB and DEPLOY_API ("true" for each side being deployed),
 * SSH_HOST, SSH_USER, SSH_KEY, SSH_PORT, APP_DIR, ENV_API_BASE64 and the
 * NEXT_PUBLIC_* build values. `tests/unit/deployConfig.spec.ts` covers the rules.
 */
import { pathToFileURL } from 'node:url'

const WHERE = 'GitHub → Settings → Secrets and variables → Actions → Repository secrets'
const REENCODE = 'Fix server/.env.production.local, then pnpm env:base64 production | clip into ENV_API_BASE64'
const DEV_JWT_SECRET = 'dev-secret-change-me'
const URL_SAFE = /^[A-Za-z0-9._~-]+$/
const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]'])
const PADDLE_PRICES = ['PADDLE_PRICE_ID_STARTER', 'PADDLE_PRICE_ID_POPULAR', 'PADDLE_PRICE_ID_BIG']

/** Reads an env file the way the deploy and systemd do: `KEY=value` lines, one pair of surrounding quotes dropped. */
export const parseEnvFile = (text) => {
  const values = {}
  for (const line of text.replace(/\r/g, '').split('\n')) {
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line)
    if (!match) continue
    let value = match[2]
    if (value.length >= 2 && (value[0] === '"' || value[0] === "'") && value.at(-1) === value[0]) value = value.slice(1, -1)
    values[match[1]] = value
  }
  return values
}

const parseUrl = (value) => {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

const isPublicHttps = (value) => {
  const url = parseUrl(value)
  return Boolean(url && url.protocol === 'https:' && !LOOPBACK.has(url.hostname))
}

const withoutSlash = (value) => value.replace(/\/+$/, '')

/** @returns {{ errors: string[], warnings: string[] }} */
export const checkDeployConfig = (env) => {
  const errors = []
  const warnings = []
  const has = (source, name) => Boolean(source[name]?.trim())
  const deployWeb = env.DEPLOY_WEB === 'true'
  const deployApi = env.DEPLOY_API === 'true'

  // --- Reaching the server: every deploy -----------------------------------------------
  for (const name of ['SSH_HOST', 'SSH_USER', 'SSH_KEY', 'APP_DIR']) {
    if (!has(env, name)) errors.push(`${name} is empty. Set it in ${WHERE}.`)
  }
  if (has(env, 'SSH_KEY') && !/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(env.SSH_KEY)) {
    errors.push('SSH_KEY is not a private key. Paste the whole key file, from the BEGIN line to the END line.')
  }
  if (has(env, 'SSH_PORT') && !(/^\d+$/.test(env.SSH_PORT.trim()) && Number(env.SSH_PORT) >= 1 && Number(env.SSH_PORT) <= 65535)) {
    errors.push('SSH_PORT must be a port number, or left unset for 22.')
  }
  if (has(env, 'APP_DIR') && !env.APP_DIR.trim().startsWith('/')) {
    errors.push('APP_DIR must be an absolute path, e.g. /home/michael/apps/crossword.')
  }

  // --- The web bundle: values inlined at build time --------------------------------------
  if (deployWeb) {
    for (const name of ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SITE_URL']) {
      if (!has(env, name)) {
        errors.push(`${name} is empty. Set it in ${WHERE} (Secrets and Variables are different stores).`)
      } else if (!isPublicHttps(env[name])) {
        errors.push(`${name} must be a public https:// origin, not localhost or http://: the bundle would call the visitor's own machine.`)
      }
    }
    if (has(env, 'NEXT_PUBLIC_PADDLE_ENV') && !['sandbox', 'production'].includes(env.NEXT_PUBLIC_PADDLE_ENV)) {
      errors.push('NEXT_PUBLIC_PADDLE_ENV must be "sandbox" or "production".')
    }
  }

  // --- The API env file -----------------------------------------------------------------
  if (!deployApi) return { errors, warnings }

  if (!has(env, 'ENV_API_BASE64')) {
    errors.push(`ENV_API_BASE64 is empty. ${REENCODE}.`)
    return { errors, warnings }
  }
  const encoded = env.ENV_API_BASE64.replace(/\s/g, '')
  const api = /^[A-Za-z0-9+/]+={0,2}$/.test(encoded) ? parseEnvFile(Buffer.from(encoded, 'base64').toString('utf8')) : {}
  if (!Object.keys(api).length) {
    errors.push(`ENV_API_BASE64 does not decode to an env file. ${REENCODE}.`)
    return { errors, warnings }
  }

  const database = parseUrl(api.DATABASE_URL ?? '')
  if (!has(api, 'DATABASE_URL')) {
    errors.push(`ENV_API_BASE64 has no DATABASE_URL. ${REENCODE}.`)
  } else if (!database || !['postgres:', 'postgresql:'].includes(database.protocol)) {
    errors.push('DATABASE_URL in ENV_API_BASE64 is not a postgresql:// URL.')
  } else if (LOOPBACK.has(database.hostname) && database.port === '5007') {
    // The first deploy writes POSTGRES_* from these into a compose .env, where `$` would be interpolated.
    const parts = { user: decodeURIComponent(database.username), password: decodeURIComponent(database.password), database: database.pathname.slice(1) }
    for (const [part, value] of Object.entries(parts)) {
      if (!URL_SAFE.test(value)) errors.push(`DATABASE_URL's ${part} is empty or has characters other than A-Z a-z 0-9 . _ ~ - (use openssl rand -hex 32).`)
    }
  }

  const jwtSecret = api.JWT_SECRET ?? ''
  if (jwtSecret.length < 32 || jwtSecret === DEV_JWT_SECRET) {
    errors.push(`JWT_SECRET in ENV_API_BASE64 must be at least 32 random characters, or the API refuses to start (openssl rand -hex 64). ${REENCODE}.`)
  }

  if (!has(api, 'CORS_ORIGIN')) {
    errors.push('ENV_API_BASE64 has no CORS_ORIGIN: the API would allow only localhost, and every browser request would fail.')
  } else if (!isPublicHttps(api.CORS_ORIGIN)) {
    errors.push('CORS_ORIGIN in ENV_API_BASE64 must be the public https:// web origin.')
  } else if (has(env, 'NEXT_PUBLIC_SITE_URL') && withoutSlash(api.CORS_ORIGIN) !== withoutSlash(env.NEXT_PUBLIC_SITE_URL)) {
    errors.push('CORS_ORIGIN in ENV_API_BASE64 must equal NEXT_PUBLIC_SITE_URL, character for character: the API rejects every other origin.')
  }

  if (api.RATE_LIMIT_ENABLED === 'false') {
    errors.push('RATE_LIMIT_ENABLED=false is for tests only. Remove it from ENV_API_BASE64.')
  }

  if (has(api, 'GOOGLE_CLIENT_ID') !== has(api, 'GOOGLE_CLIENT_SECRET')) {
    warnings.push('Only one of GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET is set: Google sign-in stays hidden.')
  } else if (has(api, 'GOOGLE_CLIENT_ID') && !isPublicHttps(api.GOOGLE_REDIRECT_URI ?? '')) {
    errors.push('GOOGLE_REDIRECT_URI in ENV_API_BASE64 must be the public https:// callback: without it Google sends players back to localhost.')
  }

  if (has(api, 'PADDLE_API_KEY')) {
    if (!has(api, 'PADDLE_WEBHOOK_SECRET')) {
      errors.push('PADDLE_API_KEY is set without PADDLE_WEBHOOK_SECRET: players would pay and never get their credits.')
    }
    const missing = PADDLE_PRICES.filter((name) => !has(api, name))
    if (missing.length) errors.push(`PADDLE_API_KEY is set, but ${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} empty: those packs cannot be bought.`)
    if (!has(env, 'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN')) {
      warnings.push('PADDLE_API_KEY is set but NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not: the checkout cannot open in the browser.')
    } else if ((api.PADDLE_SANDBOX === 'true') !== (env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox')) {
      errors.push('PADDLE_SANDBOX (API) and NEXT_PUBLIC_PADDLE_ENV (web) disagree: both sandbox, or both live.')
    }
  } else {
    warnings.push('PADDLE_API_KEY is empty: the shop is closed (the monthly free puzzle still works).')
  }

  if (!has(api, 'GEMINI_KEY')) warnings.push('GEMINI_KEY is empty: no new words are generated, puzzles come from the seed words only.')
  if (!has(api, 'MAIL_API_URL') || !has(api, 'MAIL_API_KEY')) {
    warnings.push('MAIL_API_URL or MAIL_API_KEY is empty: verification and password-reset emails are not sent.')
  }

  return { errors, warnings }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errors, warnings } = checkDeployConfig(process.env)
  for (const message of warnings) console.log(`::warning::${message}`)
  for (const message of errors) console.log(`::error::${message}`)
  console.log(`configuration: ${errors.length} error(s), ${warnings.length} warning(s)`)
  process.exit(errors.length ? 1 : 0)
}
