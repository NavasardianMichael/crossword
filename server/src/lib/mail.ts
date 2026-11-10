import { config } from '../config.js'

/**
 * The only client for the external mail engine, and the only reader of `MAIL_API_KEY`.
 *
 * `/mail/internal/send` reaches the admin inbox — the engine owns the recipient, so a
 * contact form cannot aim mail anywhere else. `/mail/external/send` reaches a user at an
 * address the caller already holds (verification, password links).
 */

const APP_ID = 'Crossword AI'
const EXTERNAL_SENDER = { fromName: 'Crossword AI', mailFromPrefix: 'crossword' } as const
const MAIL_TIMEOUT_MS = 10_000

export type ExternalMailPayload = {
  to: string
  subject: string
  text?: string
  html?: string
}

/**
 * Contact-form shape. The engine fills its own defaults when a field is missing, and it
 * never lets the caller choose who receives it.
 */
export type InternalMailPayload = {
  subject?: string
  body?: string
  senderEmail?: string
  /** The engine's field name. This app sends the whole name here. */
  firstName?: string
  lastName?: string
  /** Small, non-sensitive context shown beside the message. */
  details?: Record<string, unknown>
}

export type MailResult = { ok: true; messageId?: string } | { ok: false; status: number; message: string }

type MailEngineResponse = {
  success?: boolean
  message?: string
  messageId?: string
  errors?: { field?: string; message?: string }[]
}

export const isMailConfigured = (): boolean => Boolean(config.mail.apiUrl && config.mail.apiKey)

const describeFailure = (status: number, parsed: MailEngineResponse | null): string => {
  const fields = parsed?.errors?.map((each) => [each.field, each.message].filter(Boolean).join(': ')).filter(Boolean)
  const detail = fields?.length ? ` (${fields.join('; ')})` : ''
  return `${parsed?.message ?? `Mail engine responded ${status}`}${detail}`
}

const post = async (path: string, payload: object): Promise<MailResult> => {
  if (!isMailConfigured()) return { ok: false, status: 0, message: 'Mail engine is not configured' }

  let response: Response
  try {
    response = await fetch(`${config.mail.apiUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-api-key': config.mail.apiKey,
      },
      body: JSON.stringify({ appId: APP_ID, ...payload }),
      signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Mail request failed'
    console.error(`[mail] ${path} did not complete: ${message}`)
    return { ok: false, status: 0, message }
  }

  const parsed = (await response.json().catch(() => null)) as MailEngineResponse | null
  if (!response.ok || parsed?.success === false) {
    const message = describeFailure(response.status, parsed)
    console.error(`[mail] ${path} failed: ${response.status} ${message}`)
    return { ok: false, status: response.status, message }
  }
  return { ok: true, messageId: parsed?.messageId }
}

const sendExternalMail = (payload: ExternalMailPayload): Promise<MailResult> =>
  post('/mail/external/send', { ...EXTERNAL_SENDER, ...payload })

/** Notify the admin inbox. There is no address to aim. */
export const sendInternalMail = (payload: InternalMailPayload): Promise<MailResult> =>
  post('/mail/internal/send', payload)

/**
 * Unconfigured is normal in dev, where the mail prints here instead, links included.
 * In production an unconfigured engine is a failure the caller must not hide.
 */
export const sendAccountMail = async (label: string, payload: ExternalMailPayload): Promise<MailResult> => {
  if (!isMailConfigured()) {
    if (config.nodeEnv === 'production') {
      console.error(`[mail] ${label} not sent: MAIL_API_URL or MAIL_API_KEY is empty`)
      return { ok: false, status: 0, message: 'Mail engine is not configured' }
    }
    console.log(`[mail] ${label} for ${payload.to}\n${payload.text ?? ''}`)
    return { ok: true }
  }
  return sendExternalMail(payload)
}

export const escapeHtml = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
