import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { appendSelectors } from '@store/appendSelectors'
import { ToastActions, ToastState } from './types'

const initialState: ToastState = { toasts: [] }

let nextId = 1

export const useToastStoreBase = create<ToastState & ToastActions>()(
  immer(
    combine(
      initialState,
      (set): ToastActions => ({
        showToast: (toast) => {
          const id = nextId++
          set((state) => {
            state.toasts.push({ id, tone: 'info', ...toast })
            if (state.toasts.length > 3) state.toasts.shift()
          })
          return id
        },
        dismissToast: (id) => {
          set((state) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== id)
          })
        },
      })
    )
  )
)

export const useToastStore = appendSelectors(useToastStoreBase)

/** For non-component code (stores, helpers). */
export const toast = (message: string, tone: 'info' | 'success' | 'error' = 'info') =>
  useToastStoreBase.getState().showToast({ message, tone })
