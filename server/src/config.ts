import './load-env.js'

const nodeEnv = process.env.NODE_ENV ?? 'development'

const asNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

/** Every `process.env` read lives here. Secrets are read by exactly one module each. */
export const config = {
  port: Number(process.env.PORT ?? 9007),
  /** Every interface in dev (a phone on the LAN can reach it); production sets 127.0.0.1. */
  host: process.env.HOST ?? '0.0.0.0',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:7007',
  nodeEnv,
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
  /** Off only in the integration tests, where every request comes from one address. */
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
  sentryDsn: process.env.SENTRY_DSN_API ?? '',
}

export const isGeminiConfigured = (): boolean => Boolean(config.gemini.key)
