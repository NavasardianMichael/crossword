import { config, isGeminiConfigured } from '../config.js'
import { allModelsCoolingDown, nextModelAvailableAt } from '../lib/gemini.js'
import { prisma } from '../lib/prisma.js'
import { type Difficulty, isDifficulty, isLocale, isTopic, type Topic, TOPICS } from '../lib/puzzle.js'
import { onRefillRequested } from '../lib/refillSignal.js'
import {
  callsToday,
  DAILY_CALL_BUDGET,
  freeCallBudget,
  generateIntoPool,
  isSaturated,
  type LengthBand,
  liveWords,
  POOL_MAX_WORDS,
  quotaDayStart,
} from '../services/entryPool.js'

/**
 * Gemini only on need, and only here. A bucket asks for words when the builder found that some
 * player's *next* puzzle would run short (`PoolDemand.shortfall`, `services/puzzleBuilder.ts`) or
 * the daily reserve is thin (`services/daily.ts`); nothing else calls Gemini.
 *
 * Runs on events, never on a polling timer: recording a shortfall starts a run (debounced, one at a
 * time); a run drains every open shortfall, then sleeps. When it cannot finish it schedules one
 * wake-up for the moment that can change: the next quota day once the budget is spent, the first
 * model's cooldown end, or 15 minutes after an error. Plus one run at startup (shortfalls survive
 * a restart in the database) and a safety sweep every 6 hours.
 *
 * Within a run: paying players' gaps first (they may spend the whole budget, free play its share),
 * then the largest; a language at `POOL_MAX_WORDS` is never generated for; a bucket whose last
 * batches found almost nothing new pauses for a week.
 */
const DEBOUNCE_MS = 3_000
const STARTUP_DELAY_MS = 5_000
const SWEEP_MS = 6 * 60 * 60 * 1000
const ERROR_RETRY_MS = 15 * 60 * 1000
/** Between bursts of `config.poolRefill.callsPerBurst` calls: the free tier also has a per-minute quota. */
const BURST_PAUSE_MS = 15_000
const SATURATION_PAUSE_MS = 7 * 24 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
/** A guard against a run that never ends; a real one drains in far fewer generations. */
const MAX_GENERATIONS_PER_RUN = 200

type Bucket = { locale: string; topic: string; difficulty: number; shortfall: number; paid: boolean; lengthBand: string | null }

let started = false
let timer: NodeJS.Timeout | null = null
let wakeAt = Number.POSITIVE_INFINITY
let current: Promise<void> | null = null
let again = false

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Schedules a run in `ms`, unless one is due sooner already. */
const scheduleRun = (ms: number) => {
  if (!started) return
  const at = Date.now() + Math.max(0, ms)
  if (timer && at >= wakeAt) return
  if (timer) clearTimeout(timer)
  wakeAt = at
  timer = setTimeout(() => {
    timer = null
    wakeAt = Number.POSITIVE_INFINITY
    void runRefill()
  }, at - Date.now())
  // Never keep the process alive on its own.
  timer.unref()
}

/** A shortfall was just recorded (`lib/refillSignal.ts`): refill soon. Signals within a few seconds share one run. */
const onShortfall = (): void => scheduleRun(DEBOUNCE_MS)

const isLengthBand = (value: string | null): value is LengthBand => value === 'short' || value === 'mid' || value === 'long'

const thinnestTopic = async (locale: string, difficulty: Difficulty): Promise<Topic | null> => {
  const counts = await Promise.all(
    TOPICS.map(async (topic) => ({
      topic,
      count: await prisma.entry.count({ where: { locale, retiredAt: null, difficulty, topics: { has: topic } } }),
    }))
  )
  return counts.sort((a, b) => a.count - b.count)[0]?.topic ?? null
}

const updateBucket = (bucket: Bucket, data: { shortfall?: number; pausedUntil?: Date }) =>
  prisma.poolDemand.update({
    where: { locale_topic_difficulty: { locale: bucket.locale, topic: bucket.topic, difficulty: bucket.difficulty } },
    data: { ...data, ...(data.shortfall === 0 ? { paid: false, lengthBand: null } : {}) },
  })

/** What stopped a run early, and so when to wake: `null` when every open shortfall was handled. */
type Stop = { retryInMs: number } | null

