# Handoff — 2026-11-25

Context from a Claude Code session, to continue on another machine. Everything below is committed
and pushed to `master` unless marked otherwise. Last commit: `957c5a5`.

## Done in this session (all pushed)

| Commit | What |
|---|---|
| `560a27b`, `dbe22fb`, `dc30ed2` | Footer, SEO (snippets, pricing page indexed, Organization schema, IndexNow), Next.js 16.4.6 |
| `41366c7` | Guides in 15 languages, their own pipeline (`content.yml`), Google preferred-source badge |
| `9bfcbb4` | PDF printing in every script (per-script Noto fonts, RTL mirrored, shaping fixed) |
| `957c5a5` | **Account-level seen words with per-word solve states** (below) |

### Account seen-list (`957c5a5`)

- **Table `PuzzlePlay`** (`userId`, `puzzleId`, `locale`, `states Bytes`), one row per puzzle an
  account was shown; `states` is one byte per word in the puzzle's word order, an index into
  `WORD_STATES = ['open','solved','helped','revealed']` (twins `src/constants/puzzle.ts` ↔
  `server/src/lib/puzzle.ts`). Migration `server/prisma/migrations/20261124120000_puzzle_plays` —
  **runs on the next deploy (`migrate deploy`)**.
- **Written** when the account builds a puzzle (`recordShown`, in the storing transaction,
  `puzzleBuilder.ts`) and when a device reports (`POST /puzzles/plays`, `services/plays.ts`
  `savePlays`, max `MAX_SYNCED_PLAYS` = 50 per call, unknown puzzles / wrong lengths skipped).
- **A word's first outcome stays** (`mergeStates`): solved is never turned into revealed later.
- **Exclusion:** `drawCandidates` (`entryPool.ts`) takes `player` and leaves out every word of the
  account's puzzles in that language, on top of the device's `exclude` (no 4000 cap for it).
- **Web:** `store/puzzle/plays` reports games changed since the last report — 5 s after progress is
  saved, on page hide, and on sign-in (which also uploads games played here as a guest). Word
  states come from `wordStates` in `helpers/puzzle/check.ts`. Timestamp per account in
  localStorage (`STORAGE_KEYS.playsSyncedPrefix`).
- **Copy** (privacy policy, two FAQ answers, home FAQ, rules) updated in all 33 languages;
  `CONTENT_UPDATED_AT` = 2026-11-24.
- **Tests:** 3 unit (`tests/unit/puzzle.spec.ts`), 7 integration (`tests/integration/plays.spec.ts`).
  `pnpm verify` passed: 21 gates, 854 unit, 39 integration, build.

**Known caveats**
- On a shared device, the first sign-in of an account uploads every game saved on that device,
  including someone else's.
- The states are recorded but not used yet: an unsolved word still never comes back.
- Existing catalogue inconsistencies noticed (not fixed): cs/uk/fa/he/ta/ko mix formal and
  informal "you" between sections; ro/pt/ur/vi/fil/sw use different words for "device"/"puzzle";
  ta `Play.solved.titleHelped` ("விடைந்தது") looks wrong.

## Discussions (no code changed)

### Why millionaire gets organic traffic and crossword doesn't
Millionaire has brand search demand, free unlimited play without sign-up, indexable game pages,
reasons to come back, age, 80 languages, and AdSense instead of a paywall. Crossword's puzzles are
private, paid and `noindex`; only static pages are visible to Google.

Recommendations, in order: **daily crossword pages** (next), free solving with credits only for
custom puzzles, titles aimed at solving searches, streaks, AdSense, measure in Search Console.
Languages: partly a factor (millionaire has 47 more small ones). Check traffic by country first; if
adding, pick crossword cultures: Kazakh, Uzbek, Georgian, Belarusian, Kyrgyz, Finnish,
Scandinavian, Baltic, Balkan.

### How generation works today
Words and clues are pooled in Postgres and shared by all users; a grid is built fresh per request
from the pool (least-served words first, minus the player's seen words). Gemini is called only when
the pool is short (one inline batch per request, two at once globally) and by the refill job
(every 60 s, ≤ 2 calls a tick, demand-ordered). Budget then 300/day (since 2026-11-26: `DAILY_CALL_BUDGET` = 100, hardcoded), 70 % for
free requests. A stored puzzle is reused only via a link or history.
Diagram (private artifact): https://claude.ai/artifact/9nafTNiCXRKNEbAXqxpXod

### Server cost of the account seen-list
Light: roughly 50 MB a year at 1,000 daily players (one row per puzzle, one byte per word).

## Daily crossword pages (implemented 2026-11-26, uncommitted at the time of writing)

Moved to **`docs/DAILY_PLAN.md`** (2026-11-26): one free classic medium crossword per language per day,
built a day ahead from a daily reserve with no AI on the fly, on one URL per language (`/[lang]/daily`)
with hardcoded evergreen SEO/GEO, yesterday's answers on the same page; and the order of work.

## Words seeded by Claude, Gemini only on need (implemented 2026-11-26; seeding in progress)

Details in **`docs/WORD_SEEDING_PLAN.md`**: the Claude-written seed, Gemini called only when a
player's next puzzle would run short (event-driven refill job, 100 requests a day), a 7,000-word cap
per language with oldest-seen repeats past it, the daily reserve, measured sizes and costs.

**Where we left off (2026-11-27):** the first seed file (`01.json`, 500 words) is written for en, ru,
hy, de, it, pl, pt, es, fr, nl, ro, sv, cs, el, hu, uk, id, ms, vi, ja, ko, zh, ar, fa, he, hi, th, sw, mr (29 languages, 14,500
words). **Not started: ta, bn, fil, ur.** On any machine: `git pull`, run `pnpm --filter crossword-server exec tsx
prisma/seed-status.ts`, then say "continue the word seeding per docs/WORD_SEEDING_PLAN.md" — section
"Continuing the seeding" has the writer prompt, the waves, the review and the no-repeat rules.
