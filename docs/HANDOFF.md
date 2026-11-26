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

**How a daily is generated (no AI on the fly)**
1. A job (started in `index.ts`, like the refill job) builds **tomorrow's** daily for each
   language shortly after midnight UTC, with the same builder as custom puzzles: draw from the
   pool, lay out, store, record it as that language's daily for that date.
2. A visit to `/[lang]/daily` only reads the stored puzzle.
3. Gemini runs only in the background refill job. If a language has fewer than ~20 never-placed
   words, the job marks its `PoolDemand` urgent so the refill tops it up during the day; if still
   short at build time, the daily falls back to least-served words (option B). A failed build is
   retried hourly; building a day ahead leaves 24 h before anyone sees a gap.
4. Every language can already build puzzles (all 33 have seed words), but pool depth varies:
   ~7,300 fresh words per language per year for dailies alone. Check production first:

   ```sql
   SELECT locale, count(*) FILTER (WHERE "servedCount" = 0) AS unused, count(*) AS total
   FROM "Entry" WHERE "retiredAt" IS NULL GROUP BY locale ORDER BY unused;
   ```

5. Midnight UTC is 9:00 in Tokyo, 4:00 in Yerevan, 19:00 the evening before in New York. Built a
   day ahead, publishing at local midnight is a small extra step.

## Next, alongside dailies: seed words with Claude, Gemini only as top-up (discussed, NOT implemented)

The owner's suggestion, taken from millionaire (`../who-wants-to-be-a-millionaire/docs/QUESTION_SEEDING*.md`):
Claude writer agents write the word banks into the repo; Gemini fills gaps on the server only when
needed. Agreed it fits crossword even better: a word is used up per player, never globally, so
every seeded word serves every player in that language forever.

**Today:** `server/prisma/seed/entries.<locale>.json` — about 144 words in most languages, about
305 in en/ru/hy (barely 7 medium puzzles). `prisma/check-seed.ts` validates them; every deploy
loads them idempotently (`deploy.yml`, `node dist/prisma/seed.js`).

**What millionaire does:** writer agents in packs of three languages (more burns the 5-hour usage
limit), each following a brief; a plan doc gives the order; the checker gates every file before
commit; a push deploys and seeds production. Model per language: Opus (effort medium) for
languages with less training data, Sonnet (effort high) for major ones. One writer: 7–10 min,
100–150k tokens, 100–150 questions.

**Changes for words**
1. **Scale the files** to a target per language: 1,000 words first, 3,000 later. Split each
   language into several files.
2. **The checker enforces balance**, not just validity: lengths (especially 3–5 cells), starting
   letters, topics, difficulties. A skewed seed builds poor grids even when every word is valid.
3. **"Seed words are never retired" stops fitting.** That rule exists because today's seeds are
   hand-checked; thousands of agent-written words in languages the owner can't read aren't. Add a
   separate origin (e.g. `origin: 'claude'`) that player reports can retire, like AI words.
4. **A daily reserve** (like millionaire's ranked bank): part of each language's seed drawn only
   by dailies, joining the general pool once used. Dailies' option A then costs no Gemini.
5. **Turn Gemini down:** the refill job already generates only for short slices; with a deep seed
   it rarely fires, so `POOL_DAILY_CALL_BUDGET` can drop from 300.

**Cost:** Claude usage limits and the owner's time, not money. Guess (not measured) 300–500 words
per writer run (an entry is a word + a full and a short clue); ~850 more words × 33 languages ≈
60–100 runs ≈ days to weeks of sessions. Start with the languages that bring traffic.

**Notes:** if Gemini is still on the free tier, seeding buys capacity and quality, not money.
With Gemini mostly off, words get no new clues over time — barely matters, since no word repeats
for a player.

**Order:**
1. A brief, a plan doc and the balance checks in `check-seed.ts`, mirroring millionaire's docs.
2. The `claude` origin, so reports can retire these words.
3. The first pack: en, ru, hy; read some output; continue.
4. Then the daily reserve, then lower the Gemini budget.
