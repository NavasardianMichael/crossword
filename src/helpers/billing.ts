import axios from 'axios'
import { BILLING_CODE } from '@constants/puzzle'

export type BillingRefusal = 'signInRequired' | 'insufficientCredits' | 'freeBusy'

/**
 * A `POST /puzzles` the free puzzle and the balance could not pay for (HTTP 402), by kind — or
 * a free puzzle refused for now because free puzzles hit their hourly cap (HTTP 429).
 */
export const billingRefusal = (error: unknown): BillingRefusal | undefined => {
  if (!axios.isAxiosError(error)) return undefined
  const code = error.response?.data?.error?.code
  if (error.response?.status === 429) return code === BILLING_CODE.freeBusy ? 'freeBusy' : undefined
  if (error.response?.status !== 402) return undefined
  if (code === BILLING_CODE.signInRequired) return 'signInRequired'
  if (code === BILLING_CODE.insufficientCredits) return 'insufficientCredits'
  return undefined
}
