/** Envelope codes the web auth forms switch on. Keep in step with `src/constants/auth.ts`. */
export const AUTH_CODE = {
  weakPassword: 4001,
  verifyTokenInvalid: 4002,
  resetTokenInvalid: 4003,
  invalidCredentials: 4011,
  googleOnlyAccount: 4012,
  emailNotVerified: 4031,
  emailTaken: 4091,
} as const
