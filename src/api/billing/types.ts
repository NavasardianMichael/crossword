import type { Endpoint } from '@interfaces/api'
import type { CreditPackId, Locale } from '@constants/puzzle'

/** `server/src/services/billing.ts` — `BillingStatus`. */
export type BillingStatus = {
  signedIn: boolean
  credits: number
  freeAvailable: boolean
  /** ISO date: the first of next month, UTC. */
  freeResetsAt: string
  /** Packs can be bought. */
  shopOpen: boolean
}

export type CreditPack = {
  id: CreditPackId
  credits: number
  usd: number
  /** Paddle's price for this visitor (currency, tax). Null: show `usd`. */
  price: string | null
  available: boolean
}

export type PaymentStatus = { status: 'pending' | 'completed' | 'failed' | 'refunded'; credits: number }

export type CheckoutPayload = { pack: CreditPackId; locale: Locale }
export type Checkout = { checkoutUrl: string; paymentId: string }

export type GetBillingStatusAPI = Endpoint<{ payload: void; response: BillingStatus; processed: BillingStatus }>
export type GetPacksAPI = Endpoint<{ payload: void; response: CreditPack[]; processed: CreditPack[] }>
export type StartCheckoutAPI = Endpoint<{ payload: CheckoutPayload; response: Checkout; processed: Checkout }>
export type GetPaymentAPI = Endpoint<{ payload: { id: string }; response: PaymentStatus; processed: PaymentStatus }>
