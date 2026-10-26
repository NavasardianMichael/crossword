/** Ported from hangman's `helpers/utils/commons.ts`. Browser-only: call after mount. */

/** In-app browsers (Facebook, Instagram…) cannot install a PWA, so the button stays hidden there. */
export const isInWebView = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor
  return ['FBAN', 'FBAV', 'Instagram', 'Line', 'Twitter', 'Messenger'].some((marker) => ua.includes(marker))
}

/** iPadOS reports itself as a Mac; touch support gives it away. */
export const isIos = (): boolean => {
  const ua = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(ua) || (ua.includes('macintosh') && navigator.maxTouchPoints > 1)
}

const isIosStandalone = (): boolean => 'standalone' in window.navigator && Boolean((window.navigator as { standalone?: boolean }).standalone)

const INSTALLED_DISPLAY_MODES = ['standalone', 'fullscreen', 'minimal-ui'] as const

const isDisplayModeStandalone = (): boolean =>
  INSTALLED_DISPLAY_MODES.some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches)

export const isInstalledApp = (): boolean => (isIos() ? isIosStandalone() : isDisplayModeStandalone())
