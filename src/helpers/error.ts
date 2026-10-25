import axios from 'axios'

/**
 * Turns any thrown value into a *kind* the UI has translated copy for (`Errors.<kind>`),
 * plus the original message for the development-only details block. Production never
 * renders a server message: those are English and written for developers.
 */
export type ErrorKind = 'network' | 'rateLimited' | 'unauthorized' | 'notFound' | 'server' | 'generic'

export type ClassifiedError = { kind: ErrorKind; status: number | null; details: string }

export const classifyError = (error: unknown): ClassifiedError => {
  const details = error instanceof Error ? error.message : String(error)

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null
    if (!error.response) return { kind: 'network', status, details }
    if (status === 429) return { kind: 'rateLimited', status, details }
    if (status === 401) return { kind: 'unauthorized', status, details }
    if (status === 404) return { kind: 'notFound', status, details }
    if (status && status >= 500) return { kind: 'server', status, details }
    return { kind: 'generic', status, details }
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) return { kind: 'network', status: null, details }
  return { kind: 'generic', status: null, details }
}

export const IS_DEV = process.env.NODE_ENV !== 'production'
