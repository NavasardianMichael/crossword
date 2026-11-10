export type AuthUser = {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  hasPassword: boolean
  hasGoogle: boolean
}

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = { fullName: string; email: string; password: string; returnTo?: string }
export type Registered = { email: string }
