/**
 * Google Analytics 4 (gtag.js), ported from hangman. Everything stays off while
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is unset. NEXT_PUBLIC_ values are inlined at build time.
 */
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i

const readMeasurementId = () => {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  if (!raw) return ''
  if (GA_MEASUREMENT_ID_PATTERN.test(raw)) return raw
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID does not look like a GA4 Measurement ID (G-XXXXXXXX).')
  }
  return ''
}

export const GA_MEASUREMENT_ID = readMeasurementId()

export const GA_ENABLED = GA_MEASUREMENT_ID.length > 0

export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`

/** Page views are sent on every route change by `PageViewTracker`, so the automatic one is off. */
export const GA_INIT_SCRIPT = [
  'window.dataLayer=window.dataLayer||[];',
  'window.gtag=function(){dataLayer.push(arguments);};',
  "gtag('js',new Date());",
  `gtag('config',${JSON.stringify(GA_MEASUREMENT_ID)},${JSON.stringify({
    send_page_view: false,
    ...(process.env.NODE_ENV !== 'production' && { debug_mode: true }),
  })});`,
].join('')
