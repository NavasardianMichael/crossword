import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { sendResultAPI } from '@api/puzzles/main'
import { appendSelectors } from '@store/appendSelectors'
import { foldTyped, mergeTyped } from '@constants/alphabet'
import { STORAGE_KEYS } from '@constants/app'
import { trackEvent } from '@helpers/analytics'
import { saveProgress } from '@helpers/offline/db'
import {
  checkCells,
  hasMark,
  isSolved,
  isWordFull,
  letterCells,
  MARK_LOCKED,
  MARK_WRONG,
  revealCells,
} from '@helpers/puzzle/check'
import {
  activeWord,
  afterType,
  edgeOfWord,
  firstEmptyOfWord,
  initialCursor,
  moveCursor,
  nextWord,
  previousInWord,
  selectCell,
  toggleDirection,
} from '@helpers/puzzle/cursor'
import { buildModel } from '@helpers/puzzle/model'
import { reportError } from '@helpers/reportError'
import { readJson, writeJson } from '@helpers/storage'
import type { PlayActions, PlaySettings, PlayState, Scope } from './types'

const DEFAULT_SETTINGS: PlaySettings = { autoCheck: false, skipFilled: true }

const initialState: PlayState = {
  puzzle: null,
  model: null,
  status: 'idle',
  entries: [],
  marks: [],
  cursor: { cell: 0, dir: 'across' },
  lastTyped: null,
  elapsedMs: 0,
  resumedAt: null,
  checks: 0,
  reveals: 0,
  revealedWordIds: [],
  completedWord: null,
  announcement: null,
  settings: DEFAULT_SETTINGS,
}

const SAVE_DEBOUNCE_MS = 400
let saveTimer: ReturnType<typeof setTimeout> | undefined
let announcementId = 0

export const elapsedOf = (state: Pick<PlayState, 'elapsedMs' | 'resumedAt'>, now = Date.now()): number =>
  state.elapsedMs + (state.resumedAt ? now - state.resumedAt : 0)

/**
 * One puzzle being played. Every rule (where the cursor goes, what counts as a letter, what a
 * check marks) lives in pure helpers; this store sequences them, keeps the clock, saves
 * progress to the device and notices the solve.
 */
