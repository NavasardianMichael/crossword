import { API_URL_FALLBACK, SITE_URL_FALLBACK } from '@constants/app'

/** In the browser the tab's origin wins, so share links always open the page being looked at. */
export const getSiteUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.origin) return window.location.origin.replace(/\/+$/, '')
  return (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK).replace(/\/+$/, '')
}

export const absoluteUrl = (path: string): string => `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`

/**
 * The API origin. On the server an `API_INTERNAL_URL` (e.g. `http://127.0.0.1:9007`) wins, so
 * server-rendered pages reach the API over loopback instead of a round trip through nginx.
 */
export const getApiUrl = (): string =>
  ((typeof window === 'undefined' && process.env.API_INTERNAL_URL) || process.env.NEXT_PUBLIC_API_URL || API_URL_FALLBACK).replace(
    /\/+$/,
    ''
  )
