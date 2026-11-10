import { deriveCookieDomain } from './lib/cookie-domain.js'

import './load-env.js'

const nodeEnv = process.env.NODE_ENV ?? 'development'
const corsOrigin = (process.env.CORS_ORIGIN ?? 'http://localhost:7007').replace(/\/+$/, '')
const port = Number(process.env.PORT ?? 9007)

const asNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

/** Every `process.env` read lives here. Secrets are read by exactly one module each. */
export const config = {
  port,
  /** Every interface in dev (a phone on the LAN can reach it); production sets 127.0.0.1. */
  host: process.env.HOST ?? '0.0.0.0',
  corsOrigin,
  nodeEnv,
  /** Signs the session cookie. The dev default is local only; production must set its own. */
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  cookieName: 'crossword-session',
  /** Marks a guest device's free puzzle of the month (`lib/payer.ts`). */
  guestCookieName: 'crossword-guest',
  /** Host-only in dev. In production, the web hostname, so `api.` can set a cookie the site sees. */
  cookieDomain: process.env.COOKIE_DOMAIN ?? deriveCookieDomain(nodeEnv, corsOrigin),
  oauthCookieName: 'crossword-oauth',
  oauthFlowTtlMs: 10 * 60 * 1000,
  passwordResetTtlMs: 60 * 60 * 1000,
  emailVerifyTtlMs: 48 * 60 * 60 * 1000,
  /** External mail engine. `apiKey` is read only by `lib/mail.ts`. Empty logs the link in dev. */
  mail: {
    apiUrl: (process.env.MAIL_API_URL ?? '').replace(/\/+$/, ''),
    apiKey: process.env.MAIL_API_KEY ?? '',
  },
  /** Google OAuth. `clientSecret` is read only by `lib/google-oauth.ts`. Empty hides the button. */
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? `http://localhost:${port}/identity/google/callback`,
  },
  /**
   * Gemini. `key` is read only by `lib/gemini.ts`. Empty disables generation: every puzzle is
   * built from the pool, which the seed keeps non-empty.
   */
  gemini: {
    key: process.env.GEMINI_KEY ?? '',
    /** `name[:thinkingLevel],…` — overrides the default chain in `lib/gemini.ts`. */
    models: process.env.GEMINI_MODELS ?? '',
    /** A second "judge" pass per batch that drops non-words and wrong or unnatural clues. */
    verifyEntries: process.env.VERIFY_ENTRIES !== 'false',
    /** Gemini calls per UTC day, generation and judge together. */
    dailyCallBudget: asNumber(process.env.POOL_DAILY_CALL_BUDGET, 300),
  },
  /** The background job that keeps every bucket players ask for stocked. */
  poolRefill: {
    enabled: process.env.POOL_REFILL_ENABLED !== 'false',
    intervalMs: asNumber(process.env.POOL_REFILL_INTERVAL_MS, 60 * 1000),
    /** Live entries a (locale, topic, difficulty) bucket should hold at least. */
    targetPerBucket: asNumber(process.env.POOL_REFILL_TARGET, 300),
    /** Gemini calls per tick — the free quota is per minute and per day, so this stays small. */
    maxCallsPerTick: asNumber(process.env.POOL_REFILL_MAX_CALLS, 2),
  },
  /**
   * Paddle Billing — one-time credit packs (`docs/BILLING.md`). `apiKey` and `webhookSecrets`
   * are read only by `lib/paddle.ts`. Without a key the shop is closed; free puzzles still work.
   */
  paddle: {
    apiKey: process.env.PADDLE_API_KEY ?? '',
    /** Comma-separated, so the old and the new destination's secrets both verify during a rotation. */
    webhookSecrets: (process.env.PADDLE_WEBHOOK_SECRET ?? '')
      .split(',')
      .map((secret) => secret.trim())
      .filter(Boolean),
    sandbox: process.env.PADDLE_SANDBOX === 'true',
    /** One Paddle price per pack in `CREDIT_PACKS` (`lib/puzzle.ts`). */
    priceIds: {
      starter: process.env.PADDLE_PRICE_ID_STARTER ?? '',
      popular: process.env.PADDLE_PRICE_ID_POPULAR ?? '',
      big: process.env.PADDLE_PRICE_ID_BIG ?? '',
    },
  },
  billing: {
    /**
     * Off only for e2e runs (`BILLING_ENABLED=false pnpm dev`), where every test is a guest on one
     * IP and would use up the free puzzle. Never off in production.
     */
    enabled: nodeEnv === 'production' || process.env.BILLING_ENABLED !== 'false',
    /** Guest devices one IP address may take a free puzzle for each month — a household or an office, not a farm. */
    guestFreePerIp: asNumber(process.env.GUEST_FREE_PER_IP, 3),
  },
  /** Off only in the integration tests, where every request comes from one address. */
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
}

export const isGeminiConfigured = (): boolean => Boolean(config.gemini.key)

export const isPaddleConfigured = (): boolean => Boolean(config.paddle.apiKey)

export const isGoogleOAuthConfigured = (): boolean =>
  Boolean(config.google.clientId && config.google.clientSecret && config.google.redirectUri)
