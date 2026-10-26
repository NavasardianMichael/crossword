import { Router } from 'express'
import { fail, ok } from '../lib/api-response.js'
import { isLocale, isTopic } from '../lib/puzzle.js'
import { asyncHandler } from '../middleware/error.js'
import { topicSamples } from '../services/entryPool.js'

export const samplesRouter = Router()

/** GET /samples?locale=&topic= — a few words and clues for a topic landing page (rendered for crawlers). */
samplesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { locale, topic } = req.query
    if (!isLocale(locale) || !isTopic(topic)) return fail(res, 'Unsupported locale or topic', 400)
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    return ok(res, await topicSamples(locale, topic))
  })
)
