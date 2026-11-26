# The daily crossword

One free classic crossword per language per day, the same for everyone, no sign-in, no credits, on
**one URL per language: `/[lang]/daily`**. Written for the Claude session that implements it.
**Decided and implemented 2026-11-26** (uncommitted at the time of writing; see "What was built"
below for where the code differs from this plan). Where the words come from (the daily reserve, the
cap, Gemini only on need) is in `WORD_SEEDING_PLAN.md`, section 3.

## What was built

- Server: `services/daily.ts` (reserve top-up, build, view), `jobs/dailyBuild.ts` (startup and
  00:05 UTC, today's and tomorrow's, hourly retry), `routes/daily.ts` (`GET /daily/:locale`), the
  `DailyPuzzle` table and `Entry.dailyReserve` (migration `20261126120000_daily_and_need`).
  Integration tests: `tests/integration/daily.spec.ts`.
- Web: `src/app/[lang]/daily/page.tsx` (ISR, 10 min), `src/components/daily/` (page, grid preview,
  clue lists, streak, teaser on the home, format and topic pages), `dailyPageSchema`, the sitemap
  entry, "Daily" first in the navigation and menu, `llms.txt` / `llms-full.txt`, copy in all 33
  catalogues (`Daily.*`, `Nav.daily`, `Seo.daily*`).
- **Differs from the plan:** the board does not play inside `/daily`. On phones the board is a
  full-screen game that hides the site's header and footer, so the page shows the empty grid and the
  clue lists (the SEO content) and a "Play" button opens the board at `/p/<id>` (noindex). Its words
  join the seen-list there, as any opened puzzle's do. Today's answers are kept out of the page's
  HTML and of `GET /daily`; the board itself still receives the solution, as every puzzle does
  (checking is on the device).
