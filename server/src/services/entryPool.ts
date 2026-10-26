import { Prisma } from '@prisma/client'
import { generateEntries, PROMPT_VARIANT, type Seeding } from './entryGen.js'
import { clueHash, type ValidEntry } from './entryValidation.js'
import { config, isGeminiConfigured } from '../config.js'
import { ALPHABETS } from '../lib/alphabet.js'
import { LOCALE_CONTENT } from '../lib/content/index.js'
import { createRandom, type Random } from '../lib/layout/rng.js'
import { prisma } from '../lib/prisma.js'
import type { Difficulty, Locale, Topic, TopicChoice } from '../lib/puzzle.js'

/**
 * The word pool: **every word Gemini writes is kept**, so the free quota is spent once per word
 * rather than once per puzzle, and a puzzle the pool can fill costs no API call at all.
 *
 * Repeats are ruled out by identity, not by luck: one `Entry` per (locale, answer), devices
 * exclude the entry ids they were shown, and entries are retired, never deleted.
 */

export type ClueStyle = 'full' | 'short'

/** Letters (almost) no word of the language starts with: never asked for as starting letters. */
const NON_INITIAL: Record<Locale, readonly string[]> = {
  en: ['x'],
  ru: ['ъ', 'ы', 'ь', 'й'],
  hy: ['և'],
}

const DAY_MS = 24 * 60 * 60 * 1000
const SUBTOPIC_WINDOW_MS = 30 * DAY_MS
const STARTING_LETTERS = 4
const MAX_AVOID = 200
const EXAMPLES_PER_PROMPT = 3

// ---------------------------------------------------------------------------------------------
// Writing into the pool

export type InsertResult = { inserted: number; mergedClues: number; ids: number[] }

/**
 * Upserts entries with their two clues. A word the pool already has keeps its id and gains the
 * new topic and clues; a **retired** word is never revived.
 */
export const insertEntries = async (
  locale: Locale,
  topic: Topic | readonly Topic[],
  entries: readonly ValidEntry[],
  meta: { origin: 'ai' | 'seed'; model: string | null; verified: boolean }
): Promise<InsertResult> => {
  const topics = typeof topic === 'string' ? [topic] : [...topic]
  const result: InsertResult = { inserted: 0, mergedClues: 0, ids: [] }

  for (const entry of entries) {
    const [row] = await prisma.$queryRaw<{ id: number; inserted: boolean }[]>`
      INSERT INTO "Entry" (locale, answer, display, length, "firstCell", topics, difficulty, kind, origin, model)
      VALUES (${locale}, ${entry.answer}, ${entry.word.trim()}, ${entry.length}, ${entry.firstCell}, ${topics}::text[],
              ${entry.difficulty}, ${entry.kind}::"EntryKind", ${meta.origin}::"EntryOrigin", ${meta.model})
      ON CONFLICT (locale, answer) DO UPDATE
        SET topics = (SELECT array_agg(DISTINCT t) FROM unnest("Entry".topics || EXCLUDED.topics) AS t)
        WHERE "Entry"."retiredAt" IS NULL
      RETURNING id, (xmax = 0) AS inserted
    `
    if (!row) continue
    result.ids.push(row.id)
    if (row.inserted) result.inserted++

    const clues = [
      { style: 'full', text: entry.clue },
      { style: 'short', text: entry.shortClue },
    ] as const
    for (const clue of clues) {
      const added = await prisma.$executeRaw`
        INSERT INTO "Clue" (id, "entryId", style, text, hash, difficulty, verified, model)
        VALUES (gen_random_uuid(), ${row.id}, ${clue.style}::"ClueStyle", ${clue.text}, ${clueHash(clue.text)},
                ${entry.difficulty}, ${meta.verified}, ${meta.model})
        ON CONFLICT ("entryId", hash) DO NOTHING
      `
      if (added && !row.inserted) result.mergedClues++
    }
  }
  return result
}

// ---------------------------------------------------------------------------------------------
// Steering generation away from what the pool already has

const pickWeighted = <T>(items: readonly T[], weight: (item: T) => number, random: Random): T => {
  const total = items.reduce((sum, item) => sum + weight(item), 0)
  let roll = random() * total
  for (const item of items) {
    roll -= weight(item)
    if (roll <= 0) return item
  }
  return items[items.length - 1]!
}