export const usePlayStoreBase = create<PlayState & PlayActions>()(
  immer(
    combine(initialState, (set, get): PlayActions => {
      const save = () => {
        const state = get()
        if (!state.puzzle) return
        void saveProgress({
          puzzleId: state.puzzle.id,
          entries: [...state.entries],
          marks: [...state.marks],
          cursor: { ...state.cursor },
          elapsedMs: elapsedOf(state),
          status: state.status === 'solved' ? 'solved' : 'playing',
          checks: state.checks,
          reveals: state.reveals,
          revealedWordIds: [...state.revealedWordIds],
          updatedAt: Date.now(),
        })
      }

      const scheduleSave = () => {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(save, SAVE_DEBOUNCE_MS)
      }

      /** Called after every write: completes the solve when the last letter is right. */
      const settle = () => {
        const state = get()
        if (state.status === 'playing' && state.puzzle && isSolved(state.puzzle, state.entries)) {
          const elapsedMs = elapsedOf(state)
          set((draft) => {
            draft.status = 'solved'
            draft.elapsedMs = elapsedMs
            draft.resumedAt = null
            draft.announcement = { id: ++announcementId, key: 'solved', values: { seconds: Math.round(elapsedMs / 1000) } }
          })
          const { puzzle, revealedWordIds, reveals } = get()
          trackEvent('puzzle_solved', { locale: puzzle!.locale, format: puzzle!.format, seconds: Math.round(elapsedMs / 1000), reveals })
          sendResultAPI({ puzzleId: puzzle!.id, solved: true, revealedWordIds: [...revealedWordIds] }).catch((error: unknown) =>
            reportError(error, 'puzzle:result', { silent: true })
          )
          clearTimeout(saveTimer)
          save()
          return
        }
        scheduleSave()
      }

      const scopeCells = (scope: Scope): number[] => {
        const { puzzle, model, cursor } = get()
        if (!puzzle || !model) return []
        if (scope === 'cell') return [cursor.cell]
        if (scope === 'word') return [...model.wordCells[activeWord(model, cursor)]!]
        return letterCells(puzzle)
      }

      return {
        start: (puzzle, progress) => {
          clearTimeout(saveTimer)
          const model = buildModel(puzzle)
          const size = puzzle.width * puzzle.height
          const solved = progress?.status === 'solved'
          set((state) => {
            state.puzzle = puzzle
            state.model = model
            state.status = solved ? 'solved' : 'playing'
            state.entries = progress?.entries.length === size ? progress.entries : new Array<string>(size).fill('')
            state.marks = progress?.marks.length === size ? progress.marks : new Array<number>(size).fill(0)
            state.cursor = progress?.cursor ?? initialCursor(puzzle, model)
            state.lastTyped = null
            state.elapsedMs = progress?.elapsedMs ?? 0
            state.resumedAt = solved ? null : Date.now()
            state.checks = progress?.checks ?? 0
            state.reveals = progress?.reveals ?? 0
            state.revealedWordIds = progress?.revealedWordIds ?? []
            state.completedWord = null
            state.announcement = null
          })
          if (!progress) save()
        },

        type: (key) => {
          const { puzzle, model, status, lastTyped, entries, cursor, marks, settings } = get()
          if (!puzzle || !model || status !== 'playing') return false

          // Armenian ո then ւ: one letter, completed in the cell the ո went into.
          if (lastTyped !== null && entries[lastTyped] && !hasMark(marks, lastTyped, MARK_LOCKED)) {
            const merged = mergeTyped(entries[lastTyped]!, key, puzzle.locale)
            if (merged) {
              set((state) => {
                state.entries[lastTyped] = merged
                state.lastTyped = null
                const wrong = settings.autoCheck && merged !== puzzle.solution[lastTyped]
                state.marks[lastTyped] = wrong ? state.marks[lastTyped]! | MARK_WRONG : state.marks[lastTyped]! & ~MARK_WRONG
              })
              settle()
              return true
            }
          }

          const token = foldTyped(key, puzzle.locale)
          if (!token) return false
          const word = activeWord(model, cursor)
          const wasFull = isWordFull(entries, model.wordCells[word]!)

          set((state) => {
            const cell = cursor.cell
            if (!hasMark(state.marks, cell, MARK_LOCKED)) {
              state.entries[cell] = token
              const wrong = state.settings.autoCheck && token !== puzzle.solution[cell]
              state.marks[cell] = wrong ? state.marks[cell]! | MARK_WRONG : state.marks[cell]! & ~MARK_WRONG
            }
            state.lastTyped = cell
            state.completedWord = !wasFull && isWordFull(state.entries, model.wordCells[word]!) ? word : null
            state.cursor = afterType(puzzle, model, state.entries, cursor, state.settings.skipFilled)
          })
          settle()
          return true
        },

        erase: () => {
          const { puzzle, model, status, entries, cursor, marks } = get()
          if (!puzzle || !model || status !== 'playing') return
          const target = entries[cursor.cell] && !hasMark(marks, cursor.cell, MARK_LOCKED) ? cursor : previousInWord(puzzle, model, cursor)
          set((state) => {
            if (!hasMark(state.marks, target.cell, MARK_LOCKED)) {
              state.entries[target.cell] = ''
              state.marks[target.cell] = 0
            }
            state.cursor = target
            state.lastTyped = null
            state.completedWord = null
          })
          scheduleSave()
        },

        deleteCell: () => {
          const { status, cursor, marks } = get()
          if (status !== 'playing' || hasMark(marks, cursor.cell, MARK_LOCKED)) return
          set((state) => {
            state.entries[cursor.cell] = ''
            state.marks[cursor.cell] = 0
            state.lastTyped = null
          })
          scheduleSave()
        },

        move: (key) => {
          const { puzzle, model, cursor } = get()
          if (!puzzle || !model) return
          set((state) => {
            state.cursor = moveCursor(puzzle, model, cursor, key)
            state.lastTyped = null
          })
        },

        select: (cell) => {
          const { model, cursor } = get()
          if (!model) return
          set((state) => {
            state.cursor = selectCell(model, cursor, cell)
            state.lastTyped = null
          })
        },

        selectWord: (wordId) => {
          const { puzzle, model, entries } = get()
          if (!puzzle || !model || !puzzle.words[wordId]) return
          set((state) => {
            state.cursor = firstEmptyOfWord(puzzle, model, entries, wordId)
            state.lastTyped = null
          })
        },

        toggleDirection: () => {
          const { model, cursor } = get()
          if (!model) return
          set((state) => {
            state.cursor = toggleDirection(model, cursor)
          })
        },

        nextWord: (back = false) => {
          const { puzzle, model, entries, cursor } = get()
          if (!puzzle || !model) return
          set((state) => {
            state.cursor = nextWord(puzzle, model, entries, cursor, back)
            state.lastTyped = null
          })
        },

        jumpToEdge: (end) => {
          const { puzzle, model, cursor } = get()
          if (!puzzle || !model) return
          set((state) => {
            state.cursor = edgeOfWord(puzzle, model, cursor, end)
          })
        },

        check: (scope) => {
          const { puzzle, status } = get()
          if (!puzzle || status !== 'playing') return
          const cells = scopeCells(scope)
          set((state) => {
            const wrong = checkCells(puzzle, state.entries, state.marks, cells)
            state.checks++
            state.announcement = wrong
              ? { id: ++announcementId, key: 'checked', values: { count: wrong } }
              : { id: ++announcementId, key: 'allCorrect' }
          })
          scheduleSave()
        },

        reveal: (scope) => {
          const { puzzle, model, status } = get()
          if (!puzzle || !model || status !== 'playing') return
          const cells = scopeCells(scope)
          set((state) => {
            const count = revealCells(puzzle, state.entries, state.marks, cells)
            if (!count) return
            state.reveals += count
            const touched = new Set(state.revealedWordIds)
            for (const cell of cells) {
              if (model.across[cell]! >= 0) touched.add(model.across[cell]!)
              if (model.down[cell]! >= 0) touched.add(model.down[cell]!)
            }
            state.revealedWordIds = [...touched]
            state.announcement = { id: ++announcementId, key: 'revealed', values: { count } }
          })
          settle()
        },

        clearWrong: () => {
          set((state) => {
            state.marks.forEach((mark, cell) => {
              if (mark & MARK_WRONG) {
                state.entries[cell] = ''
                state.marks[cell] = 0
              }
            })
          })
          scheduleSave()
        },

        pause: () => {
          const state = get()
          if (state.status !== 'playing' || !state.resumedAt) return
          const elapsedMs = elapsedOf(state)
          set((draft) => {
            draft.elapsedMs = elapsedMs
            draft.resumedAt = null
          })
          scheduleSave()
        },

        resume: () => {
          const { status, resumedAt } = get()
          if (status !== 'playing' || resumedAt) return
          set((state) => {
            state.resumedAt = Date.now()
          })
        },

        setSetting: (key, value) => {
          set((state) => {
            state.settings[key] = value
          })
          writeJson(STORAGE_KEYS.settings, get().settings)
        },

        hydrateSettings: () => {
          const stored = readJson<Partial<PlaySettings>>(STORAGE_KEYS.settings, {})
          set((state) => {
            state.settings = { ...DEFAULT_SETTINGS, ...stored }
          })
        },

        flush: () => {
          clearTimeout(saveTimer)
          usePlayStoreBase.getState().pause()
          save()
        },
      }
    })
  )
)

export const usePlayStore = appendSelectors(usePlayStoreBase)
