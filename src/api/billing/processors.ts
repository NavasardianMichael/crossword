import { unwrapValue } from '@api/unwrap'
import type { GetBillingStatusAPI, GetPacksAPI, GetPaymentAPI, StartCheckoutAPI } from './types'

export const processBillingStatusResponse: GetBillingStatusAPI['processor'] = unwrapValue

export const processPacksResponse: GetPacksAPI['processor'] = unwrapValue

export const processCheckoutResponse: StartCheckoutAPI['processor'] = unwrapValue

export const processPaymentResponse: GetPaymentAPI['processor'] = unwrapValue
