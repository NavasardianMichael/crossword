import { config, isGeminiConfigured } from '../config.js'
import { allModelsCoolingDown } from '../lib/gemini.js'
import { prisma } from '../lib/prisma.js'
import { type Difficulty, isDifficulty, isLocale, isTopic, type Topic, TOPICS } from '../lib/puzzle.js'
import { callsToday, generateIntoPool } from '../services/entryPool.js'

/**
 * Keeps the buckets players ask for stocked between puzzles, so most requests are served
 * straight from the pool with no Gemini latency.
 *
 * Demand-ordered on purpose: 3 locales × 12 topics × 3 difficulties is far more than a free
 * quota covers at once, so the job only tops up buckets asked for lately — urgent ones (a
 * request found too few unseen words) first — a couple of calls per tick, within the daily
 * budget. A bucket is stocked when it holds enough live words to stay ahead of its keenest
 * player: at least `targetPerBucket`, more once someone's seen-list grows long.
 */
const RECENT_DEMAND_MS = 14 * 24 * 60 * 60 * 1000

let running = false

const targetFor = (maxExclude: number): number =>
  Math.max(config.poolRefill.targetPerBucket, Math.ceil((maxExclude / TOPICS.length) * 1.5))

export const refillTick = async (): Promise<number> => {
  if (running || !isGeminiConfigured() || allModelsCoolingDown()) return 0
  running = true
  let calls = 0

  try {
    if ((await callsToday()) >= config.gemini.dailyCallBudget) return 0
    const buckets = await prisma.poolDemand.findMany({
      where: { lastRequestedAt: { gte: new Date(Date.now() - RECENT_DEMAND_MS) } },
      orderBy: [{ urgent: 'desc' }, { requests: 'desc' }, { lastRequestedAt: 'desc' }],
      take: 40,
    })

    for (const bucket of buckets) {
      if (calls >= config.poolRefill.maxCallsPerTick) break
      if (!isLocale(bucket.locale) || !isDifficulty(bucket.difficulty)) continue
      // An "any topic" bucket is topped up one topic at a time, the thinnest first.
      const topic: Topic | null = isTopic(bucket.topic) ? bucket.topic : await thinnestTopic(bucket.locale, bucket.difficulty)
      if (!topic) continue

      const live = await prisma.entry.count({
        where: { locale: bucket.locale, retiredAt: null, difficulty: bucket.difficulty, topics: { has: topic } },
      })
      if (live >= targetFor(bucket.maxExclude)) {
        if (bucket.urgent) await clearUrgent(bucket.locale, bucket.topic, bucket.difficulty)
        continue
      }

      calls += 1
      try {
        await generateIntoPool(bucket.locale, topic, bucket.difficulty)
        await clearUrgent(bucket.locale, bucket.topic, bucket.difficulty)
      } catch (error) {
        // Quota or overload: stop for this tick; the cooldowns in lib/gemini.ts decide when to retry.
        console.warn('[refill] stopped:', (error as Error).message)
        break
      }
    }
  } finally {
    running = false
  }

  return calls
}

const clearUrgent = (locale: string, topic: string, difficulty: number) =>
  prisma.poolDemand.update({ where: { locale_topic_difficulty: { locale, topic, difficulty } }, data: { urgent: false } })

const thinnestTopic = async (locale: string, difficulty: Difficulty): Promise<Topic | null> => {
  const counts = await Promise.all(
    TOPICS.map(async (topic) => ({
      topic,
      count: await prisma.entry.count({ where: { locale, retiredAt: null, difficulty, topics: { has: topic } } }),
    }))
  )
  return counts.sort((a, b) => a.count - b.count)[0]?.topic ?? null
}

export const startPoolRefillJob = (): void => {
  if (!config.poolRefill.enabled) return
  const timer = setInterval(() => {
    refillTick().catch((error: unknown) => console.error('[refill]', error))
  }, config.poolRefill.intervalMs)
  // Never keep the process alive on its own.
  timer.unref()
}
