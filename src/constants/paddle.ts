/**
 * Paddle.js in the browser: the client-side token (public by design) and which Paddle it talks
 * to. Both are inlined at build time; without the token the checkout page cannot open the overlay.
 * The API key and the webhook secret live on the API only (`server/src/lib/paddle.ts`).
 */
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.trim() ?? ''

export const PADDLE_ENVIRONMENT: 'sandbox' | 'production' = process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' ? 'sandbox' : 'production'

/** The query parameter Paddle appends to our checkout page: the transaction to pay. */
export const PADDLE_TRANSACTION_QUERY = '_ptxn'

/** The return page's query parameter: the payment to wait for. */
export const PAYMENT_ID_QUERY = 'id'
