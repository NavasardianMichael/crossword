# Paddle setup — manual steps

What you do by hand so that credit packs can be paid. Do **sandbox** first, then **live**.
Sandbox and live are separate accounts: separate keys, secrets and price ids.
The business model: [BILLING.md](BILLING.md).

Values used below: web `https://crossword.eapps.site`, API `https://api.crossword.eapps.site`.

## Part 1 — Sandbox

### 1. Account
1. Sign up at https://sandbox-vendors.paddle.com.

### 2. Product and three prices
1. **Catalog → Products → New product**. Name: `Crossword AI credits`. Tax category: **Standard digital goods**. Save.
2. In the product, **New price** three times. Each: **One-time** (not recurring), currency **USD**:

   | Description | Amount |
   |---|---|
   | `Starter — 200 credits` | 4.99 |
   | `Popular — 600 credits` | 11.99 |
   | `Big — 2000 credits` | 29.99 |

3. Copy each price id (`pri_…`). You need them in step 6.

### 3. API key (server)
1. **Developer tools → Authentication → API keys → New API key**.
2. Permissions: **Transactions: Read** and **Transactions: Write** (checkout creation and localized prices). Nothing else.
3. Expiry: the longest offered (max 1 year). Put a calendar reminder 2 weeks before it.
4. Copy the key → `PADDLE_API_KEY`.

### 4. Client-side token (browser)
1. **Developer tools → Authentication → Client-side tokens → New client-side token**.
2. Copy it (`test_…`) → `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`.

