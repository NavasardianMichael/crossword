import * as Sentry from '@sentry/nextjs'
import { installIntlStandIns } from '@helpers/intlStandIns'
import { sentryOptions } from '@helpers/sentry'

/** Before hydration: numbers must format as they did on the server. */
installIntlStandIns()

/** Browser error reporting. */
Sentry.init(sentryOptions)

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
