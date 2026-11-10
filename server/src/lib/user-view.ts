export type UserView = {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  hasPassword: boolean
  hasGoogle: boolean
}

export const toUserView = (user: {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  passwordHash: string | null
  googleId: string | null
}): UserView => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  avatarUrl: user.avatarUrl,
  hasPassword: Boolean(user.passwordHash),
  hasGoogle: Boolean(user.googleId),
})
