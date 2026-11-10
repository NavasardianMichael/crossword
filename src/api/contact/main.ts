import { axiosInstance } from '@api/axiosInstance'
import type { APIResponse } from '@interfaces/api'
import { ENDPOINTS } from './endpoints'
import type { ContactPayload } from './types'

export const sendContactMessageAPI = async (payload: ContactPayload): Promise<void> => {
  const { data } = await axiosInstance.post<APIResponse<null>>(ENDPOINTS.send, payload)
  if (data.error) throw new Error(data.error.message)
}
