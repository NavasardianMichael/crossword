import { Prisma } from '@prisma/client'
import { recordShortfall } from './entryPool.js'
import { minWordLength } from './entryValidation.js'
import { buildPuzzle } from './puzzleBuilder.js'
import { prisma } from '../lib/prisma.js'
import type { CellView, Difficulty, Direction, Locale, PuzzleView } from '../lib/puzzle.js'
import { requestRefill } from '../lib/refillSignal.js'

/**
 * The daily crossword: one classic medium puzzle per language per UTC day, the same for everyone,
 * free. Built a day ahead by `jobs/dailyBuild.ts` with the ordinary builder, from the **daily
 * reserve** — words custom puzzles never draw (`Entry.dailyReserve`), so a daily is made of words
 * nobody has been shown. Custom puzzles eat never-served words first, which is why the reserve
 * has to be set aside rather than found at build time.
 *
 * `/[lang]/daily` is one URL whose puzzle changes at 00:00 UTC; yesterday's answers are on it too.
 */
export const DAILY_FORMAT = 'classic' as const
export const DAILY_SIZE = 'medium' as const
export const DAILY_DIFFICULTY: Difficulty = 2

/** Words the reserve aims to hold: ~144 candidates for one layout plus about two weeks of dailies. */
const RESERVE_TARGET = 400
/** Of a language's live words, the most the reserve may hold — a small pool must still serve custom puzzles. */
const RESERVE_MAX_SHARE = 0.3
/**
 * What a thin reserve asks Gemini for: the words of the next two dailies (a medium grid places up
 * to 24). Gemini only on need — the rest of a layout's candidates come from the general pool.
 */
const RESERVE_NEED = 48
/** A thin reserve is topped up with general words, but not with any a daily used within this many days. */
const RECENT_DAILY_DAYS = 365
/** Past dailies listed under "previous days". */
const PREVIOUS_DAYS = 7

const DAY_MS = 24 * 60 * 60 * 1000

/** The UTC day `offset` days from now, `YYYY-MM-DD`. */
export const utcDay = (offset = 0, now = new Date()): string => new Date(now.getTime() + offset * DAY_MS).toISOString().slice(0, 10)

/**
 * Tops the reserve up from never-served words (no Gemini), within its share of the pool. Only when
 * it would still hold fewer than the next two dailies' words does the gap go to the refill job — at
 * free play's priority, so dailies never crowd out paying players' gaps. New words land in the
 * general pool and the next top-up moves them in. Returns that gap.
 */
export const fillReserve = async (locale: Locale): Promise<number> => {
  const [held, live] = await Promise.all([
    prisma.entry.count({ where: { locale, retiredAt: null, dailyReserve: true } }),
    prisma.entry.count({ where: { locale, retiredAt: null } }),
  ])
  const target = Math.min(RESERVE_TARGET, Math.floor(live * RESERVE_MAX_SHARE))
  const wanted = target - held
  if (wanted <= 0) return 0

  const moved = await prisma.$executeRaw`
    UPDATE "Entry" SET "dailyReserve" = true WHERE id IN (
      SELECT e.id FROM "Entry" e
      WHERE e.locale = ${locale} AND e."retiredAt" IS NULL AND NOT e."dailyReserve" AND e."servedCount" = 0
        AND e.difficulty BETWEEN 1 AND ${DAILY_DIFFICULTY} AND e.length BETWEEN ${minWordLength(locale)} AND 13
        AND EXISTS (SELECT 1 FROM "Clue" k WHERE k."entryId" = e.id AND k.style = 'full' AND k."retiredAt" IS NULL)
      ORDER BY random()
      LIMIT ${wanted}
    )
  `
  const gap = RESERVE_NEED - held - moved
  if (gap > 0) {
    await recordShortfall(locale, 'any', DAILY_DIFFICULTY, gap)
    requestRefill()
  }
  return Math.max(gap, 0)
}

/** Entry ids placed in this language's dailies of the last year: a thin reserve's top-up skips them. */
const recentDailyWords = async (locale: Locale, date: string): Promise<number[]> => {
  const since = utcDay(-RECENT_DAILY_DAYS, new Date(`${date}T00:00:00Z`))
  const rows = await prisma.$queryRaw<{ id: number }[]>`
    SELECT DISTINCT unnest(p."entryIds") AS id FROM "DailyPuzzle" d JOIN "Puzzle" p ON p.id = d."puzzleId"
    WHERE d.locale = ${locale} AND d.date >= ${since}
  `
  return rows.map(({ id }) => id)
}

