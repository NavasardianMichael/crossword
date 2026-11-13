# Billing — the business model

Credits, no subscription. Setup steps: [PADDLE_SETUP.md](PADDLE_SETUP.md).

## Free credits

`FREE_MONTHLY_CREDITS` (11 — a medium puzzle at medium difficulty) in the puzzle twins.

| Who | Free credits | Resets |
|---|---|---|
| Guest device (httpOnly cookie `crossword-guest`) | 11 per month | 1st of the month, 00:00 UTC |
| Signed-in account | 11 per month, on top of the guest device's | same |

- Spent **before** bought credits; a puzzle costing more than what is left takes the rest from bought
  credits. What is left at the end of the month does not carry over. Bought credits never expire.
- The balance shown (header, credits page) is free + bought.
- A guest whose free credits don't cover a puzzle is asked to sign in (`signInRequired`) — so a guest can't
  make a large puzzle (15–17) without signing in.
- At most `GUEST_FREE_PER_IP` (default 3) guest devices per IP address spend free credits per month, so
  clearing cookies doesn't mint endless free credits.
- At most `FREE_PUZZLES_PER_HOUR` (default 200) puzzles may take free credits in any rolling hour, all players
  together: a brake on a farm spread over many addresses. Past it a puzzle that would spend free credits is
  refused with `freeBusy` (HTTP 429) — never paid with bought credits instead — and the admin gets one mail an
  hour. A puzzle paid wholly with bought credits never passes through it.
- Free play (inline generation for a puzzle paid wholly with free credits, and the refill job) may spend 70%
  of the daily Gemini budget (`config.gemini.freeShare`); the rest is kept for puzzles that spend bought credits.
- Opening a stored puzzle (shared link, history) is always free. Only **building** one is charged.

## Price of a puzzle (credits)

`SIZE_CREDITS[size] + DIFFICULTY_CREDITS[difficulty]` — `src/constants/puzzle.ts` (twin of `server/src/lib/puzzle.ts`).

| Size \ Difficulty | Easy | Medium | Hard |
|---|---|---|---|
| Small | 5 | 6 | 7 |
| Medium | 10 | 11 | 12 |
| Large | 15 | 16 | 17 |

Format (crossword / scanword) does not change the price. If the pool can only fill a smaller grid,
the smaller size is charged.

## Credit packs (one-time, credits never expire)

| Pack | Credits | USD list price | Per credit | ≈ medium puzzles |
|---|---|---|---|---|
| `starter` | 200 | $4.99 | $0.025 | 18 |
| `popular` | 600 | $11.99 | $0.020 | 54 |
| `big` | 2000 | $29.99 | $0.015 | 181 |

The real price is the Paddle price (`PADDLE_PRICE_ID_*`). Paddle localizes the currency. Prices include tax: the buyer pays the price shown, and VAT or sales tax comes out of it.
`CREDIT_PACKS.usd` is only shown until Paddle answers.

## Costs (why these numbers)

- Gemini: about $0.02 per generation of ~12 new words (`gemini-3.8-flash`, Jan-2027 rates). The worst case
  for a large grid with every word fresh is about $0.08. Most puzzles come from the pool and cost far less.
- Paddle: 5% + $0.50 per payment. So the smallest pack is $4.99, not lower.
- A daily player (medium/medium, ~330 credits a month) pays about $6.60 a month: about NYT ($5) and Grid Genius ($7.99).

## Rules in code

- **Charge** = inside the transaction that stores the puzzle (`services/billing.ts › chargeForPuzzle`),
  under a per-holder advisory lock (and a per-address one for guests), so two builds at once cannot spend the
  same free credits: this month's free credits first (a `FreeSpend` row for what it took), then
  `UPDATE "User" SET credits = credits - rest WHERE credits >= rest` with its `CreditEntry`. If the two don't
  cover it → 402, nothing is stored or spent.
  - `BILLING_CODE.signInRequired` (4021): a guest's free credits don't cover the puzzle.
  - `BILLING_CODE.insufficientCredits` (4022): signed in, free + bought credits below the price.
  - `BILLING_CODE.freeBusy` (4291, HTTP 429): the puzzle would spend free credits, past the hourly cap.
- A request the client aborted (Cancel) is not charged: the transaction rolls back.
- `User.credits >= 0` is a DB check constraint.
- No prefetching: every puzzle is built only when asked for.

## Data (history for analysis)

