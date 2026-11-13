import { escapeHtml, type MailResult, sendAccountMail } from './mail.js'
import { prisma } from './prisma.js'
import { buildWebUrl, EMAIL_VERIFY_PATH, EMAIL_VERIFY_QUERY, RETURN_TO_QUERY, safeReturnPath } from './return-path.js'
import { hashUrlToken, mintUrlToken } from './token.js'
import { config } from '../config.js'

/** A new link replaces the previous one: only the latest email in the inbox works. */
export const issueEmailVerifyToken = async (userId: string): Promise<string> => {
  const token = mintUrlToken()
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerifyTokenHash: hashUrlToken(token),
      emailVerifyExpiresAt: new Date(Date.now() + config.emailVerifyTtlMs),
    },
  })
  return token
}

export const buildEmailVerifyUrl = (token: string, returnTo?: unknown): string => {
  const returnPath = safeReturnPath(returnTo)
  return buildWebUrl(config.corsOrigin, EMAIL_VERIFY_PATH, {
    [EMAIL_VERIFY_QUERY]: token,
    ...(returnPath ? { [RETURN_TO_QUERY]: returnPath } : {}),
  })
}

const hours = Math.round(config.emailVerifyTtlMs / (60 * 60 * 1000))

export const sendEmailVerifyEmail = (to: string, url: string): Promise<MailResult> => {
  const lead = 'Confirm your email to activate your Crossword AI account:'
  const footer = `The link works for ${hours} hours. If you did not create an account, you can ignore this email.`
  return sendAccountMail('Email verification', {
    to,
    subject: 'Confirm your email — Crossword AI',
    text: `${lead}\n\n${url}\n\n${footer}`,
    html: `<p>${lead}</p><p><a href="${escapeHtml(url)}">Confirm email</a></p><p>${footer}</p>`,
  })
}

export const sendVerificationLink = async (user: { id: string; email: string }, returnTo?: unknown): Promise<MailResult> => {
  const token = await issueEmailVerifyToken(user.id)
  return sendEmailVerifyEmail(user.email, buildEmailVerifyUrl(token, returnTo))
}
