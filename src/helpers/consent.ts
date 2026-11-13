import { sendGAEvent } from '@next/third-parties/google'
import { STORAGE_KEYS } from '@constants/app'
import { GA_ID } from '@helpers/analytics'
import { readJson, writeJson } from '@helpers/storage'

/**
 * Google Consent Mode v2. GA loads on every page but starts with analytics storage denied —
 * no cookies, only cookieless pings — until the visitor accepts the banner. Ads storage is
 * always denied: the site shows no ads. The answer is kept on the device and can be changed
 * from "Cookie settings" in the footer.
 */
export type ConsentChoice = 'granted' | 'denied'

export const readConsent = (): ConsentChoice | null => {
  const value = readJson<unknown>(STORAGE_KEYS.analyticsConsent, null)
  return value === 'granted' || value === 'denied' ? value : null
}

/** Whether the banner shows — a `useSyncExternalStore` source, read only in the browser. */
let bannerOpen: boolean | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const subscribeConsentBanner = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Open until the visitor answers; never without a GA tag to ask about. */
export const isConsentBannerOpen = (): boolean => (bannerOpen ??= Boolean(GA_ID) && readConsent() === null)

/** "Cookie settings" in the footer: ask again. */
export const openConsentBanner = (): void => {
  bannerOpen = Boolean(GA_ID)
  emit()
}

export const saveConsent = (choice: ConsentChoice): void => {
  writeJson(STORAGE_KEYS.analyticsConsent, choice)
  if (GA_ID) sendGAEvent('consent', 'update', { analytics_storage: choice })
  bannerOpen = false
  emit()
}

/**
 * Runs before the GA tag (inline in <head>): every consent type denied, then the stored
 * answer re-applied, so a returning visitor who accepted is counted from the first page view.
 */
export const consentDefaultsScript = (): string => `
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
var stored = null;
try { stored = JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEYS.analyticsConsent)})); } catch (e) {}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: stored === 'granted' ? 'granted' : 'denied',
});
`
