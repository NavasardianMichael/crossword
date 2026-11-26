import type { Prisma } from '@prisma/client'
import { randomBytes, randomInt } from 'node:crypto'
import {
  bandTargets,
  type Candidate,
  clueOptions,
  type ClueStyle,
  drawCandidates,
  LENGTH_BANDS,
  type LengthBand,
  lengthBandOf,
  type Readmit,
  READMIT_STEPS,
  recordShortfall,
} from './entryPool.js'
import { isGiveaway } from './entryValidation.js'
import { recordShown } from './plays.js'
import { cellCount, toCells } from '../lib/alphabet.js'
import { LAYOUT_VERSION, layoutPuzzle, type LayoutWord } from '../lib/layout/index.js'
import { prisma } from '../lib/prisma.js'
import {
  type Difficulty,
  GRID_SPECS,
  type Locale,
  MAX_WORD_LENGTH,
  type PuzzleFormat,
  type PuzzleSize,
  type PuzzleView,
  SIZES,
  type TopicChoice,
  type WordView,
} from '../lib/puzzle.js'
import { requestRefill } from '../lib/refillSignal.js'
import { HttpError } from '../middleware/error.js'

/**
 * Building one puzzle: draw unseen candidates → lay them out → pick a clue per placed word →
 * store the snapshot. Only words actually placed count as served. A signed-in player's puzzle
 * joins the account's seen-list (`services/plays.ts`) in the same transaction.
 *
 * A request never waits on Gemini. When the pool cannot fill it, the builder degrades: any topic,
 * then the player's **oldest-seen** words back (`READMIT_STEPS`, never their latest puzzles'),
 * then a smaller grid — and only then `503 pool_exhausted`.
 *
 * After storing, it looks one puzzle ahead: could the same request again be filled with words
 * this player has not seen? When not, the gap is recorded (`recordShortfall`) and the refill job
 * generates exactly that, in the background (`jobs/poolRefill.ts`). Nothing else calls Gemini.
 *
 * A `charge` runs inside the transaction that stores the puzzle, for the size actually built
 * (a smaller grid costs less): when it throws, nothing is stored.
 */

export type BuildRequest = {
  locale: Locale
  format: PuzzleFormat
  topic: TopicChoice
  difficulty: Difficulty
  size: PuzzleSize
  exclude: readonly number[]
  /** The signed-in account: its seen-list is left out as well, and the puzzle joins it. */
  player?: string
  /** Paid for wholly with free credits: its gaps are refilled after paying players', from free play's share. */
  free?: boolean
  /**
   * The daily crossword of this UTC day (`services/daily.ts`): drawn from the daily reserve (topped
   * up with the least-served general words when it is thin), recorded as that day's daily, and
   * its words leave the reserve.
   */
  daily?: { date: string }
}

export type Charge = (tx: Prisma.TransactionClient, puzzleId: string, size: PuzzleSize) => Promise<void>

/** Wall-clock budget per layout: it runs on the event loop. */
const LAYOUT_BUDGET_MS = 250
const LAYOUT_ATTEMPTS = 40
/** On-topic share of the candidates; the rest is everyday glue from `general`. */
const THEME_SHARE = 0.6

const PUZZLE_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const newPuzzleId = (): string =>
  [...randomBytes(10)].map((byte) => PUZZLE_ID_ALPHABET[byte % PUZZLE_ID_ALPHABET.length]).join('')

const candidateCount = (format: PuzzleFormat, maxWords: number): number =>
  format === 'classic' ? Math.min(300, Math.max(120, maxWords * 6)) : Math.min(500, Math.max(200, maxWords * 10))

const maxLengthFor = (format: PuzzleFormat, size: PuzzleSize): number => {
  const spec = GRID_SPECS[format][size]
  return Math.min(MAX_WORD_LENGTH, Math.max(spec.width, spec.height) - (format === 'scanword' ? 1 : 0))
}

const styleOf = (format: PuzzleFormat): ClueStyle => (format === 'classic' ? 'full' : 'short')

/** The buckets a draw of `count` for `topic` takes from: the topic and its everyday glue, or one. */
const shares = (topic: TopicChoice, count: number): { topic: TopicChoice | 'general'; count: number }[] => {
  if (topic === 'any' || topic === 'general') return [{ topic, count }]
  const themed = Math.ceil(count * THEME_SHARE)
  return [
    { topic, count: themed },
    { topic: 'general', count: count - themed },
  ]
}

