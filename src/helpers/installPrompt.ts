import { STORAGE_KEYS } from '@constants/app'
import { writeJson } from './storage'

/**
 * Chromium's install prompt, held for the install button. Ported from hangman.
 *
 * The listener is registered when this module loads, not when the button mounts:
 * `beforeinstallprompt` can fire before any component is on screen, and a missed event
 * does not come back until the next page load.
 */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notifyListeners = () => listeners.forEach((listener) => listener())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    notifyListeners()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    setAppInstalled()
    notifyListeners()
  })
}

/** `useSyncExternalStore` contract. */
export const subscribeToInstallPrompt = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getInstallPrompt = () => deferredPrompt

export const getServerInstallPrompt = () => null

export const setAppInstalled = () => writeJson(STORAGE_KEYS.pwaInstalledAt, Date.now())

export const promptInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) return false
  const prompt = deferredPrompt
  await prompt.prompt()
  const { outcome } = await prompt.userChoice
  if (outcome === 'accepted') setAppInstalled()
  deferredPrompt = null
  notifyListeners()
  return outcome === 'accepted'
}
