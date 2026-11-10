import type { OAuthFlowContext } from '../lib/oauth-state.js'
import type { SessionPayload } from '../lib/session.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Express publishes Request here; merging is how fields are added
  namespace Express {
    interface Request {
      session?: SessionPayload
      oauthFlow?: OAuthFlowContext
    }
  }
}