const draw = async (
  request: BuildRequest,
  topic: TopicChoice,
  count: number,
  maxLength: number,
  readmit?: Readmit
): Promise<Candidate[]> => {
  const base = {
    locale: request.locale,
    difficulty: request.difficulty,
    style: styleOf(request.format),
    player: request.player,
    maxLength,
    readmit,
  }
  if (request.daily) {
    const reserve = await drawCandidates({ ...base, topic, count, exclude: request.exclude, pool: 'daily' })
    if (reserve.length >= count) return reserve
    // A thin reserve: the least-served general words make up the rest (not those of recent dailies).
    const extra = await drawCandidates({ ...base, topic, count: count - reserve.length, exclude: request.exclude })
    return [...reserve, ...extra].sort((a, b) => a.id - b.id)
  }

  const picked: Candidate[] = []
  for (const share of shares(topic, count)) {
    const exclude = [...request.exclude, ...picked.map(({ id }) => id)]
    picked.push(...(await drawCandidates({ ...base, topic: share.topic, count: share.count, exclude })))
  }
  // Sorted, so a layout's seed alone decides it — SQL's random() order does not leak in.
  return picked.sort((a, b) => a.id - b.id)
}

const smallerSizes = (size: PuzzleSize): PuzzleSize[] => SIZES.slice(0, SIZES.indexOf(size) + 1).reverse()

export const buildPuzzle = async (request: BuildRequest, charge?: Charge): Promise<PuzzleView> => {
  const topics: TopicChoice[] = request.topic === 'any' ? ['any'] : [request.topic, 'any']
  // Readmitting only makes sense for a player's own seen-list; a daily has none.
  const steps: (Readmit | undefined)[] = request.daily ? [undefined] : [undefined, ...READMIT_STEPS]

  for (const size of smallerSizes(request.size)) {
    const spec = GRID_SPECS[request.format][size]
    const maxLength = maxLengthFor(request.format, size)
    const wanted = candidateCount(request.format, spec.maxWords)

    for (const readmit of steps) {
      for (const topic of topics) {
        const candidates = await draw(request, topic, wanted, maxLength, readmit)
        if (candidates.length < spec.minWords) continue

        const words: LayoutWord[] = candidates.map(({ answer, topics: entryTopics }) => ({
          cells: toCells(answer, request.locale),
          theme: topic !== 'any' && topic !== 'general' && entryTopics.includes(topic),
        }))
        const seed = randomInt(2 ** 31)
        const layout = layoutPuzzle(request.format, words, spec, {
          seed,
          maxAttempts: LAYOUT_ATTEMPTS,
          deadline: Date.now() + LAYOUT_BUDGET_MS,
        })
        if (!layout) continue

        const puzzle = await storePuzzle(request, size, seed, layout, candidates, charge)
        if (!request.daily) await lookAhead(request, puzzle.words.map(({ entryId }) => entryId))
        return puzzle
      }
    }
  }

  if (!request.daily) {
    const spec = GRID_SPECS[request.format][request.size]
    await noteShortfall(request, request.topic, candidateCount(request.format, spec.maxWords), null)
    requestRefill()
  }
  throw new HttpError(503, 'pool_exhausted', 503)
}

const noteShortfall = (request: BuildRequest, topic: TopicChoice | 'general', shortfall: number, lengthBand: LengthBand | null) =>
  recordShortfall(request.locale, topic, request.difficulty, shortfall, { paid: !request.free, lengthBand }).catch((error: unknown) =>
    console.error('[puzzle] shortfall', error)
  )

/**
 * Could the same request again be filled with words this player has not seen? Draws it as the
 * next request would (the words just placed are seen now) and records each bucket's gap, and the
 * length band most short, so the refill job generates exactly what is missing — before the player
 * asks. A full draw records 0: Gemini is not called.
 */
