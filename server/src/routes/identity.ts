import { type Request, type Response, Router } from 'express'
import { googleRouter } from './identity-google.js'
import { fail, ok } from '../lib/api-response.js'
import { AUTH_CODE } from '../lib/auth-codes.js'
import { sendVerificationLink } from '../lib/email-verification.js'
import { hashPassword, needsRehash, validatePassword, verifyDummyPassword, verifyPassword } from '../lib/password.js'
import { buildPasswordResetUrl, issuePasswordResetToken, sendPasswordChangedEmail, sendPasswordResetEmail } from '../lib/password-reset.js'
import { prisma } from '../lib/prisma.js'
import { asEmail, asFullName } from '../lib/request.js'
import { clearSessionCookie, setSessionCookie } from '../lib/session.js'
import { hashUrlToken } from '../lib/token.js'
import { toUserView } from '../lib/user-view.js'
import { asyncHandler } from '../middleware/error.js'
import { emailRateLimit, rateLimit } from '../middleware/rateLimit.js'

export const identityRouter = Router()

identityRouter.use('/google', googleRouter)

export const issueSession = (res: Response, user: { id: string; tokenVersion: number }): void =>
  setSessionCookie(res, { userId: user.id, tokenVersion: user.tokenVersion })

/** Anonymous is an answer, not an error: `null` with a 200, so no 401 lands in the console. */
identityRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    if (!req.session) return ok(res, null)
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } })
    ok(res, user ? toUserView(user) : null)
  })
)

/**
 * Creates the account inactive: no session until the emailed link is opened.
 * Answers with the address the link went to, for the "check your inbox" screen.
 */
identityRouter.post(
  '/register',
  rateLimit('register', { limit: 10, windowMs: 60 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const email = asEmail(req.body?.email)
    const fullName = asFullName(req.body?.fullName)
    if (!email || !fullName) return fail(res, 'Name and a valid email are required', 400, 400)

    const password = validatePassword(req.body?.password, { email })
    if (!password.ok) return fail(res, password.message, AUTH_CODE.weakPassword, 400)

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (existing) return fail(res, 'An account with this email already exists', AUTH_CODE.emailTaken, 409)

    const user = await prisma.user.create({
      data: { email, fullName, passwordHash: await hashPassword(req.body.password as string) },
    })
    const sent = await sendVerificationLink(user, req.body?.returnTo)
    if (!sent.ok) {
      await prisma.user.delete({ where: { id: user.id } })
      return fail(res, 'Email could not be sent', 503, 503)
    }
    ok(res, { email: user.email }, 201)
  })
)

identityRouter.post(
  '/login',
  rateLimit('login', { limit: 10, windowMs: 15 * 60 * 1000 }),
  emailRateLimit('login', { limit: 10, windowMs: 15 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const email = asEmail(req.body?.email)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null

    if (!user?.passwordHash) {
      await verifyDummyPassword(password)
      if (user?.googleId) return fail(res, 'This account signs in with Google', AUTH_CODE.googleOnlyAccount, 401)
      return fail(res, 'Invalid email or password', AUTH_CODE.invalidCredentials, 401)
    }
    if (!(await verifyPassword(user.passwordHash, password))) {
      return fail(res, 'Invalid email or password', AUTH_CODE.invalidCredentials, 401)
    }

    if (needsRehash(user.passwordHash)) {
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } })
    }
    if (!user.emailVerifiedAt) return fail(res, 'Email is not verified', AUTH_CODE.emailNotVerified, 403)

    issueSession(res, user)
    ok(res, toUserView(user))
  })
)

/** Always answers ok, so it cannot be used to learn which addresses have accounts. */
identityRouter.post(
  '/email/resend',
  rateLimit('verify', { limit: 5, windowMs: 60 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const email = asEmail(req.body?.email)
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null
    if (user?.passwordHash && !user.emailVerifiedAt) {
      const sent = await sendVerificationLink(user, req.body?.returnTo)
      if (!sent.ok) return fail(res, 'Email could not be sent', 503, 503)
    }
    ok(res, null)
  })
)

/**
 * Opening the emailed link activates the account, and only that: no session is issued.
 * The page asks for a click before calling this, so a mail scanner that prefetches the link
 * cannot spend it.
 */
identityRouter.post(
  '/email/verify',
  asyncHandler(async (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : ''
    const user = token ? await prisma.user.findUnique({ where: { emailVerifyTokenHash: hashUrlToken(token) } }) : null
    if (!user?.emailVerifyExpiresAt || user.emailVerifyExpiresAt < new Date()) {
      return fail(res, 'Verification link is invalid or expired', AUTH_CODE.verifyTokenInvalid, 400)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: user.emailVerifiedAt ?? new Date(), emailVerifyTokenHash: null, emailVerifyExpiresAt: null },
    })
    ok(res, null)
  })
)

identityRouter.post('/logout', (_req: Request, res: Response) => {
  clearSessionCookie(res)
  ok(res, null)
})

/** Always answers ok, so the form cannot be used to learn which addresses have accounts. */
identityRouter.post(
  '/password/forgot',
  rateLimit('reset', { limit: 5, windowMs: 60 * 60 * 1000 }),
  asyncHandler(async (req, res) => {
    const email = asEmail(req.body?.email)
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null
    if (user) {
      const token = await issuePasswordResetToken(user.id)
      const sent = await sendPasswordResetEmail(user.email, buildPasswordResetUrl(token))
      if (!sent.ok) return fail(res, 'Email could not be sent', 503, 503)
    }
    ok(res, null)
  })
)

identityRouter.post(
  '/password/reset',
  asyncHandler(async (req, res) => {
    const token = typeof req.body?.token === 'string' ? req.body.token : ''
    const user = token ? await prisma.user.findUnique({ where: { passwordResetTokenHash: hashUrlToken(token) } }) : null
    if (!user?.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
      return fail(res, 'Reset link is invalid or expired', AUTH_CODE.resetTokenInvalid, 400)
    }

    const check = validatePassword(req.body?.password, { email: user.email })
    if (!check.ok) return fail(res, check.message, AUTH_CODE.weakPassword, 400)

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(req.body.password as string),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
        tokenVersion: { increment: 1 },
      },
    })
    issueSession(res, updated)
    void sendPasswordChangedEmail(updated.email)
    ok(res, toUserView(updated))
  })
)
