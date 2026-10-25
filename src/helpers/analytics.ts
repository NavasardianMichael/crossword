import { GA_ENABLED } from '@constants/analytics'

export type AnalyticsEvent =
  | 'puzzle_created'
  | 'puzzle_solved'
  | 'pwa_prompt_shown'
  | 'pwa_installed'

type DataLayerWindow = Window & { dataLayer?: unknown[] }

/** Queues a gtag command; gtag.js reads the queue once it loads. It must push the real `arguments` object. */
const gtag: (...args: unknown[]) => void = function () {
  const analyticsWindow = window as DataLayerWindow
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  analyticsWindow.dataLayer.push(arguments)
}

export const trackEvent = (event: AnalyticsEvent, params: Record<string, unknown> = {}) => {
  if (!GA_ENABLED || typeof window === 'undefined') return
  gtag('event', event, params)
}

export const trackPageView = (path: string) => {
  if (!GA_ENABLED || typeof window === 'undefined') return
  gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: `${window.location.origin}${path}`,
  })
}
