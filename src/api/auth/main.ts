import { axiosInstance } from '@api/axiosInstance'
import type { APIResponse } from '@interfaces/api'
import { RETURN_TO_QUERY } from '@constants/auth'
import { getApiUrl } from '@helpers/url'
import { ENDPOINTS } from './endpoints'
import type { AuthUser, LoginPayload, Registered, RegisterPayload } from './types'

const value = <T>(data: APIResponse<T>): T => {
  if (data.error || data.value === null) throw new Error(data.error?.message ?? 'Empty response')
  return data.value
}

export const getMeAPI = async (): Promise<AuthUser | null> => {
  const { data } = await axiosInstance.get<APIResponse<AuthUser | null>>(ENDPOINTS.me)
  if (data.error) throw new Error(data.error.message)
  return data.value
}

export const loginAPI = async (payload: LoginPayload): Promise<AuthUser> => {
  const { data } = await axiosInstance.post<APIResponse<AuthUser>>(ENDPOINTS.login, payload)
  return value(data)
}

export const registerAPI = async (payload: RegisterPayload): Promise<Registered> => {
  const { data } = await axiosInstance.post<APIResponse<Registered>>(ENDPOINTS.register, payload)
  return value(data)
}

export const logoutAPI = async (): Promise<void> => {
  await axiosInstance.post(ENDPOINTS.logout)
}

export const resendVerificationAPI = async (email: string, returnTo?: string): Promise<void> => {
  await axiosInstance.post(ENDPOINTS.resend, { email, returnTo })
}

export const verifyEmailAPI = async (token: string): Promise<void> => {
  const { data } = await axiosInstance.post<APIResponse<null>>(ENDPOINTS.verify, { token })
  if (data.error) throw new Error(data.error.message)
}

export const forgotPasswordAPI = async (email: string): Promise<void> => {
  const { data } = await axiosInstance.post<APIResponse<null>>(ENDPOINTS.forgot, { email })
  if (data.error) throw new Error(data.error.message)
}

export const resetPasswordAPI = async (token: string, password: string): Promise<AuthUser> => {
  const { data } = await axiosInstance.post<APIResponse<AuthUser>>(ENDPOINTS.reset, { token, password })
  return value(data)
}

/** A top-level navigation: the API runs OAuth and redirects back. */
export const googleSignInUrl = (returnTo?: string): string => {
  const url = new URL(`${getApiUrl()}${ENDPOINTS.google}`)
  if (returnTo) url.searchParams.set(RETURN_TO_QUERY, returnTo)
  return url.toString()
}
