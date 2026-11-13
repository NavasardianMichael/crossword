import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_ID } from '@helpers/analytics'
import { consentDefaultsScript } from '@helpers/consent'

/** The GA4 tag, loaded after the page is interactive. Nothing while the Measurement ID is unset. */
export const Analytics = () => (GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null)

/**
 * Consent Mode defaults (`helpers/consent.ts`), inline in <head>: parsed and run before the GA
 * tag, which only loads once the page is interactive.
 */
export const AnalyticsConsentDefaults = () =>
  GA_ID ? <script id='ga-consent-defaults' dangerouslySetInnerHTML={{ __html: consentDefaultsScript() }} /> : null
