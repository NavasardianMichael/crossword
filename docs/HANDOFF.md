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
(every 60 s, ≤ 2 calls a tick, demand-ordered). Budget `POOL_DAILY_CALL_BUDGET` 300/day, 70 % for
free requests. A stored puzzle is reused only via a link or history.
Diagram (private artifact): https://claude.ai/artifact/9nafTNiCXRKNEbAXqxpXod

### Server cost of the account seen-list
Light: roughly 50 MB a year at 1,000 daily players (one row per puzzle, one byte per word).

## Next: daily crossword pages (discussed, NOT implemented)

**Idea:** one puzzle per language per day, the same for everyone, free, no sign-in, no credits.
- `/[lang]/daily` — today's (the page people bookmark).
- `/[lang]/daily/YYYY-MM-DD` — that day's, kept forever: one new indexable page per language per day.
- Server-rendered with the clues (no answers) so crawlers see unique content; titles aimed at
  "daily crossword", "кроссворд на сегодня", "օրվա խաչբառ"; a streak counter.

**Cost**
- Building: **no Gemini calls** — it is code drawing from the pool; 33 builds a day, like 33
  players pressing "New puzzle".
- Serving: built once regardless of players; one cached stored puzzle; no credits.
- The real cost is the no-repeat rule: everyone gets the same daily, so it cannot exclude each
  player's seen words. Options:

| Option | Repeats | Gemini |
|---|---|---|
| A. Only never-placed words (`servedCount = 0`) | none | ~20 fresh words/language/day ≈ 1 generation each via the refill job; ≤ ~35–70 of the 300 daily calls for all 33 languages |
| B. Least-served words (as custom puzzles do) | possible for heavy custom players | 0 extra |
| **C. A, falling back to B** (recommended) | almost never | whatever the refill budget allows |

Build tomorrow's daily a day ahead so the refill job has 24 h and no daily ever waits on Gemini.
`BATCH_SIZE` = 25 per generation; a medium classic grid holds 16–24 words.

**Fits as is:** the daily is an ordinary `Puzzle` row (sharing, printing, offline, device
seen-list work unchanged); signed-in players' dailies go through `POST /puzzles/plays`.
**New:** a `DailyPuzzle (locale, date) → puzzleId` table, a midnight job (start in `index.ts`),
the two pages, sitemap entries, the streak.

**Open decisions**
1. Which languages first — all 33, or the ones with traffic.
2. Size/format — medium classic proposed; scanword daily later.
3. Day boundary — midnight UTC (simplest) or per-locale midnight.
4. Show answers on past days? More content, but answers in the HTML.
5. Keep the pages substantial (date, topic, clues, previous/next links) for Google's
   scaled-content rules.

Proposed default: option C, medium classic, midnight UTC, all languages at once.
