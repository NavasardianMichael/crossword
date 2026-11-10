import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from '@helpers/sentry'

/** Browser error reporting. */
Sentry.init(sentryOptions)

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
