import { randomBytes, randomInt } from 'node:crypto'
import {
  type Candidate,
  clueOptions,
  type ClueStyle,
  drawCandidates,
  generateIntoPool,
  recordDemand,
} from './entryPool.js'
import { isGiveaway } from './entryValidation.js'
import { isGeminiConfigured } from '../config.js'
import { toCells } from '../lib/alphabet.js'
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
import { HttpError } from '../middleware/error.js'

/**
 * Building one puzzle: draw unseen candidates → lay them out → pick a clue per placed word →
 * store the snapshot. Only words actually placed count as served.
 *
 * When the pool cannot fill the request, the builder degrades rather than repeats: one inline
 * Gemini batch, then any topic, then a smaller grid — and only then `503 pool_exhausted`.
 */

export type BuildRequest = {
  locale: Locale
  format: PuzzleFormat
  topic: TopicChoice
  difficulty: Difficulty
  size: PuzzleSize
  exclude: readonly number[]
}

/** Wall-clock budget per layout: it runs on the event loop. */
const LAYOUT_BUDGET_MS = 250
const LAYOUT_ATTEMPTS = 40
/** On-topic share of the candidates; the rest is everyday glue from `general`. */
const THEME_SHARE = 0.6
/** Inline generations running at once, across all requests — the rest wait for the refill job. */
const MAX_INLINE_GENERATIONS = 2
let inlineGenerations = 0

const PUZZLE_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const newPuzzleId = (): string =>
  [...randomBytes(10)].map((byte) => PUZZLE_ID_ALPHABET[byte % PUZZLE_ID_ALPHABET.length]).join('')

const candidateCount = (format: PuzzleFormat, maxWords: number): number =>
  format === 'classic' ? Math.min(300, Math.max(120, maxWords * 6)) : Math.min(500, Math.max(200, maxWords * 10))

const draw = async (request: BuildRequest, topic: TopicChoice, count: number, maxLength: number): Promise<Candidate[]> => {
  const style: ClueStyle = request.format === 'classic' ? 'full' : 'short'
  const base = { locale: request.locale, difficulty: request.difficulty, style, exclude: request.exclude, maxLength }
  if (topic === 'any' || topic === 'general') return drawCandidates({ ...base, topic, count })

  const themed = await drawCandidates({ ...base, topic, count: Math.ceil(count * THEME_SHARE) })
  const glue = await drawCandidates({
    ...base,
    topic: 'general',
    count: count - themed.length,
    exclude: [...request.exclude, ...themed.map(({ id }) => id)],
  })
  return [...themed, ...glue].sort((a, b) => a.id - b.id)
}

/** One inline batch for a short bucket, when quota and concurrency allow; never throws. */
const topUp = async (request: BuildRequest, topic: TopicChoice): Promise<boolean> => {
  if (!isGeminiConfigured() || inlineGenerations >= MAX_INLINE_GENERATIONS) return false
  inlineGenerations++
  try {
    return (await generateIntoPool(request.locale, topic === 'any' ? 'general' : topic, request.difficulty)) > 0
  } catch (error) {
    console.warn(`[puzzle] inline generation failed for ${request.locale}/${topic}:`, (error as Error).message)
    return false
  } finally {
    inlineGenerations--
  }
}

const smallerSizes = (size: PuzzleSize): PuzzleSize[] => SIZES.slice(0, SIZES.indexOf(size) + 1).reverse()

export const buildPuzzle = async (request: BuildRequest): Promise<PuzzleView> => {
  const topics: TopicChoice[] = request.topic === 'any' ? ['any'] : [request.topic, 'any']
  let urgent = false
  let toppedUp = false

  for (const size of smallerSizes(request.size)) {
    const spec = GRID_SPECS[request.format][size]
    const maxLength = Math.min(MAX_WORD_LENGTH, Math.max(spec.width, spec.height) - (request.format === 'scanword' ? 1 : 0))
    const wanted = candidateCount(request.format, spec.maxWords)

    for (const topic of topics) {
      let candidates = await draw(request, topic, wanted, maxLength)
      if (candidates.length < wanted / 2) {
        urgent = true
        if (!toppedUp) {
          toppedUp = true
          if (await topUp(request, topic)) candidates = await draw(request, topic, wanted, maxLength)
        }
      }
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

      void recordDemand(request.locale, request.topic, request.difficulty, request.exclude.length, urgent).catch(
        (error: unknown) => console.error('[puzzle] demand', error)
      )
      return storePuzzle(request, size, seed, layout, candidates)
    }
  }

  void recordDemand(request.locale, request.topic, request.difficulty, request.exclude.length, true).catch(
    (error: unknown) => console.error('[puzzle] demand', error)
  )
  throw new HttpError(503, 'pool_exhausted', 503)
}

const storePuzzle = async (
  request: BuildRequest,
  size: PuzzleSize,
  seed: number,
  layout: NonNullable<ReturnType<typeof layoutPuzzle>>,
  candidates: readonly Candidate[]
): Promise<PuzzleView> => {
  const placed = layout.words.map(({ word }) => candidates[word]!)
  const style: ClueStyle = request.format === 'classic' ? 'full' : 'short'
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
  const [puzzle] = await prisma.$transaction([
    prisma.puzzle.create({
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
    }),
    prisma.entry.updateMany({ where: { id: { in: entryIds } }, data: { servedCount: { increment: 1 } } }),
    prisma.clue.updateMany({ where: { id: { in: clueIds } }, data: { servedCount: { increment: 1 } } }),
  ])

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
