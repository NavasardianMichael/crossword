# Words: seeding, generation on need, the cap

How the word pool is filled and kept from growing without limit. Written for the Claude session that
implements it. **Decided 2026-11-26; steps 1–5 of the order of work implemented the same day**
(uncommitted at the time of writing): need-only generation with the event-driven job, the cap and
the repeat ladder, the seed tooling (`prisma/seedFiles.ts`, the `claude` origin, the checker's
balance gate, `tests/unit/seed.spec.ts`, `docs/WORD_SEEDING_BRIEF.md`, `prisma/seed-status.ts`), the
first file for every language (`server/prisma/seed/claude/<code>/01.json`, 500 words each) and the
daily reserve. To add more, see "Continuing the seeding". Also fixed: the
draw now uses each language's minimum length (`minWordLength`), so two-cell words in zh, ja, ko, hi,
mr, bn, ta and th are drawn, not only stored. It replaces the "seed words with Claude"
section of `HANDOFF.md`.

## Decisions

| | Decision |
|---|---|
| Core vocabulary | **Claude writes it in development**, into seed files in the repo; every deploy loads them. |
| Gemini | **Only on need, only in the background:** when a player's *next* puzzle could not be built from words they have not seen. No baseline top-up, no generation while a request waits. |
| Growth | **Cap: 7,000 live words per language** (`POOL_MAX_WORDS`). At the cap, Gemini is never called for that language. |
| Repeats | Below the cap, none. When a player runs out (or the language is capped), their **oldest-seen words come back first**, never the words of their latest puzzles. |
| One pool | Custom classic, custom scanword and the daily draw from the same words (each word has a full and a short clue). |
| Daily | **One classic puzzle per language per day**, from a reserve custom puzzles cannot draw. |
| Seed size | 2,000–3,000 words for languages with traffic, 1,000 for the rest. |

## 1. The seed: Claude writes it in development

Agents write JSON files; they never write to a database. The files are reviewable in git, survive a
database reset, feed local development and the integration tests, and a word Gemini already wrote
merges into the same `Entry` (`ON CONFLICT (locale, answer)`), so a seen-list never breaks.

Today: `server/prisma/seed/entries.<locale>.json`, ~144 words (~305 in en/ru/hy), loaded on every
deploy by `prisma/seed.ts` (idempotent), checked by `prisma/check-seed.ts`.

Changes:
1. **Several files per language** (`seed/entries/<locale>/<nn>.json`); the loader and checker read
   them all and reject a word repeated across files.
2. **Origin `claude`** (new `EntryOrigin` value). Seed words are never retired by reports because they
   were hand-checked; thousands of agent-written words in languages the owner cannot read are not, so
   `claude` words retire on reports like `ai` words (`reportEntry`).
3. **The checker enforces balance**, not just validity, per file and per language: length bands
   (3–5 cells ≥ 40 %, they knit grids), starting letters spread, every topic and difficulty present,
   proper nouns only in their topics. A skewed seed builds poor grids even when every word is valid.
4. **Writers**, as in millionaire (`../who-wants-to-be-a-millionaire/docs/QUESTION_SEEDING*.md`):
   a brief (`docs/WORD_SEEDING_BRIEF.md`, to write), packs of three languages in parallel (more burns
   the 5-hour usage limit), Opus (effort medium) for languages with less training data, Sonnet (effort
   high) for major ones. The checker gates every file before commit; a push deploys and seeds.
5. **Word rules: the same as Gemini's**, so a seed word and a generated one meet one bar. The brief
   quotes, rather than restates, the rules of `buildSystemInstruction` / `buildPrompt` /
   `VOCABULARY_FLOOR` in `server/src/services/entryGen.ts` (prompt `v3`) and binds the writer to the
   language's style guide in `server/src/lib/content/<locale>.ts`, which decides parts of speech
   (nouns only in ru, hy, ja; everyday verbs and adjectives too in en, de, fr, pl …), grammatical
   form and spelling norm. In short: native, standard, current vocabulary (no slang, jargon,
   dialect, archaic or needless foreign words); dictionary form; one word, compounds only when the
   dictionary has them; no abbreviations; proper nouns only in geography and local culture; never
   two forms or same-root words; letters common in the language; difficulty sets how common, never
   how standard. Balance across topics comes from the checker (point 3), not from each file.
