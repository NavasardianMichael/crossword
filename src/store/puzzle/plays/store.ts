import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { syncPlaysAPI } from '@api/puzzles/main'
import type { PlayReport } from '@api/puzzles/types'
import { appendSelectors } from '@store/appendSelectors'
import { useAuthStoreBase } from '@store/auth/store'
import { STORAGE_KEYS } from '@constants/app'
import { MAX_SYNCED_PLAYS } from '@constants/puzzle'
import { listGamesSince } from '@helpers/offline/db'
import { wordStates } from '@helpers/puzzle/check'
import { buildModel } from '@helpers/puzzle/model'
import { reportError } from '@helpers/reportError'
import { readJson, writeJson } from '@helpers/storage'
import type { PlaysActions, PlaysState } from './types'

const SYNC_DEBOUNCE_MS = 5_000

/**
 * The account's seen-list, fed from this device: every puzzle it received or played, with how
 * each word went (`wordStates`), goes to `POST /puzzles/plays` while someone is signed in, so
 * the server leaves those words out on every device of the account. Games played as a guest
 * go too, the first time an account signs in here.
 *
 * Only games changed since the last report are read (`crossword:plays-synced:<account>`), and
 * a game whose word states have not changed since they were sent is skipped. A failed report
 * moves nothing forward, so the next one carries it again.
 */
let timer: ReturnType<typeof setTimeout> | undefined
let running: Promise<void> | null = null
let again = false
/** Per puzzle, the account and states the server last accepted. */
const sent = new Map<string, string>()

const report = async (): Promise<number | null> => {
  const userId = useAuthStoreBase.getState().user?.id
  if (!userId) return null
  const key = `${STORAGE_KEYS.playsSyncedPrefix}${userId}`
  const startedAt = Date.now()
  const since = readJson<unknown>(key, 0)
  const games = await listGamesSince(typeof since === 'number' ? since : 0)

  const plays: (PlayReport & { signature: string })[] = []
  for (const { puzzle, progress } of games) {
    const states =
      progress && progress.entries.length === puzzle.cells.length
        ? wordStates(puzzle, buildModel(puzzle).wordCells, progress.entries, progress.marks)
        : new Array<number>(puzzle.words.length).fill(0)
    const signature = `${userId}:${states.join('')}`
    if (sent.get(puzzle.id) !== signature) plays.push({ id: puzzle.id, states, signature })
  }

  try {
    for (let start = 0; start < plays.length; start += MAX_SYNCED_PLAYS) {
      const batch = plays.slice(start, start + MAX_SYNCED_PLAYS)
      await syncPlaysAPI({ plays: batch.map(({ id, states }) => ({ id, states })) })
      for (const { id, signature } of batch) sent.set(id, signature)
    }
    writeJson(key, startedAt)
    return startedAt
  } catch (error) {
    reportError(error, 'puzzle:plays', { silent: true })
    return null
  }
}

export const usePlaysStoreBase = create<PlaysState & PlaysActions>()(
  immer(
    combine({ syncedAt: null } as PlaysState, (set): PlaysActions => ({
      sync: () => {
        clearTimeout(timer)
        // One report at a time; a call during one runs another right after it.
        if (running) {
          again = true
          return running
        }
        running = (async () => {
          do {
            again = false
            const syncedAt = await report()
            if (syncedAt) {
              set((state) => {
                state.syncedAt = syncedAt
              })
            }
          } while (again)
        })().finally(() => {
          running = null
        })
        return running
      },

      schedule: () => {
        clearTimeout(timer)
        timer = setTimeout(() => void usePlaysStoreBase.getState().sync(), SYNC_DEBOUNCE_MS)
      },
    }))
  )
)

export const usePlaysStore = appendSelectors(usePlaysStoreBase)
