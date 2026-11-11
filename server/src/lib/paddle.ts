import { createHmac, timingSafeEqual } from 'node:crypto'
import { config } from '../config.js'

/**
 * Paddle Billing over plain `fetch` — the only reader of the API key and the webhook secrets.
 * One-time prices only: a transaction per credit pack, paid in Paddle's overlay checkout.
 * Docs: https://developer.paddle.com/api-reference/overview
 */
const API_BASE = config.paddle.sandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'
const TIMEOUT_MS = 15_000

/** A failed Paddle call, with the two fields Paddle Support asks for: `code` and `requestId`. */
export class PaddleError extends Error {
  constructor(
    readonly operation: string,
    readonly status: number,
    readonly code: string | undefined,
    readonly requestId: string | undefined,
    detail: string
  ) {
    super(`Paddle ${operation} failed (${status} ${code ?? ''}): ${detail}`)
  }
}

type PaddleErrorBody = { error?: { code?: string; detail?: string }; meta?: { request_id?: string } }

const post = async <T>(operation: string, path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.paddle.apiKey}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const json = (await response.json().catch(() => ({}))) as { data?: T } & PaddleErrorBody
  if (!response.ok || !json.data) {
    const error = new PaddleError(operation, response.status, json.error?.code, json.meta?.request_id, json.error?.detail ?? response.statusText)
    console.error(`[paddle] ${error.message}`, { requestId: error.requestId, sandbox: config.paddle.sandbox })
    throw error
  }
  return json.data
}

export type CreatedTransaction = { id: string }

/**
 * A draft transaction for one price. No `checkout.url` is passed: Paddle accepts only approved
 * domains there, which rules out localhost in development. Our checkout page opens the overlay
 * from the transaction id instead, and Paddle.js itself opens only on approved domains in live.
 */
export const createTransaction = (input: { priceId: string; customData: Record<string, string> }) =>
  post<CreatedTransaction>('checkout', '/transactions', {
    items: [{ price_id: input.priceId, quantity: 1 }],
    custom_data: input.customData,
  })

type PricingPreview = { details?: { line_items?: { price?: { id?: string }; formatted_totals?: { total?: string } }[] } }

/** Each price as the visitor would pay it — their currency and tax, located by IP. */
export const previewPrices = async (priceIds: readonly string[], customerIp: string | undefined): Promise<Map<string, string>> => {
  const data = await post<PricingPreview>('pricing preview', '/pricing-preview', {
    items: priceIds.map((priceId) => ({ price_id: priceId, quantity: 1 })),
    customer_ip_address: customerIp || undefined,
  })
  const totals = new Map<string, string>()
  for (const item of data.details?.line_items ?? []) {
    if (item.price?.id && item.formatted_totals?.total) totals.set(item.price.id, item.formatted_totals.total)
  }
  return totals
}

/**
 * `Paddle-Signature: ts=…;h1=…[;h1=…]` — an HMAC-SHA256 of `{ts}:{raw body}` with the
 * destination's secret. Every configured secret is tried, so a rotation has no gap.
 * No timestamp window: a replayed event is harmless, because events are handled once by id.
 */
export const verifyWebhookSignature = (rawBody: Buffer, header: string): boolean => {
  const secrets = config.paddle.webhookSecrets
  if (!secrets.length) {
    console.error('[paddle] webhook refused: PADDLE_WEBHOOK_SECRET is not set')
    return false
  }

  const parts = header.split(';')
  const ts = parts.find((part) => part.startsWith('ts='))?.slice(3)
  const signatures = parts.filter((part) => part.startsWith('h1=')).map((part) => Buffer.from(part.slice(3), 'utf8'))
  if (!ts || !signatures.length) return false

  const signed = Buffer.concat([Buffer.from(`${ts}:`, 'utf8'), rawBody])
  const matched = secrets.findIndex((secret) => {
    const expected = Buffer.from(createHmac('sha256', secret).update(signed).digest('hex'), 'utf8')
    return signatures.some((signature) => signature.length === expected.length && timingSafeEqual(signature, expected))
  })
  if (matched > 0) console.warn('[paddle] webhook verified with a fallback secret: the rotation is not finished')
  return matched !== -1
}
