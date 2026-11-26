import { LOCALES } from '../lib/puzzle.js'
import { buildDaily, utcDay } from '../services/daily.js'

/**
 * Builds the daily crosswords: today's (when missing) and tomorrow's, for every language. Runs
 * at startup and at 00:05 UTC; building a day ahead leaves 24 hours before a failed build could
 * leave a day without a puzzle, and a failure retries hourly. No AI is called here — a daily is
 * drawn from words the pool already holds (`services/daily.ts`).
 */
const STARTUP_DELAY_MS = 10_000
const RETRY_MS = 60 * 60 * 1000
/** Minutes past midnight UTC: the new day has begun everywhere the job's clock might drift. */
const RUN_AT_MINUTE = 5

let timer: NodeJS.Timeout | null = null
let current: Promise<void> | null = null

const msUntilNextRun = (now = new Date()): number => {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, RUN_AT_MINUTE)
  return next - now.getTime()
}

/** Builds what is missing; resolves to whether every build succeeded. */
export const buildDailies = async (): Promise<boolean> => {
  let ok = true
  for (const date of [utcDay(0), utcDay(1)]) {
    for (const locale of LOCALES) {
      try {
        await buildDaily(locale, date)
      } catch (error) {
        ok = false
        console.error(`[daily] ${locale} ${date}:`, (error as Error).message)
      }
    }
  }
  return ok
}

const schedule = (ms: number) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    current = buildDailies()
      .then((ok) => schedule(ok ? msUntilNextRun() : Math.min(RETRY_MS, msUntilNextRun())))
      .catch((error: unknown) => {
        console.error('[daily]', error)
        schedule(RETRY_MS)
      })
      .finally(() => {
        current = null
      })
  }, ms)
  timer.unref()
}

/** Starts the job; the returned stop clears the timer and resolves once a running build has finished. */
export const startDailyBuildJob = (): (() => Promise<void>) => {
  schedule(STARTUP_DELAY_MS)
  return async () => {
    if (timer) clearTimeout(timer)
    timer = null
    await current
  }
}