| Table | One row per | Notes |
|---|---|---|
| `CreditEntry` | balance change | append-only: `delta`, `balanceAfter`, `reason` (`purchase`/`generation`/`refund`), `puzzleId`, `paymentId`, `adjustmentId` |
| `Payment` | Paddle transaction (`txn_…`) | `pending` at checkout → `completed`/`failed`/`refunded`; customer `total`, `tax`, Paddle `fee`, our `earnings` (cents, `currency`), `payoutEarnings` (payout currency), `paymentMethod`, `refundedCredits` |
| `PaymentEvent` | Paddle webhook | raw payload, `processedAt`; redeliveries are handled once |
| `FreeSpend` | puzzle that took free credits | `month`, `holder` (`user:<id>`/`guest:<id>`), `ipKey`, `amount` (a holder's month adds up to at most 11) |

```sql
-- Revenue per month, in the payout currency
SELECT to_char("completedAt", 'YYYY-MM') AS month, "payoutCurrency", count(*) AS sales,
       sum("payoutEarnings") / 100.0 AS earnings
FROM "Payment" WHERE status IN ('completed', 'refunded') GROUP BY 1, 2 ORDER BY 1;

-- Checkout conversion per pack
SELECT pack, count(*) AS opened, count(*) FILTER (WHERE status = 'completed') AS paid FROM "Payment" GROUP BY pack;

-- Bought credits spent per month, and free credits spent
SELECT to_char("createdAt", 'YYYY-MM') AS month, -sum(delta) AS credits_spent, count(*) AS paid_puzzles
FROM "CreditEntry" WHERE reason = 'generation' GROUP BY 1 ORDER BY 1;
SELECT month, sum(amount) AS free_credits, count(DISTINCT holder) FILTER (WHERE holder LIKE 'user:%') AS accounts,
       count(DISTINCT holder) FILTER (WHERE holder LIKE 'guest:%') AS guests
FROM "FreeSpend" GROUP BY month ORDER BY month;

-- A user's ledger
SELECT "createdAt", reason, delta, "balanceAfter", "puzzleId", "paymentId" FROM "CreditEntry"
WHERE "userId" = '<id>' ORDER BY "createdAt";
```

## Refunds and chargebacks

Approved `refund` / `chargeback` adjustments take back the pack's credits (a share of them for a
partial refund), but never more than the balance holds: credits already spent stay spent. Each
adjustment is applied once (`CreditEntry.adjustmentId` is unique). Refunds are issued in the Paddle dashboard.

## Admin mails

The admin inbox (the mail engine's internal endpoint) hears of every purchase step —
`server/src/services/paymentNotifications.ts`, built by `paymentMail.ts`:

| Mail | When | Device facts |
|---|---|---|
| Checkout opened | `POST /billing/checkout` opened a Paddle transaction | yes — the click on "Buy" |
| Checkout FAILED to open | Paddle refused the transaction (bad key or price id?) | yes |
| Credits added | the webhook completed the payment (once, by the status guard) | no — a webhook |
| Refund approved / CHARGEBACK | an approved adjustment took credits back (once per adjustment) | no |
| Payment NOT credited — settle it by hand | a completed transaction with no `Payment` row, or not the pack's price | no |

- Sent only in production; elsewhere each mail prints to the API log.
- Fire and forget: a failed mail is logged, never fails a checkout or a webhook.
- Checkout mails are capped at 30 an hour (the engine's budget is shared with account mail);
  mails about money that moved are never capped.
- Device facts are what the request and the browser say (`lib/request-info.ts`,
  `src/helpers/clientInfo.ts`): unverified, for reading only, never for a decision.

## Changing prices

- Puzzle price: `SIZE_CREDITS` / `DIFFICULTY_CREDITS` in both twin files.
- Pack price: make a new price in Paddle, update `PADDLE_PRICE_ID_*` and `CREDIT_PACKS.usd`.
- Pack size: `CREDIT_PACKS.credits`. Pending payments keep the credits they were opened with.
- Free credits: `FREE_MONTHLY_CREDITS` in both twin files. The number is written out in the copy (FAQ, Terms,
  `Home.faq1Answer`, `Credits.subtitle`, `Seo.creditsDescription`) — `tests/unit/i18n/freeCredits.spec.ts`
  fails until the English matches.
- Then update the FAQ answer "How much does a puzzle cost?" in `src/messages/*.json`, and this file.