### 5. Default payment link
1. **Checkout → Checkout settings → Default payment link**: `https://crossword.eapps.site/en/payments/checkout`. Save.
   (Required before any checkout can open. Each checkout we create passes its own language's URL.)

### 6. Local env files
`server/.env.development.local`:
```dotenv
PADDLE_API_KEY="<step 3>"
PADDLE_WEBHOOK_SECRET="<step 8>"
PADDLE_SANDBOX="true"
PADDLE_PRICE_ID_STARTER="pri_…"
PADDLE_PRICE_ID_POPULAR="pri_…"
PADDLE_PRICE_ID_BIG="pri_…"
```
`.env.local` (repo root):
```dotenv
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN="test_…"
NEXT_PUBLIC_PADDLE_ENV="sandbox"
```
Restart `pnpm dev` after changing them.

### 7. Tunnel the API (webhooks cannot reach localhost)
```bash
ngrok http 9007
```
Copy the `https://….ngrok-free.app` URL. It changes on every ngrok restart (then repeat step 8's URL).

### 8. Webhook destination
1. **Developer tools → Notifications → New destination**.
2. Type **Webhook**. URL: `https://<ngrok host>/billing/webhook`.
3. Events — exactly these four:
   - `transaction.completed`
   - `transaction.payment_failed`
   - `adjustment.created`
   - `adjustment.updated`
4. Save. Open the destination, copy its **secret key** (`pdl_ntfset_…`) → `PADDLE_WEBHOOK_SECRET` (step 6). Restart the API.

### 9. Test end to end
1. `pnpm dev`, open `http://localhost:7007`, sign in.
2. **Credits** (`/en/credits`) → the packs show prices from Paddle → **Buy** on Starter.
3. The overlay opens. Card `4242 4242 4242 4242`, any future expiry, CVC `100`, any name/email/country.
4. After paying you land on `/en/payments/return` → "200 credits were added". The header shows the balance.
5. Check the database (`pnpm --filter crossword-server exec prisma studio`):
   - `Payment`: the row is `completed`, with `total`, `tax`, `fee`, `earnings`.
   - `CreditEntry`: `purchase +200`.
   - `PaymentEvent`: the `transaction.completed` event with `processedAt` set.
6. Redelivery: **Developer tools → Simulations → New simulation → `transaction.completed`** to the same URL (or replay it from the destination's logs where the dashboard has them) → `200`, balance unchanged.
7. Refund: Paddle → **Transactions → the transaction → Refund** (full). Sandbox approves refunds within ~10 min → `adjustment.updated` → balance −200 (or down to 0), `Payment.status = refunded`.
8. Declined card: `4000 0000 0000 0002` → `Payment.status = failed`, no credits.

If **Buy** answers "couldn't open the checkout" and the API log shows a Paddle error about the checkout URL
(localhost refused), test from a deployed environment with the sandbox credentials instead
(Part 2 steps 4–6 with the sandbox values), or set `CORS_ORIGIN`/`NEXT_PUBLIC_SITE_URL` to an https tunnel of the web app.

## Part 2 — Live

### 1. Account and verification
1. Sign up / log in at https://vendors.paddle.com.
2. Complete **business verification**: identity, business details, tax info, payout bank account.
   Business country: Armenia. Takes 1–3 business days.

### 2. Website approval
Paddle reviews the site before live checkouts work. Before you submit, these must be live on production:
- `/en/credits`: prices and what is sold.
- `/en/terms`: includes "Payments" (Paddle as Merchant of Record) and "Refunds" (14 days).
- `/en/privacy`: includes "Payments".
- A contact route (`/en/contact`).

Then:
1. **Checkout → Website approval → Add a new domain** → `crossword.eapps.site` → submit. Wait for approval.
2. **Checkout → Checkout settings → Default payment link** → `https://crossword.eapps.site/en/payments/checkout`.

### 3. Product, prices, key, token
Repeat Part 1 steps 2, 3 and 4 in the **live** dashboard. Live ids and keys are different. The live client token starts with `live_`.

### 4. Webhook destination
Part 1 step 8, with URL `https://api.crossword.eapps.site/billing/webhook` and the same four events. Copy the live secret.

### 5. Production API env
Add to `server/.env.production.local` (do **not** add `PADDLE_SANDBOX`):
```dotenv
PADDLE_API_KEY="<live key>"
PADDLE_WEBHOOK_SECRET="<live secret>"
PADDLE_PRICE_ID_STARTER="pri_…"
PADDLE_PRICE_ID_POPULAR="pri_…"
PADDLE_PRICE_ID_BIG="pri_…"
```
Then update the `ENV_API_BASE64` GitHub secret:
```bash
pnpm env:base64 production | clip
```
GitHub → Settings → Secrets and variables → Actions → Secrets → `ENV_API_BASE64` → Update → paste.

### 6. Production web secrets
GitHub → Settings → Secrets and variables → Actions → **Secrets** → New repository secret:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | live client-side token (`live_…`) |
| `NEXT_PUBLIC_PADDLE_ENV` | `production` |

### 7. Deploy
Run **Deploy to Production**. It applies the billing migration (`prisma migrate deploy`) and builds the web app with the token.

### 8. Live smoke test
1. Buy the Starter pack with your own card on production.
2. Check: return page shows the credits; Paddle → **Notifications → Logs** shows `200` for `transaction.completed`; the `Payment` row is `completed`.
3. Refund it in Paddle → credits are taken back after approval.

## Ongoing

| When | Do |
|---|---|
| API key expires (≤ 1 year) | Part 1 step 3 again → new `PADDLE_API_KEY` → `ENV_API_BASE64` → deploy → revoke the old key. Expired key = checkout fails with `invalid_token`. |
| Rotate the webhook secret | New destination (same URL, same 4 events) → `PADDLE_WEBHOOK_SECRET="new,old"` → deploy → delete old destination → `PADDLE_WEBHOOK_SECRET="new"` → deploy. API log line `verified with a fallback secret` = rotation unfinished. |
| A webhook failed | Paddle → Notifications → Logs → resend. Every event is also stored raw in `PaymentEvent`. |
| Change a pack price | New price in Paddle → new `PADDLE_PRICE_ID_*` → update `CREDIT_PACKS.usd` and the FAQ ([BILLING.md](BILLING.md)) → deploy. |
| Refund request | Paddle → Transactions → Refund. Credits are taken back automatically. |