- A thin pool cannot carry a daily for long: the reserve takes at most 30 % of a language's live
  words (aiming at 400), and asks Gemini only for the next two dailies' words (48) when even that
  is missing, at free play's priority. A layout's other candidates come from the general pool's
  least-served words (not those of the last year's dailies). Languages with only the ~144
  hand-written words depend on the Claude seed (or Gemini) for their dailies; locally, without
  Gemini, tomorrow's daily failed for hi, ko and zh for exactly that reason.

## Decisions

| | |
|---|---|
| Format | **Classic, medium** (13×13, 16–24 words). |
| Languages | **All 33 at once.** |
| Day boundary | **Midnight UTC**, built a day ahead. |
| URL | **Only `/[lang]/daily`.** The puzzle changes there every day; no dated pages, no archive pages. |
| SEO/GEO | **Evergreen and hardcoded**: the title, description, structured data and preview image never change with the day, so nothing needs reindexing daily. |
| Past answers | **Yesterday's answers on the same page**, in a collapsed section. |

## How it is built (no AI on the fly)

1. A job (started in `server/src/index.ts`, like the refill job) builds **tomorrow's** daily for each
   language shortly after midnight UTC with the same builder as custom puzzles, drawing only from the
   daily reserve, and records it in `DailyPuzzle (locale, date) → puzzleId`. A failed build retries
   hourly; building a day ahead leaves 24 h before anyone sees a gap.
2. A page visit only reads the stored puzzle (an ordinary `Puzzle` row, so sharing, PDF, offline and
   the seen-lists work unchanged). Signed-in players' dailies go through `POST /puzzles/plays`.
3. New: the `DailyPuzzle` table, the job, `GET /daily/:locale` (today's puzzle without answers,
   yesterday's with them), the page, the streak (device-local first, on the account later).

## The page: `/[lang]/daily`

**Server-rendered** through `helpers/serverData.ts`, revalidated at midnight UTC (on-demand from the
job, or a short `revalidate`), degrading to the evergreen text alone when the API is down. Top to
bottom:
1. `<h1>`, the evergreen name in the language ("Daily Crossword", «Кроссворд дня», «Օրվա խաչբառ»),
   and below it today's date in the language (`Intl.DateTimeFormat`, inside `<time>`) as plain text,
   not in the title.
2. Today's board, playable: the grid's empty structure (numbers, black squares) at a fixed aspect
   ratio, so nothing shifts when it hydrates, and the numbered Across/Down clue lists as text. Today's
   answers are never in the HTML or the API response; checking works as for custom puzzles.
3. The streak (client-side).
4. **Yesterday's crossword**: its clues with their answers, in a `<details>` closed by default, in the
   HTML. Players come back for it, and "<clue> crossword answer" is a large share of crossword searches.
5. **Previous days**: the last 7 dailies as links to their `/p/<id>` pages (playable, already
   noindex), so older puzzles stay reachable without a single new indexable URL.
6. **The evergreen text**, hardcoded per language in the catalogues: what the daily is, that it is
   free and needs no sign-up, the format and size, the new puzzle at 00:00 UTC, how many languages,
   then a short FAQ (see GEO). This, not the changing puzzle, is what the page ranks on.
7. Links: "make your own crossword" (the crossword page, the conversion path), how to play, topics.

Sharing a daily shares its `/p/<id>` (that exact puzzle); a "share the daily" link shares `/daily`.

## SEO, hardcoded

Everything below is fixed text or fixed data, written natively per language in `src/messages/*.json`
(`Daily.*`), not translated: it changes only when the copy is rewritten.

- **Title** (`pageMetadata`, `src/i18n/metadata.ts`): what people search for, plus why to click,
  e.g. "Daily Crossword — Free, New Every Day", «Кроссворд на сегодня — бесплатно, новый каждый
  день», «Օրվա խաչբառ — անվճար, ամեն օր նոր». Each language picks its own most-searched phrasing
  ("Kreuzworträtsel heute", "crucigrama del día", "mots croisés du jour", «кроссворд дня» …).
- **Description**: fixed, ~150 characters: free, new every day, no sign-up, yesterday's answers.
- **Self-canonical** per language; `hreflang` across the 33 daily pages, `x-default` English.
- **Preview image**: one fixed daily card per language (the site card with "Daily crossword" on it),
  never a clue or an answer.
- **Structured data** (`src/linkedDataSchema/`, typed with `schema-dts`), all static:
  - `WebPage` (`name`, `description`, `inLanguage`, `isAccessibleForFree: true`, `isPartOf` the site,
    `dateModified` = `CONTENT_UPDATED_AT`), with `mainEntity` a `Game` ("Daily Crossword", genre
    Crossword, `inLanguage`, `isAccessibleForFree: true`, `publisher`).
  - `FAQPage` for the evergreen FAQ section, as the FAQ page does, and `BreadcrumbList` (Home → Daily).
  - Not `gameSchema`: its `AggregateOffer` describes the paid app, and the daily is free.
  - Nothing that names the day or its words, so the markup never goes stale.
- **Sitemap** (`src/app/sitemap.ts`): `daily` joins `INDEXABLE_ROUTES` like any static page, one entry
  per language with all its `hreflang`, `lastModified` = `CONTENT_UPDATED_AT` (not today),
  `changeFrequency: 'daily'`, priority 0.9.
- **No daily reindexing**: no IndexNow ping per day, no `lastmod` that moves every day. Google recrawls
  a daily-changing page on its own; IndexNow is pinged once at launch and when the copy changes.
- **Internal links**, the strongest signal there is: a "Today's crossword" block on the home page,
  "Daily" in the navigation and footer, a link from the crossword page and from every topic page.
- One page per language means no scaled-content risk.

## GEO (answer engines: ChatGPT search, Perplexity, Gemini, Copilot)

- **llms.txt** (`src/helpers/llms.ts`): a key fact ("A free daily classic crossword in 33 languages,
  new every day at 00:00 UTC at /<lang>/daily, no sign-up; yesterday's answers on the same page") and
  each language's daily page in its section. `llms-full.txt` gets the daily FAQ.
- **The FAQ** on the page and in the FAQ catalogue, in all 33 languages, short and quotable: "Is there
  a free daily crossword?", "When does the new one come out?", "Where are yesterday's answers?",
  "Is it the same for everyone?".
- The evergreen paragraph is written as plain sentences that answer "what is the daily crossword in
  <language>" on their own.
- AI crawlers are allowed already (`robots.ts` allows `*`).

## Order of work

1. `DailyPuzzle`, the daily reserve (`WORD_SEEDING_PLAN.md` §3), the job, `GET /daily/:locale`.
   Integration tests: one puzzle per (locale, date), tomorrow's never served early, yesterday's
   answers only for yesterday, a failed build retries.
2. The page, server-rendered, with the hardcoded metadata and JSON-LD.
3. Sitemap and internal links (home, navigation, footer, crossword and topic pages).
4. Copy in all 33 languages (`Daily.*`, the FAQ, llms), `pnpm check:messages`.
5. IndexNow once at launch; Search Console watch for the first month.
6. The streak.
