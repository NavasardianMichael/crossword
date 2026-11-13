import { type DBSchema, type IDBPDatabase, openDB } from 'idb'
import { IDB_NAME, IDB_VERSION, SAVED_PUZZLES_LIMIT } from '@constants/app'
import type { Direction, PuzzleView } from '@constants/puzzle'
import { reportError } from '@helpers/reportError'

/**
 * The device's own storage, so a started puzzle survives reloads and plays offline:
 * - `puzzles` — every puzzle the device received, keyed by id;
 * - `progress` — the player's letters, marks, cursor and clock per puzzle;
 * - `queue` — no longer read or written: it held prefetched puzzles, and every puzzle is now paid
 *   for when built, so none is built before it is asked for. Kept in the schema of existing databases.
 *
 * Every accessor fails soft: IndexedDB can be missing (old browsers, some private modes) and
 * the game must still run online without it.
 */
export type PuzzleStatus = 'playing' | 'solved'

export type Progress = {
  puzzleId: string
  entries: string[]
  marks: number[]
  cursor: { cell: number; dir: Direction }
  elapsedMs: number
  status: PuzzleStatus
  checks: number
  reveals: number
  revealedWordIds: number[]
  updatedAt: number
}

export type QueuedPuzzle = { key: string; puzzle: PuzzleView; queuedAt: number }

interface CrosswordDB extends DBSchema {
  puzzles: { key: string; value: PuzzleView & { savedAt: number } }
  progress: { key: string; value: Progress; indexes: { updatedAt: number } }
  queue: { key: string; value: QueuedPuzzle }
}

let dbPromise: Promise<IDBPDatabase<CrosswordDB>> | null = null

/**
 * One connection, opened again whenever it is lost: Safari can close it under the page
 * (`terminated`), and a failed open must not leave every later save failing too.
 */
const getDb = (): Promise<IDBPDatabase<CrosswordDB>> | null => {
  if (typeof indexedDB === 'undefined') return null
  dbPromise ??= openDB<CrosswordDB>(IDB_NAME, IDB_VERSION, {
    // Per version, so a database from an older version gains only what it lacks.
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('puzzles', { keyPath: 'id' })
        db.createObjectStore('progress', { keyPath: 'puzzleId' }).createIndex('updatedAt', 'updatedAt')
        db.createObjectStore('queue', { keyPath: 'key' })
      }
    },
    terminated() {
      dbPromise = null
    },
  }).catch((error: unknown) => {
    dbPromise = null
    throw error
  })
  return dbPromise
}

const soft = async <T>(context: string, run: (db: IDBPDatabase<CrosswordDB>) => Promise<T>, fallback: T): Promise<T> => {
  try {
    const db = await getDb()
    return db ? await run(db) : fallback
  } catch (error) {
    reportError(error, `idb:${context}`, { silent: true })
    return fallback
  }
}

export const savePuzzle = (puzzle: PuzzleView) =>
  soft('savePuzzle', (db) => db.put('puzzles', { ...puzzle, savedAt: Date.now() }).then(() => undefined), undefined)

export const loadPuzzle = (id: string) => soft('loadPuzzle', (db) => db.get('puzzles', id), undefined)

export const saveProgress = (progress: Progress) =>
  soft('saveProgress', (db) => db.put('progress', progress).then(() => undefined), undefined)

export const loadProgress = (id: string) => soft('loadProgress', (db) => db.get('progress', id), undefined)

export type SavedGame = { puzzle: PuzzleView; progress: Progress | undefined }

/** Most recently played first, and prunes the rest beyond `SAVED_PUZZLES_LIMIT`. */
export const listSavedGames = () =>
  soft(
    'listSaved',
    async (db) => {
      const puzzles = await db.getAll('puzzles')
      const progress = new Map((await db.getAll('progress')).map((each) => [each.puzzleId, each]))
      const games = puzzles
        .map((puzzle) => ({ puzzle, progress: progress.get(puzzle.id), at: progress.get(puzzle.id)?.updatedAt ?? puzzle.savedAt }))
        .sort((a, b) => b.at - a.at)
      for (const { puzzle } of games.slice(SAVED_PUZZLES_LIMIT)) {
        await db.delete('puzzles', puzzle.id)
        await db.delete('progress', puzzle.id)
      }
      return games.slice(0, SAVED_PUZZLES_LIMIT).map(({ puzzle, progress: saved }): SavedGame => ({ puzzle, progress: saved }))
    },
    [] as SavedGame[]
  )
