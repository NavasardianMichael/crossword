import type { BillingStatus } from '@api/billing/types'

export type BillingState = {
  /** Null until the first answer (and when the API cannot be reached). */
  status: BillingStatus | null
}

export type BillingActions = {
  /** Re-reads the balance and this month's free puzzle — after sign-in, sign-out, a puzzle or a purchase. */
  refresh: () => Promise<BillingStatus | null>
}
