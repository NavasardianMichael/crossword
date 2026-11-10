import { sendGAEvent } from '@next/third-parties/google'

/**
 * Google Analytics 4. `NEXT_PUBLIC_GA_MEASUREMENT_ID` is inlined at build time; empty — local
 * dev, CI — means no tag and no events. Page views are GA's own (initial load and history
 * changes, through `components/analytics/Analytics.tsx`).
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ''

export type AnalyticsEvent =
  | 'puzzle_created'
  | 'puzzle_solved'
  | 'puzzle_pdf'
  | 'puzzle_shared'
  | 'pwa_prompt_shown'
  | 'pwa_installed'
  | 'login'
  | 'sign_up'
  /** A create refused for want of the free puzzle or credits (`reason`). */
  | 'puzzle_refused'
  | 'begin_checkout'
  | 'purchase'

export const trackEvent = (event: AnalyticsEvent, params: Record<string, unknown> = {}): void => {
  if (GA_ID) sendGAEvent('event', event, params)
}
