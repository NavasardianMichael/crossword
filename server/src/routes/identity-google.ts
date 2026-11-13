import { type NextFunction, type Request, type Response, Router } from 'express'
import { issueSession } from './identity.js'
import { config, isGoogleOAuthConfigured } from '../config.js'
import { ensureGoogleStrategy, GOOGLE_ERROR, GOOGLE_STRATEGY, type GoogleIdentity, passport } from '../lib/google-oauth.js'
import { prisma } from '../lib/prisma.js'
import { buildWebUrl, HOME_PATH, RETURN_TO_QUERY, safeReturnPath, SIGN_IN_PATH } from '../lib/return-path.js'

/**
 * Google sign-in. Every branch ends in a redirect back to the web app.
 * `issueSession` is imported from the router that mounts this one; it is only used inside
 * handlers, so the cycle is safe.
 */
export const googleRouter = Router()

googleRouter.use(passport.initialize())

const toSignIn = (res: Response, error: string): void => res.redirect(buildWebUrl(config.corsOrigin, SIGN_IN_PATH, { error }))

googleRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  if (!ensureGoogleStrategy() || !isGoogleOAuthConfigured()) return toSignIn(res, GOOGLE_ERROR.unavailable)
  const returnTo = req.query[RETURN_TO_QUERY]
  const returnPath = safeReturnPath(returnTo) ?? null
  passport.authenticate(GOOGLE_STRATEGY, { session: false, state: { returnPath } } as object)(req, res, next)
})

/**
 * Linking by email is safe only because Google verified the address. An unverified password
 * account is claimed: its password is cleared and its sessions are revoked, so a squatter
 * who registered the address first cannot keep it.
 */
const upsertGoogleUser = async (identity: GoogleIdentity) => {
  const byGoogle = await prisma.user.findUnique({ where: { googleId: identity.googleId } })
  if (byGoogle) return byGoogle

  const byEmail = await prisma.user.findUnique({ where: { email: identity.email } })
  if (byEmail) {
    const claim = !byEmail.emailVerifiedAt
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId: identity.googleId,
        emailVerifiedAt: new Date(),
        avatarUrl: byEmail.avatarUrl ?? identity.avatarUrl,
        ...(claim ? { passwordHash: null, tokenVersion: { increment: 1 } } : {}),
      },
    })
  }

  return prisma.user.create({
    data: {
      email: identity.email,
      fullName: identity.fullName,
      googleId: identity.googleId,
      avatarUrl: identity.avatarUrl,
      emailVerifiedAt: new Date(),
    },
  })
}

googleRouter.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  if (!ensureGoogleStrategy()) return toSignIn(res, GOOGLE_ERROR.unavailable)

  passport.authenticate(
    GOOGLE_STRATEGY,
    { session: false },
    (error: unknown, identity: GoogleIdentity | false, info?: { message?: string }) => {
      if (error) {
        console.error('[google] callback failed', error instanceof Error ? error.message : error)
        return toSignIn(res, GOOGLE_ERROR.failed)
      }
      if (!identity) {
        const denied = typeof req.query.error === 'string'
        return toSignIn(res, denied ? GOOGLE_ERROR.denied : (info?.message ?? GOOGLE_ERROR.failed))
      }

      upsertGoogleUser(identity)
        .then((user) => {
          issueSession(res, user)
          const returnPath = req.oauthFlow?.returnPath
          res.redirect(buildWebUrl(config.corsOrigin, safeReturnPath(returnPath) ?? HOME_PATH))
        })
        .catch((upsertError: unknown) => {
          console.error('[google] account upsert failed', upsertError)
          toSignIn(res, GOOGLE_ERROR.failed)
        })
    }
  )(req, res, next)
})
