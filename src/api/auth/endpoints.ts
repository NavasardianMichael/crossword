export const ENDPOINTS = {
  me: '/identity/me',
  register: '/identity/register',
  login: '/identity/login',
  logout: '/identity/logout',
  resend: '/identity/email/resend',
  verify: '/identity/email/verify',
  forgot: '/identity/password/forgot',
  reset: '/identity/password/reset',
  google: '/identity/google',
} as const
