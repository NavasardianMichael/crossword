import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { getBillingStatusAPI } from '@api/billing/main'
import { appendSelectors } from '@store/appendSelectors'
import { reportError } from '@helpers/reportError'
import type { BillingActions, BillingState } from './types'

const initialState: BillingState = { status: null }

/** Only the latest refresh may write: a slow answer from before a sign-in must not win. */
let latestRefresh = 0

export const useBillingStoreBase = create<BillingState & BillingActions>()(
  immer(
    combine(initialState, (set): BillingActions => ({
      refresh: async () => {
        const request = ++latestRefresh
        try {
          const status = await getBillingStatusAPI()
          if (request === latestRefresh) {
            set((state) => {
              state.status = status
            })
          }
          return status
        } catch (error) {
          reportError(error, 'billing:status', { silent: true })
          return null
        }
      },
    }))
  )
)

export const useBillingStore = appendSelectors(useBillingStoreBase)
