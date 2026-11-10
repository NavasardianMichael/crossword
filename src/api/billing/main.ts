import { axiosInstance } from '@api/axiosInstance'
import type { APIResponse } from '@interfaces/api'
import { ENDPOINTS } from './endpoints'
import { processBillingStatusResponse, processCheckoutResponse, processPacksResponse, processPaymentResponse } from './processors'
import type { GetBillingStatusAPI, GetPacksAPI, GetPaymentAPI, StartCheckoutAPI } from './types'

export const getBillingStatusAPI: GetBillingStatusAPI['api'] = async () => {
  const { data } = await axiosInstance.get<APIResponse<GetBillingStatusAPI['response']>>(ENDPOINTS.status)
  return processBillingStatusResponse(data)
}

export const getPacksAPI: GetPacksAPI['api'] = async () => {
  const { data } = await axiosInstance.get<APIResponse<GetPacksAPI['response']>>(ENDPOINTS.packs)
  return processPacksResponse(data)
}

export const startCheckoutAPI: StartCheckoutAPI['api'] = async (payload) => {
  const { data } = await axiosInstance.post<APIResponse<StartCheckoutAPI['response']>>(ENDPOINTS.checkout, payload)
  return processCheckoutResponse(data)
}

export const getPaymentAPI: GetPaymentAPI['api'] = async ({ id }) => {
  const { data } = await axiosInstance.get<APIResponse<GetPaymentAPI['response']>>(ENDPOINTS.payment(id))
  return processPaymentResponse(data)
}
