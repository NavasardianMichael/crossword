import { Router } from 'express'
import { fail, ok } from '../lib/api-response.js'
import {
  isDifficulty,
  isFormat,
  isLocale,
  isReportReason,
  isSize,
  isTopicChoice,
  MAX_EXCLUDE,
} from '../lib/puzzle.js'
import { asIdArray, asInteger, isPuzzleId, reporterKeyFor } from '../lib/request.js'
import { asyncHandler } from '../middleware/error.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { recordResult, reportEntry } from '../services/entryPool.js'
import { buildPuzzle, getPuzzle, puzzleWordRefs } from '../services/puzzleBuilder.js'

export const puzzlesRouter = Router()

/**
 * POST /puzzles — a new puzzle of words this device has not seen (`exclude`: the entry ids it
 * was shown before, newest last). Solutions travel with the puzzle: it is a casual game, so
 * checking happens instantly on the device and a loaded puzzle plays offline.
 */
puzzlesRouter.post(
  '/',
  rateLimit('puzzles', { limit: 12, windowMs: 60_000 }),
  asyncHandler(async (req, res) => {
    const { locale, format, topic, difficulty, size } = req.body ?? {}
    if (!isLocale(locale)) return fail(res, 'Unsupported locale', 400)
    if (!isFormat(format)) return fail(res, 'Unsupported format', 400)
    if (!isTopicChoice(topic)) return fail(res, 'Unsupported topic', 400)
    if (!isDifficulty(difficulty)) return fail(res, 'Unsupported difficulty', 400)
    if (!isSize(size)) return fail(res, 'Unsupported size', 400)

    const exclude = asIdArray(req.body?.exclude, MAX_EXCLUDE)
    const puzzle = await buildPuzzle({ locale, format, topic, difficulty, size, exclude })
    return ok(res, puzzle, 201)
  })
)

/** GET /puzzles/:id — a stored puzzle; immutable, so caches may keep it. */
puzzlesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isPuzzleId(req.params.id)) return fail(res, 'Invalid puzzle id', 400, 400)
    const puzzle = await getPuzzle(req.params.id)
    if (!puzzle) return fail(res, 'Puzzle not found', 404, 404)
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    return ok(res, puzzle)
  })
)

/** POST /puzzles/:id/report — "this clue is wrong" for one word of the puzzle. */
puzzlesRouter.post(
  '/:id/report',
  rateLimit('report', { limit: 20, windowMs: 60 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isPuzzleId(id)) return fail(res, 'Invalid puzzle id', 400, 400)
    const reason = req.body?.reason
    if (!isReportReason(reason)) return fail(res, 'Unsupported reason', 400)

    const refs = await puzzleWordRefs(id)
    if (!refs) return fail(res, 'Puzzle not found', 404, 404)
    const wordId = asInteger(req.body?.wordId, 0, refs.entryIds.length - 1)
    if (wordId === undefined) return fail(res, 'Invalid word', 400)

    await reportEntry(refs.entryIds[wordId]!, refs.clueIds[wordId]!, id, reporterKeyFor(req), reason)
    return ok(res, null)
  })
)

/** POST /puzzles/:id/result — how a game went; words revealed often are harder than labelled. */
puzzlesRouter.post(
  '/:id/result',
  rateLimit('result', { limit: 30, windowMs: 60 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isPuzzleId(id)) return fail(res, 'Invalid puzzle id', 400, 400)
    const refs = await puzzleWordRefs(id)
    if (!refs) return fail(res, 'Puzzle not found', 404, 404)

    const revealed = asIdArray(req.body?.revealedWordIds, refs.entryIds.length, 0)
      .map((wordId) => refs.entryIds[wordId])
      .filter((entryId): entryId is number => entryId !== undefined)
    await recordResult(id, req.body?.solved === true, revealed)
    return ok(res, null)
  })
)
