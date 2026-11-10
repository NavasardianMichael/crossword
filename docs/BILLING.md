# Billing — the business model

Credits, no subscription. Setup steps: [PADDLE_SETUP.md](PADDLE_SETUP.md).

## Free puzzles

| Who | Free puzzles | Resets |
|---|---|---|
| Guest device (httpOnly cookie `crossword-guest`) | 1 per month | 1st of the month, 00:00 UTC |
| Signed-in account | 1 per month, on top of the guest one | same |

- At most `GUEST_FREE_PER_IP` (default 3) guest devices per IP address per month, so clearing cookies doesn't give endless free puzzles.
- After the guest's free puzzle: "sign in for one more every month, and to buy credits".
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

The real price is the Paddle price (`PADDLE_PRICE_ID_*`). Paddle localizes currency and adds tax.
`CREDIT_PACKS.usd` is only shown until Paddle answers.

## Costs (why these numbers)

- Gemini: about $0.02 per generation of ~12 new words (`gemini-3.8-flash`, Jan-2027 rates). The worst case
  for a large grid with every word fresh is about $0.08. Most puzzles come from the pool and cost far less.
- Paddle: 5% + $0.50 per payment. So the smallest pack is $4.99, not lower.
- A daily player (medium/medium, ~330 credits a month) pays about $6.60 a month: about NYT ($5) and Grid Genius ($7.99).

## Rules in code

- **Charge** = inside the transaction that stores the puzzle (`services/billing.ts › chargeForPuzzle`):
  the free puzzle first (`FreePuzzle`, unique per month and holder), else
  `UPDATE "User" SET credits = credits - price WHERE credits >= price`. If neither covers it → 402, nothing is stored.
  - `BILLING_CODE.signInRequired` (4021): the guest's free puzzle is used.
  - `BILLING_CODE.insufficientCredits` (4022): signed in, free puzzle used, balance too low.
- A request the client aborted (Cancel) is not charged: the transaction rolls back.
- `User.credits >= 0` is a DB check constraint.
- No prefetching: every puzzle is built only when asked for.

## Data (history for analysis)

| Table | One row per | Notes |
|---|---|---|
| `CreditEntry` | balance change | append-only: `delta`, `balanceAfter`, `reason` (`purchase`/`generation`/`refund`), `puzzleId`, `paymentId`, `adjustmentId` |
| `Payment` | Paddle transaction (`txn_…`) | `pending` at checkout → `completed`/`failed`/`refunded`; customer `total`, `tax`, Paddle `fee`, our `earnings` (cents, `currency`), `payoutEarnings` (payout currency), `paymentMethod`, `refundedCredits` |
| `PaymentEvent` | Paddle webhook | raw payload, `processedAt`; redeliveries are handled once |
| `FreePuzzle` | free puzzle claimed | `month`, `holder` (`user:<id>`/`guest:<id>`), `ipKey` |

```sql
-- Revenue per month, in the payout currency
SELECT to_char("completedAt", 'YYYY-MM') AS month, "payoutCurrency", count(*) AS sales,
       sum("payoutEarnings") / 100.0 AS earnings
FROM "Payment" WHERE status IN ('completed', 'refunded') GROUP BY 1, 2 ORDER BY 1;

-- Checkout conversion per pack
SELECT pack, count(*) AS opened, count(*) FILTER (WHERE status = 'completed') AS paid FROM "Payment" GROUP BY pack;

-- Credits spent per month, and free puzzles taken
SELECT to_char("createdAt", 'YYYY-MM') AS month, -sum(delta) AS credits_spent, count(*) AS paid_puzzles
FROM "CreditEntry" WHERE reason = 'generation' GROUP BY 1 ORDER BY 1;
SELECT month, count(*) FILTER (WHERE holder LIKE 'user:%') AS accounts, count(*) FILTER (WHERE holder LIKE 'guest:%') AS guests
FROM "FreePuzzle" GROUP BY month ORDER BY month;

-- A user's ledger
SELECT "createdAt", reason, delta, "balanceAfter", "puzzleId", "paymentId" FROM "CreditEntry"
WHERE "userId" = '<id>' ORDER BY "createdAt";
```

## Refunds and chargebacks

Approved `refund` / `chargeback` adjustments take back the pack's credits (a share of them for a
partial refund), but never more than the balance holds: credits already spent stay spent. Each
adjustment is applied once (`CreditEntry.adjustmentId` is unique). Refunds are issued in the Paddle dashboard.

## Changing prices

- Puzzle price: `SIZE_CREDITS` / `DIFFICULTY_CREDITS` in both twin files.
- Pack price: make a new price in Paddle, update `PADDLE_PRICE_ID_*` and `CREDIT_PACKS.usd`.
- Pack size: `CREDIT_PACKS.credits`. Pending payments keep the credits they were opened with.
- Then update the FAQ answer "How much does a puzzle cost?" in `src/messages/*.json`, and this file.
