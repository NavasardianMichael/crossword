import { Router } from 'express'
import { fail, ok } from '../lib/api-response.js'
import { isLocale } from '../lib/puzzle.js'
import { asyncHandler } from '../middleware/error.js'
import { getDailyView } from '../services/daily.js'

export const dailyRouter = Router()

/**
 * GET /daily/:locale — today's daily crossword (clues and grid shape, no answers), yesterday's
 * with its answers, and the days before. Changes at 00:00 UTC, so caches keep it briefly.
 */
dailyRouter.get(
  '/:locale',
  asyncHandler(async (req, res) => {
    const { locale } = req.params
    if (!isLocale(locale)) return fail(res, 'Unsupported locale', 400, 400)
    res.setHeader('Cache-Control', 'public, max-age=300')
    return ok(res, await getDailyView(locale))
  })
)
