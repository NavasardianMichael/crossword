# Pre-release review — 2026-11-12

A read-only review of the whole app before the production launch: security, billing, performance,
reliability, design/UX, responsiveness, accessibility, i18n, SEO, PWA, CI/deploy. Every finding was
checked in the code at `d686dec`; ✔ marks the ones re-checked by hand (run or read twice).

**Priorities:** **P0** fix before release · **P1** at release or the week after · **P2** should
improve · **P3** nice to have.

The base is strong (see [What is already solid](#what-is-already-solid)) — the list below is short on
purpose and skips nits.

## Status (2026-11-13)

Fixed: 1–8, 10–18, 20, 21, 23–29, 32. Partly: 9 (only the optional backup ping: no API
Sentry — it was removed on purpose in `847d3fa` — and no uptime monitors, by choice), 22 (unused `motion` removed; the dialogs it named
load only on the puzzle page), 30 (`/health` pool counts cached; the layout budget already yields
to I/O between tries), 31 (unit tests for the Gemini chain and the quota day; the DB paths still
want integration tests). P3: GIN queries, Pacific quota day, Paddle callback and
stale docs fixed.

Not done, on purpose: logout revocation (bumping `tokenVersion` would sign every device out; the
cookie is httpOnly), the mid-build clue-retirement 500 (a millisecond race that charges nothing), 19 (an address cap on accounts would lock out carrier-NAT users; the cost is
bounded by the daily Gemini budget), CSP script allowlist (only the directives that cannot break a
flow), the seed's `DO UPDATE` guard (it would drop the clue merge for existing words), keeping old
chunks across deploys, the "Finished" history section, pinning the deploy's SSH host key, and Google Fonts (kept, named on the privacy
page).

## Summary

| # | P | Area | Finding | Effort |
|---|---|---|---|---|
| 1 | P0 | Ops | No database backups — paid credits and the ledger live in one Docker volume | S |
| 2 | P0 | Security | `JWT_SECRET` silently falls back to a public default ✔ | XS |
| 3 | P0 | Security | Open redirect after sign-in via a tab in `returnTo` ✔ | XS |
| 4 | P0 | UX | On-screen keyboard breaks on 360px phones for ru, hy, uk, cs, he, ar, … ✔ | M |
| 5 | P0 | UX | "Next puzzle" after the free puzzle does nothing visible on 402 ✔ | S |
| 6 | P1 | CI | Integration tests (billing, webhooks) never gate a deploy ✔ | S |
| 7 | P1 | Reliability | Gemini calls have no timeout; model chain doesn't fall through on 404/504/network ✔ | S |
| 8 | P1 | Reliability | No graceful shutdown — every deploy cuts in-flight requests ✔ | S |
| 9 | P1 | Ops | No error tracking on the API, no uptime alert | S |
| 10 | P1 | Security | No HSTS on either host | XS |
| 11 | P1 | Legal | GA4 and Google Fonts load without consent (EU visitors) | M |
| 12 | P1 | Billing UX | "New puzzle" / "Next puzzle" charge credits without showing the price | S |
| 13 | P1 | SEO/Legal | Copy and JSON-LD say "free" / `price: 0`; the product is one free puzzle a month ✔ | S |
| 14 | P1 | i18n | Billing/Credits/Payments text is English in 9 locales ✔ | S |
| 15 | P1 | Responsive | Grid cells ~9–12px on common phones in play mode | M |
| 16–32 | P2 | mixed | CSP, abuse limits, bundle size, grid re-renders, SW cache, IDB, RTL zoom, … | — |
| — | P3 | mixed | Small hardening and polish | — |

---

## P0 — before release

### 1. No database backups
`deployment/docker-compose.prod.yml`, `docs/PRODUCTION_SETUP.md`, `docs/DEPLOYMENT.md` — no `pg_dump`,
no backup step anywhere. Users' purchased credits, the `CreditEntry` ledger, `Payment`s, accounts and
the AI-written word pool (real Gemini quota spent) all sit in one Docker volume on one VPS. A disk
failure, a mistaken `docker volume rm`, or a bad migration loses money you owe people.

**Fix:** a nightly cron on the host:
`docker exec crossword-postgres-prod pg_dump -U crossword -Fc crossword > /backups/crossword-$(date +%F).dump`,
keep ~14 days, and copy off the host (rclone to Backblaze B2 / S3 / another server). Do one test
restore into a scratch database. Add it to `PRODUCTION_SETUP.md` as a numbered step. Take a manual
dump before every deploy that carries a migration (migrations don't roll back).

### 2. `JWT_SECRET` falls back to a public default
`server/src/config.ts:22` — `jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me'`. Nothing
checks it at start-up, and the deploy guard checks only `DATABASE_URL`
(`.github/workflows/deploy.yml:437`). If the env secret ever lacks the line, anyone can forge a
session for any user and spend their credits; the same secret signs the OAuth state cookie.

**Fix:** in production, throw at start-up when it is missing, equals the default, or is under 32
chars. Add a `JWT_SECRET` line to the deploy's env guard next to `DATABASE_URL`.

### 3. Open redirect via a tab character in `returnTo`
`server/src/lib/return-path.ts:16-22` and its web twin `src/constants/auth.ts:31-37`. The check
refuses `//`, `/\` and CR/LF, but the URL parser strips tabs: `new URL('/\t/evil.example/x', origin)`
→ `https://evil.example/x` (verified in node). `api…/identity/google?returnTo=/%09/evil.example` sends
a victim through a real Google sign-in and then onto a phishing page.

**Fix:** reject any control char, space or backslash (`/[\x00-\x20\\]/`), or better, require
`new URL(value, origin).origin === origin`. Same change in both files; add the tab case to a test.

### 4. On-screen keyboard breaks on phones for most non-Latin layouts
`src/components/puzzle/OnScreenKeyboard.tsx:72,79,90,101`. Letter keys are `min-w-8 shrink-0`
(32px), while Erase and Direction are `flex-[1.5] min-w-0` and absorb the shortage. At 360px:
- ru/hy/he last row (9 letters) leaves ~10px each for Erase and Direction; uk and cs leave 0px.
- ru/uk top rows (12 keys) need ~428px, de 392px, cs's extra row 536px — they scroll sideways
  (`overflow-x-auto`) with no hint, so `х`/`ъ` are hidden off-screen.
- hy 10-key rows overflow by ~8px.

English happens to work, which is why it hasn't shown up. This is the core input on mobile for your
main audience (hy, ru).

**Fix:** give the special keys a fixed width (`min-w-11 shrink-0`); let letters shrink
(`min-w-0`, font tied to key width); split rows over ~11 keys instead of scrolling. Add a 360px
Playwright screenshot/assertion for ru and hy.

### 5. "Next puzzle" in the solved dialog dead-ends on 402
`src/components/puzzle/PuzzleBoard.tsx:119-130,160,178`. A guest solves the free puzzle and taps
"Next puzzle" → `createPuzzle` gets 402 → `newPuzzle` returns, the dialog stays open, and the
`CreateErrorAlert` (Sign in / Buy credits) renders *behind* the modal mask. The spinner just stops —
at the exact conversion moment.

**Fix:** close the solved dialog when creation fails (or render `CreateErrorAlert` inside it).

---

## P1 — at release or the week after

### 6. Integration tests never run on what gets deployed
`.github/workflows/ci.yml:15-17` runs only on `pull_request`; you push straight to master, and the
deploy's `verify` job (`deploy.yml:211-233`) runs unit tests only — its comment assumes ci.yml covers
integration. So the billing/webhook-redelivery tests that CLAUDE.md requires never gate a release.

**Fix:** add the Postgres service + `pnpm test:integration` to the deploy `verify` job (copy the
`services:` block from ci.yml), or trigger ci.yml on `push` and make deploy depend on it.

### 7. Gemini: no timeout, narrow fallback
- `server/src/lib/gemini.ts:63` — `new GoogleGenAI({ apiKey })` has no `httpOptions.timeout`, and
  `generateContent` gets no abort signal. One stalled call holds `POST /puzzles` until nginx's 90s
  504, and blocks the refill job (its `running` flag stays set).
- `gemini.ts:131` — only 429/500/503 fall through to the next model. A retired preview model (404),
  a 504, or a network error (no status) throws on the first model every time, with no cooldown.

**Fix:** `httpOptions: { timeout: 25_000 }`; give the inline top-up one overall ~30s deadline and
leave the rest to the refill job. Treat 404/504/status-less as fall-through; 404 gets an hours-long
cooldown and a loud log.

### 8. No graceful shutdown
`server/src/index.ts` — no SIGTERM handler, no `server.close()`, no `prisma.$disconnect()`. Every
deploy's `systemctl restart` kills in-flight requests: a `POST /puzzles` whose charge committed but
whose response wasn't written leaves the player charged and retrying.

**Fix:** on SIGTERM: clear the refill interval, `server.close()`, wait for in-flight requests (cap
~20s; `TimeoutStopSec` is 30), `prisma.$disconnect()`, exit.

### 9. No error tracking on the API, no uptime alert
`server/src/middleware/error.ts:150`, `poolRefill.ts:61,88`, `puzzleBuilder.ts:90` log to journald
only. Nobody is told when the webhook handler throws (Paddle keeps redelivering), the pool stops
refilling, or Gemini starts 404ing.

**Fix:** `@sentry/node` with `sendDefaultPii: false`, `Sentry.setupExpressErrorHandler(app)`, and
`captureException` in the refill/generation/webhook catch blocks. Add a free uptime monitor
(UptimeRobot/Better Stack) on `https://api…/health` and `https://crossword…/en`.

### 10. No HSTS
Neither `next.config.ts:13-24` nor either nginx 443 block sets `Strict-Transport-Security`, and
certbot's include doesn't add it.

**Fix:** in both 443 server blocks:
`add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`
(only add `includeSubDomains` if every `*.eapps.site` host is HTTPS — otherwise scope it per host.)

### 11. Analytics and fonts without consent
`src/components/analytics/Analytics.tsx:5` loads GA4 (sets `_ga` cookies) on every page with no
consent banner or Consent Mode; `src/styles/fonts.ts:57-65` / `layout.tsx:101-107` pull some scripts'
fonts from fonts.googleapis.com (visitor IP to Google — LG München 2022). The privacy copy
("Neither is used to identify you", `en.json` Privacy) understates GA.

**Fix:** pick one — (a) Consent Mode v2, denied by default, plus a small accept/decline bar; or
(b) switch to cookieless analytics (Plausible/Umami/GA with `client_storage: 'none'`) and skip the
banner. Self-host the fonts (`next/font/google` already self-hosts; or files in `public/`). Update
the privacy page to match.

### 12. Re-creating a puzzle spends credits without showing the price
`PuzzleBoard.tsx:119-123,221-241`, `Toolbar.tsx:61`, `SolvedDialog.tsx:54`. One tap re-creates with
the saved options and charges (up to 15+ credits); no `PuzzleCost`, no confirmation. The Terms say
"at the price shown before you create one".

**Fix:** show `PuzzleCost` next to "New puzzle" / "Next puzzle", or confirm with the price when the
puzzle isn't free.

### 13. "Free" claims don't match the billing model
`en.json` `Seo.homeTitle` ("Free AI Crossword Generator"), `Seo.crosswordTitle/Description` ("Play
free… No sign-up"), `Common.tagline`, `Home.hero.lede`, scanword/topic SEO strings;
`src/app/manifest.ts:15`; `src/linkedDataSchema/index.ts:58-59` (`isAccessibleForFree: true`,
`offers price: 0`) and `:163` (HowTo `estimatedCost 0`). Misleading for users, against Google's
structured-data rules, and something Paddle's website review can flag.

**Fix:** "free to try" / "first puzzle free each month"; `AggregateOffer` with `lowPrice: 0`,
`highPrice` = biggest pack; drop `isAccessibleForFree`. Rewrite natively in every catalogue; bump
`CONTENT_UPDATED_AT`.

### 14. Billing text untranslated in 9 locales
fil, he, hu, ms, sv, sw, ta, th, ur carry ~45 `Billing.*` / `Credits.*` / `Payments.*` strings
(plus `Seo.creditsTitle/Description`) identical to English — verified for sv/he/fil. The price line,
the sign-in/buy alerts and the credits page are English, inside RTL pages for he/ur.
`scripts/check-messages.mjs` compares keys only.

**Fix:** translate them; add a check that flags values identical to `en` (with an allow-list for
brand names, numbers, etc.).

### 15. Grid cells are tiny on phones in play mode
`globals.css:551-568`, `PuzzleBoard.tsx:181-195`, `BoardViewport.tsx:279`. On 360×~584 visible px
with the hy keyboard: top bar ~60 + clue bar ~88 + keyboard ~210 + zoom row 52 + padding ≈ 158px
left for the grid → a 13×13 classic gets ~12px cells, a 13×17 scanword ~9px (in-cell clues
unreadable).

**Fix:** move zoom buttons onto a board corner (pinch already works); lower the clue bar's min
height and use `h-10` keys when `height < 700px`; consider auto-zooming to the active word when
cells would be under ~24px. Test on a real 360px Android.

---

## P2 — should improve

16. **No Content-Security-Policy** — `next.config.ts:17-22`. Add a static allowlist CSP (nonces would
    make pages dynamic): `script-src 'self' 'unsafe-inline'` + googletagmanager + cdn.paddle.com;
    `connect-src` API/GA/Paddle/Sentry tunnel; `frame-src` Paddle; `style-src` + Google Fonts. Ship as
    `Content-Security-Policy-Report-Only` first.
17. **Free-puzzle and report limits keyed on full IPv6** — `server/src/lib/request.ts:78-82`,
    `middleware/rateLimit.ts:15`, `services/billing.ts:35`, `entryPool.ts:391-401`. A /64 gives
    unlimited addresses → endless guest free puzzles, bypassed rate limits, and one person can
    "3-reporter"-retire any word. **Fix:** one shared `clientKey(req)`: IPv6 → /64 prefix,
    `::ffff:a.b.c.d` → IPv4.
18. **Parallel `POST /puzzles` each do a full build before the 402** —
    `routes/puzzles.ts:48-58`, `puzzleBuilder.ts:104-112`. 12 parallel guest requests can each run an
    inline Gemini top-up and burn `POOL_DAILY_CALL_BUDGET` for everyone. **Fix:** in-memory per-payer
    in-flight `Set` → 429 for a second concurrent build; optionally inline top-up only for signed-in
    payers.
19. **Account farming for the monthly free puzzle** — `billing.ts:33-37` exempts users from the IP
    cap; Gmail dots/`+tag` give unlimited verified accounts. **Fix:** also count `user:` holders
    against the IP key (cap ~5/month), or canonicalise Gmail addresses on sign-up.
20. **Whole message catalogue shipped to every page** — `src/app/[lang]/layout.tsx:114`
    (`NextIntlClientProvider` without `messages`). `en.html` 353 KB, `bn.html` 414 KB, including
    privacy/FAQ text on `/play`. **Fix:** `messages={pick(messages, CLIENT_NAMESPACES)}`.
21. **Grid re-renders every cell per keystroke** — `src/components/puzzle/Grid.tsx:53-58,86-101,200`.
    221 cells × `labelFor` (3–5 ICU `t()` calls) per letter on a 13×17. **Fix:** a memoized `Cell`
    with primitive props and stable callbacks; verify with React Profiler on a throttled phone.
22. **Heavy shared JS** — ~1.48 MB uncompressed in 22 chunks on the home page (Sentry 161 KB, motion
    + rc-components 153 KB). **Fix:** `next/dynamic` for `SolvedDialog` (pulls confetti + motion),
    `ShareDialog`, `ReportDialog`, `PdfDialog`; check whether `Hero`'s motion can be CSS.
23. **Service worker: unbounded cache, never refreshed, offline shell may be blank** —
    `src/helpers/pwa.ts:15,88,122-150`. `PWA_CACHE_VERSION = 'v2'` is fixed, so `/sw.js` is
    byte-identical each deploy: precached shells never refresh and old `/_next/static` entries pile up;
    every `/p/<id>` and `/auth/*` page is cached (reset/verify tokens are in that HTML); the play
    shell's JS chunks aren't precached, so an offline shared link opened without ever visiting
    `/play` renders blank; `PUZZLE_PATH` is `[a-z]{2}`, missing `fil`. **Fix:** put the build ID in
    the worker version (reinstall + prune per deploy); precache the shell's `<script>`/`<link>`
    assets at install; cap the pages cache (~50) and skip `/auth/*`; `[a-z]{2,3}` or build from
    `LOCALES`.
24. **IndexedDB connection never recovers; upgrade breaks on the next version** —
    `src/helpers/offline/db.ts:42-52`. A Safari-`terminated` or rejected open stays cached → every
    save fails silently (progress lost, no Sentry). `upgrade()` ignores `oldVersion`, so
    `IDB_VERSION = 2` will throw "store already exists". **Fix:** `terminated() { dbPromise = null }`,
    reset on reject, branch on `oldVersion`.
25. **Headings clip at 320–360px** — `Hero.tsx:104`, `PageHeader.tsx:16`, `globals.css:202-218`.
    `--text-display` floors at 36px and nothing wraps: "meghatározásokkal" (hu),
    "Kreuzworträtsel," (de) are cut by `overflow-x: hidden`. **Fix:** `overflow-wrap: anywhere;
    hyphens: auto` on h1–h4 in §3 base.
26. **Zoom/pan ignore RTL** (ar, fa, he, ur) — `src/hooks/useBoardZoom.ts:53,106,134`,
    `BoardViewport.tsx:318`. RTL `scrollLeft` is ≤ 0, so anchoring jumps to an edge. **Fix:** mirror x
    under `dir="rtl"`, `origin-top-right`.
27. **Payment return page stalls** — `src/components/billing/PaymentReturn.tsx:46-59,69`. A `failed`
    payment spins the full 60s; a network error ends in an alert with no retry or way back. **Fix:**
    stop on `failed`; `onRetry` + "Back to credits" link.
28. **Dead ends without a next step** — "puzzle not found" (`PuzzleBoard.tsx:141-148`) shows only a
    WifiOff icon; `/[lang]/play` without `?id` renders empty (`OfflinePlay.tsx`). **Fix:** "Make a
    puzzle" / "My puzzles" buttons in both.
29. **Installed app always opens in English** — `src/app/manifest.ts:19` uses `/en` on purpose (a
    redirecting `start_url` can loop). **Fix:** a per-locale manifest
    (`/[lang]/manifest.webmanifest` linked from the `[lang]` layout) so hy/ru installs open in hy/ru.
30. **Server hot-path costs** — `/health` (`app.ts:38-43`, `entryPool.ts:350`) runs a full-table
    `groupBy` per call and the sign-in UI hits it per tab (`GoogleButton.tsx:15`): make it `SELECT 1`
    and move `google`/`gemini` flags to a cheap `/config`. The 250ms layout budget is per try, so the
    fallback ladder can block the event loop ~1.5–2s (`puzzleBuilder.ts:104-130`): use one deadline
    per request.
31. **The quota-spending paths are untested** — budget check (`entryPool.ts:180`), in-flight dedup,
    refill tick cap, model cooldown/fall-through, judge parsing, "re-insert never revives a retired
    entry". **Fix:** unit tests with the GenAI client mocked + one integration test for retired
    entries.
32. **CSS `uppercase` on pool words** — `src/app/[lang]/topics/[slug]/page.tsx:88` (`և` → `ԵՒ`).
    **Fix:** `displayCell`, and widen the gate from `src/components/puzzle` to `src/app` too.

---

## P3 — nice to have

- **Logout doesn't revoke** the 30-day session (`routes/identity.ts:127-130`) — bump `tokenVersion`
  or add "sign out everywhere".
- **Rare 500 when a clue is retired mid-build** (`puzzleBuilder.ts:162-165`, `list[0]!`) — filter
  entries with no clue options before building.
- **GIN index on `Entry.topics` unused** — raw queries use `= ANY(topics)`; switch to
  `topics @> ARRAY[...]` or drop the index.
- **Daily budget resets at UTC midnight**, Google at midnight Pacific (`entryPool.ts:151`) — use
  `America/Los_Angeles`. The check can also overshoot by a few calls across concurrent paths; fine on
  one process, worth a comment.
- **Seed rewrites ~5,300 rows each deploy** (`entryPool.ts:60-62`) — add
  `WHERE NOT ("Entry".topics @> EXCLUDED.topics)` to the `DO UPDATE`.
- **Paddle `onEvent` outlives the checkout page** (`PaddleCheckout.tsx:42-64`) — check `cancelled`
  inside it and `Checkout.close()` on cleanup.
- **Open tabs across a deploy** — nginx serves `/_next/static` from `web/current` only, so a tab
  opened before a deploy 404s on its old lazy chunks. Next hard-reloads on most chunk errors, so it's
  minor; copying the previous release's `.next/static` into the new one during deploy removes it.
- **`ssh-keyscan` at deploy time** trusts whatever answers (`deploy.yml:419`) — store the host key
  in a `SSH_KNOWN_HOSTS` secret instead.
- **Solved puzzles vanish from "My puzzles"** (`SavedGames.tsx:31`) — a "Finished" section.
- **RTL OG images and the offline page are English-only** (`helpers/socialCard.tsx:46`,
  `pwa.ts:25`).
- **Stale docs:** `DEPLOYMENT.md` still says 3 locales / 63 sitemap URLs (there are 33 locales), and
  its manual re-seed snippet *sources* `.env.api` — exactly what the deploy script warns breaks on
  `&`/`$`. `passport-google-oauth20` has had no release since 2019 (works; watch it).

---

## What is already solid

- **Billing:** webhook HMAC over raw bytes with timing-safe compare and secret rotation; event stored
  before processing; `Payment.status` guard + unique `adjustmentId` make redelivery safe; trusts its
  own `Payment` row, never `custom_data`. Balance changes are conditional `UPDATE … RETURNING` + a
  `CreditEntry` in one transaction, backed by a DB check constraint; free puzzle is a unique
  `(month, holder)` row.
- **Auth:** argon2id with dummy verify, hashed single-use 256-bit tokens, no account enumeration,
  httpOnly `SameSite=Lax` Secure cookie with `tokenVersion` checked per request, Google OAuth with
  PKCE + signed state, squatting closed.
- **API hygiene:** Origin/Referer CSRF check on every write, single-origin CORS, `trust proxy` 1,
  validated inputs everywhere, 64 KB body cap, only tagged-template raw SQL, generic production
  errors. No user text ever reaches a Gemini prompt; daily budget persisted in Postgres.
- **Performance:** seen-list exclusion is one `int[]` param with `NOT EXISTS`; indexes match the
  queries; layout is pure, seeded, time-bounded and fuzz-tested; 969 statically prerendered routes;
  pdf-lib loads only on demand; bounded in-memory state.
- **Web:** ARIA grid with one tab stop and a live region, RTL arrow keys, `dir`/`lang` set, reduced
  motion honoured, `dvh` + safe areas + `interactiveWidget`, 44px controls (bar the keyboard), skip
  link, focus-visible outline, no hard-coded strings, ICU plurals, error boundaries, progress saved
  debounced and flushed on `pagehide`, leave guard.
- **SEO:** central metadata, self-canonicals, full hreflang + `x-default`, noindex on personal pages,
  escaped JSON-LD, shared-puzzle previews that never leak answers.
- **Delivery:** strict TS, ESLint with security/a11y rules at zero warnings, grep gates, deploy that
  smoke-boots the standalone bundle, API-first ordering, migrate → seed → symlink → health wait,
  releases kept for rollback, Sentry on the web with no PII and a tunnel.

## Suggested order

1. **Day 0 (≈ half a day):** #1 backups, #2 JWT guard, #3 return-path, #5 solved-dialog 402, #10 HSTS,
   #6 integration tests in deploy.
2. **Before announcing:** #4 keyboard, #13 "free" copy, #12 price on re-create, #14 translations,
   #7–#9 Gemini timeout / shutdown / Sentry + uptime, #11 consent decision.
3. **First weeks:** #15 small-phone board, then P2 by impact on players (#21, #23, #24, #25, #17–#19).

## Manual steps after the fixes (updated 2026-11-14)

What code cannot do by itself, in order. **[PC]** your machine, repo root · **[SRV]** server, as
`michael` · **[GH]** GitHub repo settings · **[WEB]** a browser.

### Before pushing

1. **Migrate your local database** **[PC]**: stop `pnpm dev`, run `pnpm db:setup`, start `pnpm dev`
   again. The free puzzle became free credits, a schema change; the running dev server also holds
   Prisma's engine file, so the client is regenerated only after the restart.
2. **Run the tests that need Postgres** **[PC]** (Docker Desktop running):
   ```powershell
   pnpm db:up
   pnpm test:integration
   ```
   Then e2e: in one terminal start the app with
   `$env:RATE_LIMIT_ENABLED='false'; $env:BILLING_ENABLED='false'; pnpm dev`, and in a second one
   run `pnpm test:e2e`. Close that first terminal afterwards: PowerShell keeps both variables for
   the whole session, so a later `pnpm dev` there would build every puzzle without charging credits
   (the API warns about it at startup).
3. **Check `server/.env.production.local`** **[PC]**:
   - `JWT_SECRET` must be at least 32 characters, or the deploy stops and the API refuses to
     start. To make one, run `openssl rand -hex 64` in Git Bash and paste it as `JWT_SECRET="…"`.
     A new secret signs everyone out once.
   - Optional: `FREE_PUZZLES_PER_HOUR="200"` — puzzles that may take free credits in an hour,
     all players together. Leave it out for the default of 200.
4. **If you changed that file**, re-encode it **[PC]** with `pnpm env:base64 production | clip`, then
   **[GH]** Settings → Secrets and variables → Actions → `ENV_API_BASE64` → Update, and paste.
5. **Backups to Google Drive, and one backup now** **[PC]** **[SRV]**: this push carries a database
   migration (`FreePuzzle` becomes `FreeSpend`), and migrations do not roll back. Follow
   [PRODUCTION_SETUP.md step 8](PRODUCTION_SETUP.md#8-database-backups-to-google-drive-pc-srv-once).
   In short: install rclone from its rclone.org `.deb` (apt's copy is too old for Google's sign-in) → `rclone config` (remote `gdrive`, scope `drive.file`, sign
   in through `rclone authorize "drive" …` on the PC) → paste `deployment/backup-db.sh` into
   `/home/michael/apps/crossword/shared/backup-db.sh` → `chmod 700` it → run it once by hand and
   check the dump is on Drive → add the cron line → do the restore drill once. Dumps are kept 22 days.
6. **Backup alert** (optional) **[WEB]**: create a check at https://healthchecks.io (period 1 day,
   grace 2 hours) and put its URL in the `PING_URL="…"` line of the server's `backup-db.sh`.
7. **Commit and push to `master`.** The deploy's first job, **Check configuration**, checks every
   secret and stops the run within seconds if one is missing or wrong; its log names the secret and
   the fix. Yellow warnings there are optional features that are off. The `verify` job then runs the
   integration tests, and the API deploy applies the migration: anyone who already took this
   month's free puzzle counts as having spent this month's 11 free credits.

### On the server, after the deploy is green

8. **HSTS** **[SRV]**: paste both confs again. Empty each one first, then paste the repo file into
   it:
   ```bash
   sudo truncate -s 0 /etc/nginx/sites-available/crossword.eapps.site.conf
   sudo nano /etc/nginx/sites-available/crossword.eapps.site.conf          # deployment/crossword.eapps.site.conf
   sudo truncate -s 0 /etc/nginx/sites-available/api.crossword.eapps.site.conf
   sudo nano /etc/nginx/sites-available/api.crossword.eapps.site.conf      # deployment/api.crossword.eapps.site.conf
   sudo nginx -t && sudo systemctl reload nginx
   ```
   Check from **[PC]**: `curl.exe -sI https://crossword.eapps.site/en | findstr /i strict` should
   print `Strict-Transport-Security: max-age=31536000`.
### Check by hand on the live site

9. **Free credits, as a guest** **[WEB]**, in a private window: the header's coin button shows
    **11**, and the credits page says the 11 are free and when they renew. Make a small easy puzzle:
    the balance drops to **6**. Pick a large puzzle: the cost line says your free credits don't cover
    it, with a Sign in link.
10. **Free credits, signed in** **[WEB]**: a new account also starts with 11. "New puzzle" from a
    finished puzzle goes straight through while the free credits cover it, and asks with the price
    first once bought credits would be spent. After a refused payment, the solved dialog closes and
    opens the "Time for more credits" dialog (Sign in for a guest, Buy credits for an account).
11. **Account** **[WEB]**: menu → **Sign out** asks first ("Not now" / "Sign out"). With the site open
    in two tabs, spend credits in one, switch to the other: its header balance catches up.
12. **Consent banner** **[WEB]**: it shows only where an opt-in is needed (EU/EEA, UK, Switzerland —
    by the device's time zone, `src/constants/consent.ts`). From Armenia: a private window shows no
    banner and sets `_ga*` cookies at once. To test the EU case, DevTools → ⋮ → More tools →
    Sensors → Location → Berlin (it overrides the time zone), reload in a fresh private window:
    the banner shows, and there is no `_ga*` cookie until you click **Accept** or the **×**
    (closing counts as accepting); **Decline** keeps it cookieless. Footer → **Cookie settings**
    reopens the banner anywhere. After a couple of days, GA4 → Admin → Data streams → the
    stream → **Consent settings** should report consent mode as active.
13. **Phone, at 360px wide** (a real phone, or DevTools device mode) **[WEB]**: in `ru`, `hy`, `ja`
    and `ar`, check that the on-screen keyboard fits without scrolling and long rows split in two,
    that the consent banner doesn't cover the keyboard, that the grid uses the freed height on a
    short screen (the zoom buttons are hidden there), and that the price table on the credits page
    fits without sideways scrolling.
14. **Offline** **[WEB]**: DevTools → Application → Service workers should list
    `/sw.js?locale=<your language>`. Open a puzzle, go offline in the Network tab, and reload: the
    puzzle should still load. `https://crossword.eapps.site/manifests/hy.webmanifest` should
    open with Armenian `name` and `start_url` `/hy`.
15. **Translations**: have a native speaker check the 30 machine-written catalogues (en, ru and hy
    were written by hand). Start with what changed most recently: the free-credits copy (`Billing`,
    `Credits`, the first three FAQ answers, `Terms` "Free and bought credits", the privacy cookie
    paragraph), the sign-out dialog (`Auth.signOutConfirm`), `Auth.tooManyAttempts` and
    `Billing.refusedFreeBusy`. Known doubts: the Arabic plural forms for 11, German "Gratis-Punkte",
    Swahili "mikopo" for credits, Hungarian "Mehet" on the create button, the mix of "palaisipan" and
    "puzzle" in Filipino, and mixed formal/informal address in `uk`, `cs` and `fa`.
