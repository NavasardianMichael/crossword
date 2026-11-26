# API — invariants

- **Layers:** `routes/*` (HTTP, validation, mounted only in `app.ts`) → `services/*` (logic) →
  `lib/*` (pure utilities: alphabet, layout, gemini, request readers) → Prisma.
- **Envelope:** every response is `ok(res, value)` / `fail(res, message, code, status)`. Throw
  `HttpError` for expected failures (`pool_exhausted` is a 503); anything else is mapped by
  `lib/error-response.ts` (generic in production, detailed in development).
- **Validation:** no schema library; read bodies with `lib/request.ts` and the `is*` guards in
  `lib/puzzle.ts`.
- **Config:** every `process.env` read lives in `config.ts` (gated). `GEMINI_KEY` has one reader:
  `lib/gemini.ts`; the Paddle API key and webhook secrets have one: `lib/paddle.ts` (gated).
- **Security:** `requireSameOrigin` on every write (except the Paddle webhook, mounted before it and
  verified by signature), per-route `rateLimit` (IP-keyed, an IPv6 client as its /64; a separate ceiling for signed-in
  requests), `accountRateLimit` per account and `emailRateLimit` per email on sign-in, `trust proxy` = 1 (nginx).
  Free puzzles have a global hourly cap (`billing.ts`) and 70% of the Gemini budget (`freeShare`).
- **Billing (`services/billing.ts`, `docs/BILLING.md`):** `POST /puzzles` is paid — this month's
  free credits (`FreeSpend`), then bought ones — inside the transaction that stores the puzzle, so a
  refusal (402) stores nothing. Every balance change writes a `CreditEntry` in the same
  transaction; never update `User.credits` without one. The webhook stores each event raw
  (`PaymentEvent`) and trusts our `Payment` row, never the payload's `custom_data`; the
  `Payment.status` guard makes redeliveries no-ops.
- **Identity of a word:** one `Entry` per (locale, normalized answer), many `Clue` rows. Devices
  exclude entry ids. **Entries are retired, never deleted** (gated) — a deleted word could be
  generated again under a new id and slip past every seen-list. Retired entries are never revived
  by the upsert. A signed-in player's puzzles are `PuzzlePlay` rows (`services/plays.ts`): built
  ones in the storing transaction, the rest reported by the device; `drawCandidates` leaves out
  every word of them in that language (`player`), on top of the device's `exclude`. Per-word
  states keep their first outcome.
- **Generation (`services/entryGen.ts`):** English rules + native material from `lib/content/`.
  Diversity seeding (`entryPool.pickSeeding`): least-used subtopic, starting letters where the
  pool is thin, and the slice's existing words as the avoid list. Every item passes
  `entryValidation.ts` (alphabet, length in cells, proper nouns only in their topics, script,
  giveaways) and then the judge pass; failures are dropped, never repaired.
- **Quota:** every Gemini request is logged in `GenerationLog` (`calls` and the billed tokens) —
  failed and fallen-through requests too, counted by the caller's `RequestMeter`, and a generation
  that throws still writes its row (`model: 'none'`). `DAILY_CALL_BUDGET` (100, hardcoded in
  `entryPool.ts`, no env variable) is checked before every attempt, for each call it may spend.
- **Gemini only on need** (`docs/WORD_SEEDING_PLAN.md`): a request never generates. After storing,
  `puzzleBuilder.lookAhead` draws the player's next identical request and records each bucket's
  gap and short length band (`recordShortfall` → `PoolDemand`; the largest gap wins, not the sum).
  `jobs/poolRefill.ts` runs on events (`lib/refillSignal.ts`), at startup and every 6 h — never a
  polling timer — paid gaps first, and stops at `POOL_MAX_WORDS` per language, on saturation
  (`isSaturated`: a week's pause) and at the budget, waking exactly when that can change.
- **Repeats:** when unseen words run out, the builder readmits the oldest-seen (`READMIT_STEPS`,
  never the newest ~500 device ids or the account's last 20 puzzles) before shrinking the grid.
- **The daily** (`services/daily.ts`, `jobs/dailyBuild.ts`): built a day ahead at 00:05 UTC with
  the ordinary builder from `Entry.dailyReserve` words (custom draws skip them), recorded in
  `DailyPuzzle`; `GET /daily/:locale` never sends today's solution nor tomorrow's puzzle.
- **Puzzles** are immutable snapshots (`Puzzle.data` = the `PuzzleView` minus id/createdAt);
  `servedCount` counts only words actually placed. Layout is pure and seeded (`lib/layout/`),
  bounded by a time budget because it runs on the event loop; bump `LAYOUT_VERSION` when the same
  input would lay out differently.
- **Seed words** (`prisma/seed/`, read by `seedFiles.ts`): `entries.<locale>.json` is hand-written
  and hand-checked (`origin: 'seed'`, reports never retire it); `claude/<locale>/*.json` is written
  by Claude agents (`origin: 'claude'`, retired by reports like AI words). Validate with
  `prisma/check-seed.ts`, which also gates the Claude words' balance.
- **Jobs** start in `index.ts` only, never in `createApp`, so tests never poll.
- **Imports** are ESM with explicit `.js` extensions.
