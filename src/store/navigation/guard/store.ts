import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { appendSelectors } from '@store/appendSelectors'
import { LeaveGuardActions, LeaveGuardState } from './types'

const initialState: LeaveGuardState = { guards: {}, question: null, leaving: false }

export const isGuarded = (guards: Record<string, true>): boolean => Object.keys(guards).length > 0

/** Registered by `useLeaveGuard`, enforced by the one `LeaveGuard` in the app shell. */
export const useLeaveGuardStoreBase = create<LeaveGuardState & LeaveGuardActions>()(
  immer(
    combine(
      initialState,
      (set, get): LeaveGuardActions => ({
        setGuard: (id, active) => {
          const { question } = get()
          set((state) => {
            if (active) state.guards[id] = true
            else delete state.guards[id]
            // Nothing is guarded any more (the puzzle was solved, the page was left): start afresh.
            if (!isGuarded(state.guards)) {
              state.leaving = false
              state.question = null
            }
          })
          // Asked while the puzzle was still unfinished; it has ended since, so the question is moot.
          if (question && !get().question) question.resolve(false)
        },

        ask: () => {
          const { guards, leaving, question } = get()
          if (leaving || !isGuarded(guards)) return Promise.resolve(true)
          // Asked again while the dialog is up (a second Back): the newest question wins.
          question?.resolve(false)
          return new Promise<boolean>((resolve) => {
            set((state) => {
              state.question = { resolve }
            })
          })
        },

        answer: (leave) => {
          const { question } = get()
          set((state) => {
            state.question = null
            if (leave) state.leaving = true
          })
          question?.resolve(leave)
        },
      })
    )
  )
)

export const useLeaveGuardStore = appendSelectors(useLeaveGuardStoreBase)