const drain = async (): Promise<Stop> => {
  let generations = 0
  let burst = 0

  while (generations < MAX_GENERATIONS_PER_RUN) {
    const now = new Date()
    const buckets: Bucket[] = await prisma.poolDemand.findMany({
      where: { shortfall: { gt: 0 }, OR: [{ pausedUntil: null }, { pausedUntil: { lt: now } }] },
      orderBy: [{ paid: 'desc' }, { shortfall: 'desc' }, { lastRequestedAt: 'desc' }],
      take: 20,
      select: { locale: true, topic: true, difficulty: true, shortfall: true, paid: true, lengthBand: true },
    })
    if (!buckets.length) return null

    for (const bucket of buckets) {
      if (!isLocale(bucket.locale) || !isDifficulty(bucket.difficulty)) {
        await updateBucket(bucket, { shortfall: 0 })
        continue
      }
      // At the cap: no more words for this language, ever. Its players get their oldest-seen words back.
      if ((await liveWords(bucket.locale)) >= POOL_MAX_WORDS) {
        await updateBucket(bucket, { shortfall: 0 })
        continue
      }
      // An "any topic" bucket is topped up one topic at a time, the thinnest first.
      const topic = isTopic(bucket.topic) ? bucket.topic : await thinnestTopic(bucket.locale, bucket.difficulty)
      if (!topic) {
        await updateBucket(bucket, { shortfall: 0 })
        continue
      }
      if (await isSaturated(bucket.locale, topic, bucket.difficulty)) {
        await updateBucket(bucket, { pausedUntil: new Date(Date.now() + SATURATION_PAUSE_MS) })
        continue
      }

      const budget = bucket.paid ? DAILY_CALL_BUDGET : freeCallBudget()
      // Ordered paid first: once free play's share is spent, only free buckets are left.
      if ((await callsToday()) >= budget) return { retryInMs: quotaDayStart().getTime() + DAY_MS - Date.now() }
      if (allModelsCoolingDown()) return { retryInMs: nextModelAvailableAt() - Date.now() }

      if (burst >= config.poolRefill.callsPerBurst) {
        await wait(BURST_PAUSE_MS)
        burst = 0
      }

      let result
      try {
        result = await generateIntoPool(bucket.locale, topic, bucket.difficulty, {
          attempts: 1,
          budget,
          lengthBand: isLengthBand(bucket.lengthBand) ? bucket.lengthBand : null,
        })
      } catch (error) {
        console.warn('[refill] stopped:', (error as Error).message)
        return { retryInMs: allModelsCoolingDown() ? nextModelAvailableAt() - Date.now() : ERROR_RETRY_MS }
      }
      generations++
      burst += result.calls
      // Nothing spent: the budget ran out between the check and the call.
      if (!result.calls) return { retryInMs: quotaDayStart().getTime() + DAY_MS - Date.now() }

      // Decremented in SQL: a request may have raised the gap meanwhile.
      await prisma.$executeRaw`
        UPDATE "PoolDemand" SET shortfall = GREATEST(shortfall - ${result.inserted}, 0)
        WHERE locale = ${bucket.locale} AND topic = ${bucket.topic} AND difficulty = ${bucket.difficulty}
      `
    }
  }
  return { retryInMs: DEBOUNCE_MS }
}

/** One run: drains every open shortfall; when it could not, schedules the wake-up that can change that. */
export const runRefill = (): Promise<void> => {
  if (current) {
    again = true
    return current
  }
  current = (async () => {
    try {
      if (!config.poolRefill.enabled || !isGeminiConfigured()) return
      do {
        again = false
        const stop = await drain()
        if (stop) scheduleRun(stop.retryInMs)
      } while (again)
    } catch (error) {
      console.error('[refill]', error)
      scheduleRun(ERROR_RETRY_MS)
    } finally {
      current = null
    }
  })()
  return current
}

/** Starts the job; the returned stop clears the timers and resolves once a running refill has finished. */
export const startPoolRefillJob = (): (() => Promise<void>) => {
  if (!config.poolRefill.enabled) return async () => {}
  started = true
  onRefillRequested(onShortfall)
  scheduleRun(STARTUP_DELAY_MS)
  const sweep = setInterval(() => void runRefill(), SWEEP_MS)
  sweep.unref()
  return async () => {
    started = false
    onRefillRequested(null)
    clearInterval(sweep)
    if (timer) clearTimeout(timer)
    timer = null
    await current
  }
}
