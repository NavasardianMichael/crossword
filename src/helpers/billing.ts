import axios from 'axios'
import { BILLING_CODE } from '@constants/puzzle'

export type BillingRefusal = 'signInRequired' | 'insufficientCredits'

/** A `POST /puzzles` the free puzzle and the balance could not pay for (HTTP 402), by kind. */
export const billingRefusal = (error: unknown): BillingRefusal | undefined => {
  if (!axios.isAxiosError(error) || error.response?.status !== 402) return undefined
  const code = error.response.data?.error?.code
  if (code === BILLING_CODE.signInRequired) return 'signInRequired'
  if (code === BILLING_CODE.insufficientCredits) return 'insufficientCredits'
  return undefined
}
