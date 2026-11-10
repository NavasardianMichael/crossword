import type { AuthUser, LoginPayload, Registered, RegisterPayload } from '@api/auth/types'

export type AuthState = {
  user: AuthUser | null
  isResolved: boolean
  isPending: boolean
}

export type AuthActions = {
  getMe: () => Promise<AuthUser | null>
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<Registered>
  logout: () => Promise<void>
  resetPassword: (token: string, password: string) => Promise<AuthUser>
}
