import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { getMeAPI, loginAPI, logoutAPI, registerAPI, resetPasswordAPI } from '@api/auth/main'
import { appendSelectors } from '@store/appendSelectors'
import { trackEvent } from '@helpers/analytics'
import type { AuthActions, AuthState } from './types'

const initialState: AuthState = { user: null, isResolved: false, isPending: false }

/**
 * Every async action clears `isPending` in a `finally`, and rethrows so the form can show
 * the failure. A rejected request must never leave the buttons stuck.
 */
export const useAuthStoreBase = create<AuthState & AuthActions>()(
  immer(
    combine(initialState, (set): AuthActions => ({
      getMe: async () => {
        try {
          const user = await getMeAPI()
          set((state) => {
            state.user = user
            state.isResolved = true
          })
          return user
        } catch {
          set((state) => {
            state.user = null
            state.isResolved = true
          })
          return null
        }
      },
      login: async (payload) => {
        set((state) => {
          state.isPending = true
        })
        try {
          const user = await loginAPI(payload)
          set((state) => {
            state.user = user
            state.isResolved = true
          })
          trackEvent('login', { method: 'password' })
          return user
        } finally {
          set((state) => {
            state.isPending = false
          })
        }
      },
      register: async (payload) => {
        set((state) => {
          state.isPending = true
        })
        try {
          const result = await registerAPI(payload)
          trackEvent('sign_up', { method: 'password' })
          return result
        } finally {
          set((state) => {
            state.isPending = false
          })
        }
      },
      logout: async () => {
        set((state) => {
          state.isPending = true
        })
        try {
          await logoutAPI()
          set((state) => {
            state.user = null
          })
        } finally {
          set((state) => {
            state.isPending = false
          })
        }
      },
      resetPassword: async (token, password) => {
        set((state) => {
          state.isPending = true
        })
        try {
          const user = await resetPasswordAPI(token, password)
          set((state) => {
            state.user = user
            state.isResolved = true
          })
          return user
        } finally {
          set((state) => {
            state.isPending = false
          })
        }
      },
    }))
  )
)

export const useAuthStore = appendSelectors(useAuthStoreBase)
