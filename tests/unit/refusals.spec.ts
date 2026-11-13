import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { BILLING_CODE } from '../../src/constants/puzzle'
import { authErrorKey } from '../../src/helpers/authError'
import { billingRefusal } from '../../src/helpers/billing'

const httpError = (status: number, code?: number) =>
  new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    data: { value: null, error: code === undefined ? null : { code, message: '' } },
  } as AxiosResponse)

describe('billingRefusal', () => {
  it('names each refusal of POST /puzzles', () => {
    expect(billingRefusal(httpError(402, BILLING_CODE.signInRequired))).toBe('signInRequired')
    expect(billingRefusal(httpError(402, BILLING_CODE.insufficientCredits))).toBe('insufficientCredits')
    expect(billingRefusal(httpError(429, BILLING_CODE.freeBusy))).toBe('freeBusy')
  })

  it('leaves a plain rate limit and other failures to the generic alert', () => {
    expect(billingRefusal(httpError(429, 429))).toBeUndefined()
    expect(billingRefusal(httpError(500))).toBeUndefined()
    expect(billingRefusal(new Error('x'))).toBeUndefined()
  })
})

describe('authErrorKey', () => {
  it('says "too many attempts" for a rate-limited auth form, not the puzzle copy', () => {
    expect(authErrorKey(httpError(429, 429))).toBe('tooManyAttempts')
  })
})