/**
 * Where the next batch should look: the subtopic used least lately, starting letters where the
 * pool is thinnest, and — since the letters narrow the slice — a near-complete list of the
 * words the slice already holds, so the model is told exactly what not to repeat.
 */
export const pickSeeding = async (locale: Locale, topic: Topic, random: Random): Promise<Seeding> => {
  const content = LOCALE_CONTENT[locale]

  const usage = await prisma.generationLog.groupBy({
    by: ['subtopic'],
    where: { locale, topic, createdAt: { gte: new Date(Date.now() - SUBTOPIC_WINDOW_MS) } },
    _count: { _all: true },
  })
  const usedTimes = new Map(usage.map(({ subtopic, _count }) => [subtopic, _count._all]))
  const subtopics = content.subtopics[topic]
  const leastUsed = Math.min(...subtopics.map((subtopic) => usedTimes.get(subtopic) ?? 0))
  const fresh = subtopics.filter((subtopic) => (usedTimes.get(subtopic) ?? 0) === leastUsed)
  const subtopic = fresh[Math.floor(random() * fresh.length)]!

  const counts = await prisma.$queryRaw<{ firstCell: string; count: number }[]>`
    SELECT "firstCell", COUNT(*)::int AS count FROM "Entry"
    WHERE locale = ${locale} AND ${topic} = ANY(topics)
    GROUP BY "firstCell"
  `
  const perLetter = new Map(counts.map(({ firstCell, count }) => [firstCell, count]))
  const letters: string[] = []
  const options = ALPHABETS[locale].filter((letter) => !NON_INITIAL[locale].includes(letter))
  while (letters.length < STARTING_LETTERS) {
    const left = options.filter((letter) => !letters.includes(letter))
    letters.push(pickWeighted(left, (letter) => 1 / (1 + (perLetter.get(letter) ?? 0)), random))
  }

  const existing = await prisma.entry.findMany({
    where: { locale, firstCell: { in: letters }, topics: { has: topic } },
    orderBy: { createdAt: 'desc' },
    take: MAX_AVOID,
    select: { display: true },
  })

  const shuffled = [...content.examples].sort(() => random() - 0.5)
  const examples = shuffled.slice(0, EXAMPLES_PER_PROMPT)
  return {
    subtopic,
    letters,
    avoid: [...existing.map(({ display }) => display.toLocaleLowerCase(locale)), ...examples.map(({ word }) => word)],
    examples,
  }
}

/** Gemini calls spent since midnight UTC — the free tier's daily quota is the binding one. */
export const callsToday = async (): Promise<number> => {
  const midnight = new Date()
  midnight.setUTCHours(0, 0, 0, 0)
  const { _sum } = await prisma.generationLog.aggregate({ where: { createdAt: { gte: midnight } }, _sum: { calls: true } })
  return _sum.calls ?? 0
}

/** Concurrent requests for one bucket share one generation instead of each spending quota. */
const inFlight = new Map<string, Promise<number>>()

/**
 * Generates one batch into the pool and returns how many new words it stored. Two attempts: an
 * all-repeat batch is usually a fluke, and the retry names the words that were rejected.
 */
export const generateIntoPool = (locale: Locale, topic: Topic, difficulty: Difficulty): Promise<number> => {
  const key = `${locale}:${topic}:${difficulty}`
  const existing = inFlight.get(key)
  if (existing) return existing

  const task = (async () => {
    if (!isGeminiConfigured() || (await callsToday()) >= config.gemini.dailyCallBudget) return 0
    const random = createRandom(Date.now() >>> 0)
    const rejected: string[] = []

    for (let attempt = 0; attempt < 2; attempt++) {
      const seeding = await pickSeeding(locale, topic, random)
      seeding.avoid.push(...rejected)
      const started = Date.now()
      const result = await generateEntries({ locale, topic, difficulty, seeding })
      const stored = await insertEntries(locale, topic, result.entries, {
        origin: 'ai',
        model: result.model,
        verified: result.verified,
      })

      await prisma.generationLog.create({
        data: {
          locale,
          topic,
          subtopic: seeding.subtopic,
          difficulty,
          letters: seeding.letters,
          model: result.model,
          promptVariant: PROMPT_VARIANT,
          calls: result.calls,
          returned: result.returned,
          valid: result.valid,
          verified: result.entries.length,
          inserted: stored.inserted,
          mergedClues: stored.mergedClues,
          ms: Date.now() - started,
        },
      })
      if (stored.inserted) return stored.inserted
      rejected.push(...result.rejectedWords)
    }
    return 0
  })().finally(() => inFlight.delete(key))

  inFlight.set(key, task)
  return task
}

