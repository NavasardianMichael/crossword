# API — invariants

- **Layers:** `routes/*` (HTTP, validation, mounted only in `app.ts`) → `services/*` (logic) →
  `lib/*` (pure utilities: alphabet, layout, gemini, request readers) → Prisma.
- **Envelope:** every response is `ok(res, value)` / `fail(res, message, code, status)`. Throw
  `HttpError` for expected failures (`pool_exhausted` is a 503); anything else is mapped by
  `lib/error-response.ts` (generic in production, detailed in development).
- **Validation:** no schema library; read bodies with `lib/request.ts` and the `is*` guards in
  `lib/puzzle.ts`.
- **Config:** every `process.env` read lives in `config.ts` (gated). `GEMINI_KEY` has one reader:
  `lib/gemini.ts`.
- **Security:** `requireSameOrigin` on every write, per-route `rateLimit` (IP-keyed, there are no
  accounts), `trust proxy` = 1 (nginx).
- **Identity of a word:** one `Entry` per (locale, normalized answer), many `Clue` rows. Devices
  exclude entry ids. **Entries are retired, never deleted** (gated) — a deleted word could be
  generated again under a new id and slip past every seen-list. Retired entries are never revived
  by the upsert.
- **Generation (`services/entryGen.ts`):** English rules + native material from `lib/content/`.
  Diversity seeding (`entryPool.pickSeeding`): least-used subtopic, starting letters where the
  pool is thin, and the slice's existing words as the avoid list. Every item passes
  `entryValidation.ts` (alphabet, length in cells, proper nouns only in their topics, script,
  giveaways) and then the judge pass; failures are dropped, never repaired.
- **Quota:** every Gemini call is logged in `GenerationLog` (`calls`); `POOL_DAILY_CALL_BUDGET`
  is checked before generating. Inline generation is one batch per request, two at once globally;
  the refill job does the rest, demand-ordered (`PoolDemand`, urgent first).
- **Puzzles** are immutable snapshots (`Puzzle.data` = the `PuzzleView` minus id/createdAt);
  `servedCount` counts only words actually placed. Layout is pure and seeded (`lib/layout/`),
  bounded by a time budget because it runs on the event loop; bump `LAYOUT_VERSION` when the same
  input would lay out differently.
- **Seed words** (`prisma/seed/`) are hand-written and hand-checked: reports never retire them.
  Validate edits with `prisma/check-seed.ts`.
- **Jobs** start in `index.ts` only, never in `createApp`, so tests never poll.
- **Imports** are ESM with explicit `.js` extensions.
