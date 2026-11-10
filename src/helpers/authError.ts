import axios from 'axios'
import { AUTH_CODE } from '@constants/auth'

/** Which auth sentence to show, from the envelope code. Unknown failures stay with `classifyError`. */
export const authErrorKey = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) return undefined
  switch (error.response?.data?.error?.code) {
    case AUTH_CODE.invalidCredentials:
      return 'invalidCredentials'
    case AUTH_CODE.googleOnlyAccount:
      return 'googleOnly'
    case AUTH_CODE.emailNotVerified:
      return 'emailNotVerified'
    case AUTH_CODE.emailTaken:
      return 'emailTaken'
    case AUTH_CODE.weakPassword:
      return 'weakPassword'
    case AUTH_CODE.verifyTokenInvalid:
      return 'verifyInvalid'
    case AUTH_CODE.resetTokenInvalid:
      return 'resetInvalid'
    default:
      return undefined
  }
}
