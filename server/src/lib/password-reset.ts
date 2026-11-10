import { escapeHtml, type MailResult, sendAccountMail } from './mail.js'
import { prisma } from './prisma.js'
import { buildWebUrl, FORGOT_PASSWORD_PATH, PASSWORD_RESET_PATH, PASSWORD_RESET_QUERY } from './return-path.js'
import { hashUrlToken, mintUrlToken } from './token.js'
import { config } from '../config.js'

export const issuePasswordResetToken = async (userId: string): Promise<string> => {
  const token = mintUrlToken()
  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetTokenHash: hashUrlToken(token),
      passwordResetExpiresAt: new Date(Date.now() + config.passwordResetTtlMs),
    },
  })
  return token
}

export const buildPasswordResetUrl = (token: string): string =>
  buildWebUrl(config.corsOrigin, PASSWORD_RESET_PATH, { [PASSWORD_RESET_QUERY]: token })

export const sendPasswordResetEmail = (to: string, url: string): Promise<MailResult> => {
  const lead = 'Someone asked to reset the password of your Crossword AI account.'
  const footer = 'The link works for one hour and can be used once. If this was not you, ignore this email. Your password has not changed.'
  return sendAccountMail('Password reset', {
    to,
    subject: 'Reset your password — Crossword AI',
    text: `${lead}\n\n${url}\n\n${footer}`,
    html: `<p>${lead}</p><p><a href="${escapeHtml(url)}">Choose a new password</a></p><p>${footer}</p>`,
  })
}

/** A notice after a password changes, so a takeover through a stolen inbox does not go unseen. */
export const sendPasswordChangedEmail = (to: string): Promise<MailResult> => {
  const url = buildWebUrl(config.corsOrigin, FORGOT_PASSWORD_PATH)
  const lead = 'The password of your Crossword AI account was just changed, and other devices were signed out.'
  const warning = 'If this was not you, reset the password now:'
  return sendAccountMail('Password changed notice', {
    to,
    subject: 'Your password was changed — Crossword AI',
    text: `${lead}\n\n${warning}\n\n${url}`,
    html: `<p>${lead}</p><p>${warning} <a href="${escapeHtml(url)}">reset the password</a></p>`,
  })
}
