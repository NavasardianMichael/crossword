import { getPuzzleAPI, getSamplesAPI } from '@api/puzzles/main'
import type { Sample } from '@api/puzzles/types'
import type { Locale, PuzzleView, Topic } from '@constants/puzzle'

/**
 * Data that server-rendered pages embed for crawlers and first paint. Every read degrades to
 * empty: a static page must still build when the API is down (as during `next build` in CI),
 * and ISR fills it in on the next revalidation.
 */
export const fetchTopicSamples = async (locale: Locale, topic: Topic): Promise<Sample[]> => {
  try {
    return await getSamplesAPI({ locale, topic })
  } catch {
    return []
  }
}

/** `null` both for an unknown id and an unreachable API; the page then tries the device's copy. */
export const fetchPuzzle = async (id: string): Promise<PuzzleView | null> => {
  try {
    return await getPuzzleAPI({ id })
  } catch {
    return null
  }
}