6. **Order:** en, ru, hy first; read part of the output; then by traffic (GA4 by country).

## 2. Gemini only on need: the look-ahead

**Rule:** after a puzzle is built for a player, check whether *the same request again* could be built
from words this player has not seen. If yes, nothing happens. If not, the shortfall is recorded and
the background job generates exactly that. Nothing else calls Gemini for custom puzzles.

1. **After storing the puzzle**, count the player's unseen candidates for the same request: locale,
   clue style (format), difficulty range, max length, topic. Exclude = the device's `exclude` + the
   account's seen words + the words just placed. Counted per bucket the draw uses (the topic for 60 %,
   `general` glue for 40 %) and per length band, each capped with `LIMIT need`: a few milliseconds.
2. **Need** = what the next draw asks for at that size (`candidateCount(format, maxWords)`, split by
   the draw's length bands and theme share). **Shortfall** = need − unseen, per bucket.
3. **Recorded on `PoolDemand`** (locale, topic, difficulty) as `shortfall = GREATEST(shortfall, new)`.
   The maximum across players, not the sum: a new word is unseen by everyone, so the words that cover
   the hungriest player cover all of them. Guests work the same way: their seen-list arrives with the
   request.
4. **The refill job** handles only rows with `shortfall > 0` (paid players' first, then the largest),
   runs batches until the inserted words cover the shortfall, then sets it to 0. A band that ran out
   is asked for by length (a new `Seeding` field next to the starting letters).
5. **Removed:** the baseline target (`POOL_REFILL_TARGET`, the `maxExclude` formula, the 14-day sweep
   of recently requested buckets) and the inline generation inside a request (`topUp` in
   `puzzleBuilder.ts`). A request builds from what the pool has; with section 4's repeats it always can.

**When the job runs: on an event, never on a polling timer.** Today's job ticks every 60 s (~1,440
wake-ups a day, each a few queries) to find work that, with need-only generation, is almost never there.
Instead (the API is one process, so an in-process trigger is enough):
- **Recording a shortfall starts the job** at once: single-flight (a run in progress picks the new row
  up before it finishes) and debounced a few seconds, so a burst of requests makes one run. A puzzle
  takes minutes to solve, so the words are there before the player asks again.
- **A run drains every open shortfall, then sleeps.** If it cannot finish, it schedules exactly one
  wake-up for the moment that can change: the daily budget is spent → the next quota day
  (`quotaDayStart()` + 24 h, midnight Pacific); every model cooling down → the earliest cooldown's
  end (`lib/gemini.ts`); a transient error → 15 minutes.
- **On startup, one run** picks up shortfalls stored before a restart or deploy (they live in
  `PoolDemand`, not in memory).
- **A safety sweep every 6 hours** catches anything missed (a crash between recording and running).
  It costs one indexed query when nothing is open.
- The daily job (once a day, after midnight UTC) records the reserve's shortfall through the same
  trigger.

`POOL_REFILL_INTERVAL_MS` goes; `POOL_REFILL_MAX_CALLS` stays as the calls per run between short
pauses, so one run cannot spend the day's budget in a burst.

**Global limits**, checked before every generation:
- **The cap:** 7,000 live words in the language → no generation; the shortfall is cleared and repeats
  take over.
- **The daily call budget:** `DAILY_CALL_BUDGET` = 100 Gemini requests a day, hardcoded in
  `entryPool.ts` (the `POOL_DAILY_CALL_BUDGET` env variable is gone). Paid players' shortfalls may use
  all of it, free players' 70 % (`freeShare`). Counted from `GenerationLog` since midnight Pacific, when
  Google resets the free quota, and checked before every attempt. **Done 2026-11-26:** every request
  `generateJson` sends is counted (`RequestMeter`), failed and fallen-through ones included, and a
  generation that throws still logs its requests (`model: 'none'`). Still open: two generations
  checking at once can overshoot by a few calls (reserve the calls before the attempt).
- **Saturation:** when a bucket's last 3 generations inserted < 20 % of their valid words, Gemini is
  only repeating what the pool has; the bucket pauses for 7 days.
- At most 2 calls a tick, one generation per bucket at a time (both already exist).

## 3. One pool for classic, scanword and the daily

Every word has both clues (`full` for classic lists, `short` for scanword cells); a daily is an
ordinary `Puzzle`. The catch: custom puzzles draw least-served words first (`ORDER BY "servedCount"`),
so they eat never-served words before anything else, and a daily wanting fresh words would find none.

- **A daily reserve:** a flag on `Entry` that custom draws skip. The daily draws only from it (with a
  live `full` clue); a placed word leaves the reserve and joins the general pool.
- **Size: 14 days ahead** (a medium classic places 16–24 words → ~350 words per language). The daily
  job, building tomorrow's puzzle, counts the reserve against the next 14 days; a shortfall is filled
  first by moving never-served general words into the reserve (no Gemini), and only if there are none
  is it recorded as a shortfall like section 2's.
- After a daily arrives, its words join the device's and account's seen-lists like any puzzle's, so
  custom play never repeats them.
- **At the cap:** the daily takes the words that have gone longest without appearing in a daily,
  least served first. A daily places ~20 words, ~7,300 a year — more than the 7,000 cap — so once a
  language is capped, a daily player starts meeting words from dailies of about 11 months ago.
- The rest of the daily (`DailyPuzzle (locale, date)`, the midnight job, pages, streak) is in
  `DAILY_PLAN.md`. Format decided: classic, medium.

## 4. The cap and repeats

- `POOL_MAX_WORDS` = 7,000 live (not retired) words per language. Words are still never deleted
  (an id is what seen-lists exclude); the cap stops growth.
- **The builder's ladder becomes:** the topic → any topic → the same with the player's **oldest**
  seen words readmitted (never the words of their last ~20 puzzles) → a smaller grid → `503`. The
  device's seen-list is already oldest first (`mergeSeen`, capped at 4,000); the account's is ordered
  by `PuzzlePlay.createdAt`, and its query is bounded to a recent window instead of every puzzle ever.
- **How long before a repeat** = the cap ÷ a player's words per day: one medium puzzle a day
  (~20 words) ≈ 11 months; three large scanwords a day (~150) ≈ 7 weeks. A player who sticks to one
  topic repeats sooner: 7,000 words spread over 12 topics is ~580 a topic, ~12 themed words a puzzle.
- `CLAUDE.md`'s "no word may ever repeat" becomes "no word repeats while unseen words remain; then the
  oldest-seen come back first".

## Continuing the seeding (on any machine, on top of what exists)

**Where it stands (2026-11-26, end of the first machine's session):**

| | Languages | Claude-written words |
|---|---|---|
| Done (reviewed: flagged facts checked, a sample read, fixes applied) | en, ru, hy, de, it, pl, pt, es, fr, nl, ro, sv, cs | `01.json`, 500 each — 6,500 in all |
| **Not started — next, on another machine** | **el, hu, uk, id, ms, vi, ja, ko, zh, ar, fa, he, hi, th, sw, mr, ta, bn, fil, ur** | none: their first file is `01.json` |

Lessons from the first round, already folded into the brief: proper nouns keep their capital;
compounds and words that merely share a root may coexist (only forms and close derivatives of one
word may not); the checker's same-root list is prefix-based and mostly noise; its giveaway check
misses a negated or prefixed root (a Czech `jistota` clued with "nejistí" slipped through — read the
clues of abstract words); writers report "least sure" facts worth checking one by one (two of ~150
were wrong: a misquoted Мойдодыр line and an ambiguous "smallest Wadden island"). Writers in waves of
six hit the 5-hour usage limit after about seven languages; a stopped writer resumes with
SendMessage once the limit resets.

So the next round writes `01.json` for the 20 languages not started, then `02.json` for the rest.
`seed-status.ts` is the live truth and supersedes this table; a language whose `claude/` folder is
missing or empty simply has not started. A file that does not pass `check-seed.ts` (a writer stopped
mid-file) must be finished or deleted before committing — never commit one half-written.

The repo is the only source of truth: before starting, `git pull`, then see the live counts and each
language's next file:

```bash
pnpm --filter crossword-server exec tsx prisma/seed-status.ts
```

The owner starts a session with "continue the word seeding per docs/WORD_SEEDING_PLAN.md" (optionally
naming languages or a count). Each round:

1. **Pick the languages**: those the owner names, otherwise the ones furthest below their target
   (2,000–3,000 words for languages with traffic, 1,000 for the rest; en, ru, hy first, then by
   traffic, GA4 by country). Run writers in waves of 3–6; more at once burns the 5-hour usage limit.
2. **One writer agent per language** (Agent tool, `general-purpose`, in the background; Sonnet for
   major languages, Opus for those with less training data: hy, sw, mr, ta, bn, fil, ur). The
   output file is the `next` column of `seed-status.ts` (`02.json`, then `03.json` …):
   > Read the brief at docs/WORD_SEEDING_BRIEF.md and follow it exactly. Your language: `<name>`,
   > code `<code>`. Output file: server/prisma/seed/claude/`<code>`/`<nn>`.json. Write 500 entries.
   > Other agents are writing other languages at the same time; touch only your file. Never run
   > anything that calls Gemini. Keep your working drafts in your own scratchpad subfolder.
3. **No repeats, by construction:** the brief makes each writer read the hand-written file and every
   existing `claude/<code>/*.json` and write only new words; the checker rejects any word repeated
   across a language's files; and even a word Gemini already put in production merges into its
   existing `Entry` on deploy (same id, so nobody's seen-list breaks). Never edit or renumber an
   existing file's words to make room — add a new file.
4. **Review** each report: check the entries the writer is least sure of yourself, and a random
   sample (`node -e` over the file). Proper nouns carry their capital; fix facts in the JSON
   yourself.
5. `pnpm --filter crossword-server exec tsx prisma/check-seed.ts <codes>` and `pnpm verify`, then
   commit and push **before** starting a round on another machine — two machines writing the same
   `<nn>.json` would collide. The deploy loads the new words (`node dist/prisma/seed.js`).

## Sizes and cost (measured 2026-11-26 on the local database)

| | |
|---|---|
| Per word, with ~2.5 clues and all indexes | ~1.3 KB (10,369 words: `Entry` 3.0 MB + `Clue` 10.2 MB) |
| 7,000 words, one language | ~9 MB (~13 MB with clue growth and table bloat) |
| All 33 at the cap | ~0.3–0.4 GB |
| A stored medium puzzle | ~2.9 KB → ~1–1.5 GB a year at 1,000 puzzles a day; the daily ≈ 35 MB a year |
| Gemini, one generation (write + judge) | ~3.9k input + 1.9k output tokens ≈ $0.01 at $0.75 / $3.75 per M |
| Gemini, filling one language to 7,000 | ~10–15 new words per batch of 25 → 450–700 generations ≈ $5–7, once; about half that after the Claude seed |
| Free tier | 300 calls ≈ 150 generations ≈ 1,500 new words a day across all languages |

**RAM barely matters:** words live in Postgres, not in Node. A draw reads one language's slice
(≤ 9 MB at the cap), which stays in Postgres's and the OS's cache; if the busy set ever outgrew RAM,
reads would come from the SSD — slower, not broken. **Disk is what grows**, and mostly from `Puzzle`
snapshots, not words. Check production:

```sql
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) AS size
FROM pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC;

SELECT locale, count(*) FILTER (WHERE "servedCount" = 0) AS unused, count(*) AS total
FROM "Entry" WHERE "retiredAt" IS NULL GROUP BY locale ORDER BY unused;
```

## Order of work

1. **Need-only generation:** the look-ahead and shortfall (section 2); remove the baseline top-up and
   the inline generation. Saves Gemini calls at once.
2. **The cap and the repeat ladder** (section 4), with the `CLAUDE.md` rule change.
3. **Seed tooling:** split files, the `claude` origin, the checker's balance rules, the brief.
4. **First pack** en, ru, hy; review; continue pack by pack.
5. **The daily:** the reserve (section 3), then `HANDOFF.md`'s daily plan.
6. Revisit `DAILY_CALL_BUDGET` after a few weeks of `GenerationLog`.

Integration tests for 1 and 2: a player whose next request would fall short records a shortfall and
one who would not records none; the job stops at the cap and on saturation; a capped language serves
the oldest-seen words and never the latest puzzle's.
