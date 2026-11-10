import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_ID } from '@helpers/analytics'

/** The GA4 tag, loaded after the page is interactive. Nothing while the Measurement ID is unset. */
export const Analytics = () => (GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null)