const lookAhead = async (request: BuildRequest, placed: readonly number[]): Promise<void> => {
  try {
    const spec = GRID_SPECS[request.format][request.size]
    const maxLength = maxLengthFor(request.format, request.size)
    const exclude = [...request.exclude, ...placed]
    let short = false

    for (const share of shares(request.topic, candidateCount(request.format, spec.maxWords))) {
      const found = await drawCandidates({
        locale: request.locale,
        topic: share.topic,
        difficulty: request.difficulty,
        style: styleOf(request.format),
        exclude,
        player: request.player,
        count: share.count,
        maxLength,
      })
      const targets = bandTargets(share.count)
      const perBand = Object.fromEntries(LENGTH_BANDS.map((band) => [band, 0])) as Record<LengthBand, number>
      for (const { answer } of found) perBand[lengthBandOf(cellCount(answer, request.locale))]++
      const gaps = LENGTH_BANDS.map((band) => ({ band, gap: targets[band] - perBand[band] }))
      const shortfall = gaps.reduce((sum, { gap }) => sum + Math.max(gap, 0), 0)
      const worst = gaps.sort((a, b) => b.gap - a.gap)[0]!

      await noteShortfall(request, share.topic, shortfall, shortfall > 0 ? worst.band : null)
      if (shortfall > 0) short = true
    }
    if (short) requestRefill()
  } catch (error) {
    // The puzzle is stored and on its way; a failed look-ahead only delays a refill.
    console.error('[puzzle] look-ahead', error)
  }
}

const storePuzzle = async (
  request: BuildRequest,
  size: PuzzleSize,
  seed: number,
  layout: NonNullable<ReturnType<typeof layoutPuzzle>>,
  candidates: readonly Candidate[],
  charge: Charge | undefined
): Promise<PuzzleView> => {
  const placed = layout.words.map(({ word }) => candidates[word]!)
  const style = styleOf(request.format)
  const options = await clueOptions(
    placed.map(({ id }) => id),
    style,
    request.difficulty
  )

  // A clue may not give away another word of the same grid — that word would solve itself.
  const chosen = placed.map((entry) => {
    const others = placed.filter((other) => other.id !== entry.id)
    const list = options.get(entry.id) ?? []
    return list.find((clue) => !others.some((other) => isGiveaway(other.answer, clue.text, request.locale))) ?? list[0]!
  })

  const words: WordView[] = layout.words.map(({ word: _word, ...rest }, id) => ({
    id,
    ...rest,
    clue: chosen[id]!.text,
    entryId: placed[id]!.id,
  }))

  const id = newPuzzleId()
  const data: Omit<PuzzleView, 'id' | 'createdAt'> = {
    locale: request.locale,
    format: request.format,
    topic: request.topic,
    difficulty: request.difficulty,
    width: layout.width,
    height: layout.height,
    cells: layout.cells,
    words,
    solution: layout.solution,
  }

  const entryIds = placed.map(({ id: entryId }) => entryId)
  const clueIds = chosen.map(({ id: clueId }) => clueId)
  const puzzle = await prisma.$transaction(async (tx) => {
    const created = await tx.puzzle.create({
      data: {
        id,
        locale: request.locale,
        format: request.format,
        topic: request.topic,
        difficulty: request.difficulty,
        size,
        width: layout.width,
        height: layout.height,
        seed,
        layoutVersion: LAYOUT_VERSION,
        data,
        entryIds,
        clueIds,
      },
      select: { createdAt: true },
    })
    await tx.entry.updateMany({ where: { id: { in: entryIds } }, data: { servedCount: { increment: 1 } } })
    await tx.clue.updateMany({ where: { id: { in: clueIds } }, data: { servedCount: { increment: 1 } } })
    await charge?.(tx, id, size)
    if (request.player) await recordShown(tx, request.player, id, request.locale, words.length)
    if (request.daily) {
      await tx.entry.updateMany({ where: { id: { in: entryIds } }, data: { dailyReserve: false } })
      await tx.dailyPuzzle.create({ data: { locale: request.locale, date: request.daily.date, puzzleId: id } })
    }
    return created
  })

  return { id, ...data, createdAt: puzzle.createdAt.toISOString() }
}

export const getPuzzle = async (id: string): Promise<PuzzleView | null> => {
  const puzzle = await prisma.puzzle.findUnique({ where: { id }, select: { data: true, createdAt: true } })
  if (!puzzle) return null
  return { id, ...(puzzle.data as Omit<PuzzleView, 'id' | 'createdAt'>), createdAt: puzzle.createdAt.toISOString() }
}

/** The entry and clue behind word `wordId` of a stored puzzle, for reports and results. */
export const puzzleWordRefs = async (id: string): Promise<{ entryIds: number[]; clueIds: string[] } | null> =>
  prisma.puzzle.findUnique({ where: { id }, select: { entryIds: true, clueIds: true } })
