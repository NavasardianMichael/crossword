import axios from 'axios'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createPuzzleAPI } from '@api/puzzles/main'
import { appendSelectors } from '@store/appendSelectors'
import { useBillingStoreBase } from '@store/billing/store'
import { STORAGE_KEYS } from '@constants/app'
import { isDifficulty, isFormat, isSize, isTopicChoice, type PuzzleView } from '@constants/puzzle'
import { trackEvent } from '@helpers/analytics'
import { billingRefusal } from '@helpers/billing'
import { savePuzzle } from '@helpers/offline/db'
import { addSeen, readSeen } from '@helpers/puzzle/seen'
import { readJson, writeJson } from '@helpers/storage'
import type { CreateActions, CreateState, GeneratorOptions } from './types'

const DEFAULT_OPTIONS: GeneratorOptions = { format: 'classic', topic: 'any', difficulty: 1, size: 'medium' }

const initialState: CreateState = { options: DEFAULT_OPTIONS, isPending: false, error: null }

/** Only the latest request may write. A newer create aborts the previous one. */
let latestRequest = 0

/** The create the player is waiting on, so Cancel can abort that request. */
let inflight: AbortController | null = null

const isAbort = (signal: AbortSignal, error: unknown): boolean =>
  signal.aborted || axios.isCancel(error) || (error instanceof DOMException && error.name === 'AbortError')

/** Every puzzle that reaches the device: its words become seen, and it is kept for offline play. */
const receive = async (puzzle: PuzzleView): Promise<void> => {
  addSeen(
    puzzle.locale,
    puzzle.words.map(({ entryId }) => entryId)
  )
  await savePuzzle(puzzle)
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

        cancelCreate: () => {
          inflight?.abort()
        },

        dismissError: () => {
          set((state) => {
            state.error = null
          })
        },

        createPuzzle: async (locale, overrides) => {
          if (overrides) useCreateStoreBase.getState().setOptions(overrides)
          const options = get().options
          const request = ++latestRequest
          inflight?.abort()
          const controller = new AbortController()
          inflight = controller
          const { signal } = controller
          set((state) => {
            state.isPending = true
            state.error = null
          })

          try {
            const puzzle = await createPuzzleAPI({ locale, ...options, exclude: readSeen(locale) }, signal)
            // It arrived, so it was paid for: keep it (in the history) even if the player cancelled just now.
            await receive(puzzle)
            void useBillingStoreBase.getState().refresh()
            if (signal.aborted || request !== latestRequest) return null
            trackEvent('puzzle_created', { locale, ...options })
            return puzzle
          } catch (error) {
            const refusal = billingRefusal(error)
            if (refusal) {
              void useBillingStoreBase.getState().refresh()
              trackEvent('puzzle_refused', { locale, reason: refusal })
            }
            if (!isAbort(signal, error) && request === latestRequest) {
              set((state) => {
                state.error = error
              })
            }
            return null
          } finally {
            if (inflight === controller) inflight = null
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