// ---------------------------------------------------------------------------------------------
// Reading from the pool

export type Candidate = { id: number; answer: string; topics: string[] }

/** The difficulties a puzzle draws from: its own level and the one below, for an easier glue. */
const difficultyRange = (difficulty: Difficulty): [number, number] =>
  difficulty === 1 ? [1, 1] : [difficulty - 1, difficulty]

type DrawParams = {
  locale: Locale
  topic: TopicChoice | 'general'
  difficulty: Difficulty
  style: ClueStyle
  exclude: readonly number[]
  count: number
  maxLength: number
}

/**
 * Unseen candidates, least served first, with a length mix the layouts need: short words knit
 * a grid together, long ones carry it.
 */
export const drawCandidates = async ({
  locale,
  topic,
  difficulty,
  style,
  exclude,
  count,
  maxLength,
}: DrawParams): Promise<Candidate[]> => {
  if (count <= 0) return []
  const [minDifficulty, maxDifficulty] = difficultyRange(difficulty)
  const topicFilter = topic === 'any' ? Prisma.empty : Prisma.sql`AND ${topic} = ANY(e.topics)`
  const short = Math.ceil(count * 0.45)
  const mid = Math.ceil(count * 0.4)
  const long = Math.max(count - short - mid, 1)

  const rows = await prisma.$queryRaw<Candidate[]>`
    WITH ex AS (SELECT unnest(${[...exclude]}::int[]) AS id),
    c AS (
      SELECT e.id, e.answer, e.topics, e.length,
             ROW_NUMBER() OVER (
               PARTITION BY CASE WHEN e.length <= 5 THEN 0 WHEN e.length <= 8 THEN 1 ELSE 2 END
               ORDER BY e."servedCount", random()
             ) AS rn
      FROM "Entry" e
      WHERE e.locale = ${locale} AND e."retiredAt" IS NULL
        AND e.difficulty BETWEEN ${minDifficulty} AND ${maxDifficulty}
        AND e.length BETWEEN 3 AND ${maxLength}
        ${topicFilter}
        AND NOT EXISTS (SELECT 1 FROM ex WHERE ex.id = e.id)
        AND EXISTS (
          SELECT 1 FROM "Clue" k WHERE k."entryId" = e.id AND k.style = ${style}::"ClueStyle" AND k."retiredAt" IS NULL
        )
    )
    SELECT id, answer, topics FROM c
    WHERE rn <= CASE WHEN length <= 5 THEN ${short} WHEN length <= 8 THEN ${mid} ELSE ${long} END
  `
  // Sorted, so a layout's seed alone decides it — SQL's random() order does not leak in.
  return rows.sort((a, b) => a.id - b.id)
}

export type PickedClue = { id: string; entryId: number; text: string }

/**
 * Every live clue of the style for the placed words, best first: judged, least served, closest
 * in difficulty. The builder takes the first that gives no other placed word away.
 */
export const clueOptions = async (
  entryIds: readonly number[],
  style: ClueStyle,
  difficulty: Difficulty
): Promise<Map<number, PickedClue[]>> => {
  const rows = await prisma.$queryRaw<PickedClue[]>`
    SELECT id, "entryId", text FROM "Clue"
    WHERE "entryId" = ANY(${[...entryIds]}::int[]) AND style = ${style}::"ClueStyle" AND "retiredAt" IS NULL
    ORDER BY "entryId", verified DESC, "servedCount" ASC, abs(difficulty - ${difficulty}) ASC, random()
  `
  const byEntry = new Map<number, PickedClue[]>()
  for (const row of rows) {
    const list = byEntry.get(row.entryId)
    if (list) list.push(row)
    else byEntry.set(row.entryId, [row])
  }
  return byEntry
}