/** Builds the day's daily unless it exists; the stored one wins a race (one per locale and date). */
export const buildDaily = async (locale: Locale, date: string): Promise<string> => {
  const existing = await prisma.dailyPuzzle.findUnique({ where: { locale_date: { locale, date } }, select: { puzzleId: true } })
  if (existing) return existing.puzzleId

  await fillReserve(locale)
  try {
    const puzzle = await buildPuzzle({
      locale,
      format: DAILY_FORMAT,
      topic: 'any',
      difficulty: DAILY_DIFFICULTY,
      size: DAILY_SIZE,
      exclude: await recentDailyWords(locale, date),
      daily: { date },
    })
    return puzzle.id
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const stored = await prisma.dailyPuzzle.findUniqueOrThrow({ where: { locale_date: { locale, date } }, select: { puzzleId: true } })
      return stored.puzzleId
    }
    throw error
  }
}

/** A word of today's daily, as the page prints it: no answer. */
export type DailyClue = { number: number; dir: Direction; clue: string; length: number }

/** A word of yesterday's daily, with its answer as cell tokens (`ու` is one). */
export type DailyAnswer = { number: number; dir: Direction; clue: string; answer: string[] }

export type DailyView = {
  /** Today, UTC. */
  date: string
  /** Today's puzzle without its solution — what the page server-renders. The board loads the full puzzle by id. */
  today: { id: string; date: string; width: number; height: number; cells: CellView[]; words: DailyClue[] } | null
  yesterday: { id: string; date: string; words: DailyAnswer[] } | null
  /** The dailies before today, newest first. */
  previous: { id: string; date: string }[]
}

const byNumber = <T extends { number: number; dir: Direction }>(a: T, b: T) =>
  a.dir === b.dir ? a.number - b.number : a.dir === 'across' ? -1 : 1

const answerOf = (puzzle: PuzzleView, word: PuzzleView['words'][number]): string[] =>
  Array.from({ length: word.length }, (_, index) => {
    const row = word.row + (word.dir === 'down' ? index : 0)
    const col = word.col + (word.dir === 'across' ? index : 0)
    return puzzle.solution[row * puzzle.width + col] ?? ''
  })

/** Today's daily (no answers), yesterday's (with answers) and the days before. Never tomorrow's. */
export const getDailyView = async (locale: Locale, now = new Date()): Promise<DailyView> => {
  const today = utcDay(0, now)
  const yesterday = utcDay(-1, now)
  const rows = await prisma.dailyPuzzle.findMany({
    where: { locale, date: { lte: today } },
    orderBy: { date: 'desc' },
    take: PREVIOUS_DAYS + 1,
    select: { date: true, puzzle: { select: { id: true, data: true } } },
  })
  const view = (row: (typeof rows)[number]) => ({ id: row.puzzle.id, ...(row.puzzle.data as Omit<PuzzleView, 'id' | 'createdAt'>) }) as PuzzleView

  const todayRow = rows.find((row) => row.date === today)
  const yesterdayRow = rows.find((row) => row.date === yesterday)
  const todayPuzzle = todayRow ? view(todayRow) : null
  const yesterdayPuzzle = yesterdayRow ? view(yesterdayRow) : null

  return {
    date: today,
    today: todayPuzzle && {
      id: todayPuzzle.id,
      date: today,
      width: todayPuzzle.width,
      height: todayPuzzle.height,
      cells: todayPuzzle.cells,
      words: todayPuzzle.words
        .map(({ number, dir, clue, length }) => ({ number: number ?? 0, dir, clue, length }))
        .sort(byNumber),
    },
    yesterday: yesterdayPuzzle && {
      id: yesterdayPuzzle.id,
      date: yesterday,
      words: yesterdayPuzzle.words
        .map((word) => ({ number: word.number ?? 0, dir: word.dir, clue: word.clue, answer: answerOf(yesterdayPuzzle, word) }))
        .sort(byNumber),
    },
    previous: rows.filter((row) => row.date < today).map((row) => ({ id: row.puzzle.id, date: row.date })),
  }
}
