import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { appendSelectors } from '@store/appendSelectors'
import { NavigationProgressActions, NavigationProgressState } from './types'

const initialState: NavigationProgressState = { pending: {} }

/** Fed by `useNavigationPending` (links and router calls), shown by the one `NavigationProgress`. */
export const useNavigationProgressStoreBase = create<NavigationProgressState & NavigationProgressActions>()(
  immer(
    combine(
      initialState,
      (set): NavigationProgressActions => ({
        setPending: (id, pending) => {
          set((state) => {
            if (pending) state.pending[id] = true
            else delete state.pending[id]
          })
        },
      })
    )
  )
)

export const useNavigationProgressStore = appendSelectors(useNavigationProgressStoreBase)
