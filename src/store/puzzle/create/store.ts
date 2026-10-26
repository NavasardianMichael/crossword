import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createPuzzleAPI } from '@api/puzzles/main'
import { appendSelectors } from '@store/appendSelectors'
import { STORAGE_KEYS } from '@constants/app'
import { isDifficulty, isFormat, isSize, isTopicChoice, type Locale, type PuzzleView } from '@constants/puzzle'
import { trackEvent } from '@helpers/analytics'
import { hasQueued, putQueued, savePuzzle, takeQueued } from '@helpers/offline/db'
import { addSeen, readSeen } from '@helpers/puzzle/seen'
import { reportError } from '@helpers/reportError'
import { readJson, writeJson } from '@helpers/storage'
import type { CreateActions, CreateState, GeneratorOptions } from './types'

const DEFAULT_OPTIONS: GeneratorOptions = { format: 'classic', topic: 'any', difficulty: 1, size: 'medium' }

const initialState: CreateState = { options: DEFAULT_OPTIONS, isPending: false, error: null }

/** Prefetching waits until the page has settled, so it never competes with the puzzle being opened. */
const PREFETCH_DELAY_MS = 6000

const queueKey = (locale: Locale, { format, topic, difficulty, size }: GeneratorOptions) =>
  `${locale}:${format}:${topic}:${difficulty}:${size}`

/** Only the latest request may write: a double tap on "new puzzle" fires two. */
let latestRequest = 0

/** Every puzzle that reaches the device: its words become seen, and it is kept for offline play. */
const receive = async (puzzle: PuzzleView): Promise<void> => {
  addSeen(
    puzzle.locale,
    puzzle.words.map(({ entryId }) => entryId)
  )
  await savePuzzle(puzzle)
}

/**
 * Fetches the next puzzle of the same settings in the background, so "new puzzle" opens
 * instantly — and offline. Its words count as seen on arrival, like any puzzle's.
 */
const prefetch = (locale: Locale, options: GeneratorOptions) => {
  setTimeout(async () => {
    try {
      const key = queueKey(locale, options)
      if (!navigator.onLine || (await hasQueued(key))) return
      const puzzle = await createPuzzleAPI({ locale, ...options, exclude: readSeen(locale) })
      await receive(puzzle)
      await putQueued(key, puzzle)
    } catch (error) {
      reportError(error, 'puzzle:prefetch', { silent: true })
    }
  }, PREFETCH_DELAY_MS)
}

export const useCreateStoreBase = create<CreateState & CreateActions>()(
  immer(
    combine(
      initialState,
      (set, get): CreateActions => ({
        hydrateOptions: () => {
          const stored = readJson<Partial<GeneratorOptions>>(STORAGE_KEYS.generator, {})
          set((state) => {
            state.options = {
              format: isFormat(stored.format) ? stored.format : DEFAULT_OPTIONS.format,
              topic: isTopicChoice(stored.topic) ? stored.topic : DEFAULT_OPTIONS.topic,
              difficulty: isDifficulty(stored.difficulty) ? stored.difficulty : DEFAULT_OPTIONS.difficulty,
              size: isSize(stored.size) ? stored.size : DEFAULT_OPTIONS.size,
            }
          })
        },

        setOptions: (options) => {
          set((state) => {
            state.options = { ...state.options, ...options }
          })
          writeJson(STORAGE_KEYS.generator, get().options)
        },

        createPuzzle: async (locale, overrides) => {
          if (overrides) useCreateStoreBase.getState().setOptions(overrides)
          const options = get().options
          const request = ++latestRequest
          set((state) => {
            state.isPending = true
            state.error = null
          })

          try {
            const queued = await takeQueued(queueKey(locale, options))
            const puzzle = queued ?? (await createPuzzleAPI({ locale, ...options, exclude: readSeen(locale) }))
            if (!queued) await receive(puzzle)
            trackEvent('puzzle_created', { locale, ...options, prefetched: Boolean(queued) })
            prefetch(locale, options)
            return request === latestRequest ? puzzle : null
          } catch (error) {
            if (request === latestRequest) {
              set((state) => {
                state.error = error
              })
            }
            return null
          } finally {
            if (request === latestRequest) {
              set((state) => {
                state.isPending = false
              })
            }
          }
        },
      })
    )
  )
)

export const useCreateStore = appendSelectors(useCreateStoreBase)