export const recordDemand = async (
  locale: Locale,
  topic: TopicChoice,
  difficulty: Difficulty,
  excludeLength: number,
  urgent: boolean
): Promise<void> => {
  await prisma.$executeRaw`
    INSERT INTO "PoolDemand" (locale, topic, difficulty, requests, "maxExclude", urgent, "lastRequestedAt")
    VALUES (${locale}, ${topic}, ${difficulty}, 1, ${excludeLength}, ${urgent}, now())
    ON CONFLICT (locale, topic, difficulty) DO UPDATE SET
      requests = "PoolDemand".requests + 1,
      "maxExclude" = GREATEST("PoolDemand"."maxExclude", EXCLUDED."maxExclude"),
      urgent = "PoolDemand".urgent OR EXCLUDED.urgent,
      "lastRequestedAt" = now()
  `
}

export type Sample = { word: string; clue: string; length: number }

/**
 * A few hand-written words of a topic with their list clues, for the topic landing page. Seed
 * words only, because those are curated; that a handful of easy ones is public is harmless.
 */
export const topicSamples = async (locale: Locale, topic: Topic, count = 8): Promise<Sample[]> =>
  prisma.$queryRaw<Sample[]>`
    SELECT e.display AS word, e.length, k.text AS clue FROM "Entry" e
    JOIN LATERAL (
      SELECT text FROM "Clue" c WHERE c."entryId" = e.id AND c.style = 'full' AND c."retiredAt" IS NULL LIMIT 1
    ) k ON true
    WHERE e.locale = ${locale} AND ${topic} = ANY(e.topics) AND e.origin = 'seed' AND e."retiredAt" IS NULL
      AND e.difficulty = 1
    ORDER BY e.id
    LIMIT ${count}
  `

/** Live words per locale, for `/health`. */
export const poolSizes = async (): Promise<Record<string, number>> => {
  const rows = await prisma.entry.groupBy({ by: ['locale'], where: { retiredAt: null }, _count: { _all: true } })
  return Object.fromEntries(rows.map(({ locale, _count }) => [locale, _count._all]))
}

// ---------------------------------------------------------------------------------------------
// Player feedback

/** Reports after which an AI clue is retired, and an AI word reported as not a word. */
const RETIRE_AFTER_REPORTS = 3

/**
 * "This clue is wrong" / "this is not a word". Idempotent per reporter. Seed material is
 * hand-checked: a report on it is a reason to look, not to retire.
 */
export const reportEntry = async (
  entryId: number,
  clueId: string,
  puzzleId: string,
  reporterKey: string,
  reason: string
): Promise<void> => {
  const created = await prisma.entryReport.createMany({
    data: [{ entryId, clueId, puzzleId, reporterKey, reason }],
    skipDuplicates: true,
  })
  if (!created.count) return

  const entry = await prisma.entry.update({
    where: { id: entryId },
    data: { reportCount: { increment: 1 } },
    select: { origin: true },
  })
  const clue = await prisma.clue.update({
    where: { id: clueId },
    data: { reportCount: { increment: 1 } },
    select: { reportCount: true },
  })
  if (entry.origin !== 'ai') return

  if (clue.reportCount >= RETIRE_AFTER_REPORTS) {
    await prisma.clue.update({ where: { id: clueId }, data: { retiredAt: new Date() } })
  }

  const wordReports = await prisma.entryReport.count({
    where: { entryId, reason: { in: ['notAWord', 'offensive'] } },
  })
  // A word without a live list clue still serves scanwords; only one with no clue left retires.
  const liveClues = await prisma.clue.count({ where: { entryId, retiredAt: null } })
  if (wordReports >= RETIRE_AFTER_REPORTS || !liveClues) {
    await prisma.entry.update({ where: { id: entryId }, data: { retiredAt: new Date() } })
  }
}

/** A finished (or abandoned) game: play and solve counts, and which words needed revealing. */
export const recordResult = async (puzzleId: string, solved: boolean, revealedEntryIds: readonly number[]) => {
  await prisma.puzzle.update({
    where: { id: puzzleId },
    data: { playCount: { increment: 1 }, ...(solved ? { solveCount: { increment: 1 } } : {}) },
  })
  if (revealedEntryIds.length) {
    await prisma.entry.updateMany({
      where: { id: { in: [...revealedEntryIds] } },
      data: { revealCount: { increment: 1 } },
    })
  }
}

