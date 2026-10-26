import axios, { AxiosError } from 'axios'
import type { APIResponse } from '@interfaces/api'
import { API_REQUEST_TIMEOUT_MS } from '@constants/app'
import { getApiUrl } from '@helpers/url'

export const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: API_REQUEST_TIMEOUT_MS,
})

/**
 * Names the failed call in the error's own message — `[429] POST /puzzles — Too many
 * requests`. Only ever shown in development details; production shows translated copy
 * chosen by `classifyError`.
 */
const describeFailedRequest = (error: AxiosError<Partial<APIResponse<unknown>>>): string => {
  const method = (error.config?.method ?? 'get').toUpperCase()
  const status = error.response?.status ?? error.code ?? 'no response'
  const serverMessage = error.response?.data?.error?.message
  return `[${status}] ${method} ${error.config?.url ?? ''} — ${serverMessage ?? error.message}`
}

axiosInstance.interceptors.response.use(null, (error) => {
  if (axios.isAxiosError(error)) error.message = describeFailedRequest(error)
  return Promise.reject(error)
})
