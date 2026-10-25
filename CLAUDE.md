# Crossword AI

A free AI crossword and scanword generator in English, Russian and Armenian. A Next.js App
Router PWA and an Express/Prisma API in `server/`, in one pnpm workspace. Words and clues are
written by Gemini natively per language and pooled in Postgres; every device excludes the
words it has seen, so nothing ever repeats. Hand-written seed words are the non-AI fallback.

**Stack:** Next.js 16 (App Router, `src/proxy.ts`) · React 19 · TypeScript 6 · Ant Design 6 +
Tailwind 4 (one token chain) · Zustand + immer · next-intl 4 · idb · pnpm · Express 5 · Prisma 6 ·
PostgreSQL 16 · `@google/genai` · Sentry · GA4. Built from `../who-wants-to-be-a-millionaire/docs/STACK_BLUEPRINT.md`.

## Commands

```bash
pnpm db:up && pnpm db:setup   # Postgres in Docker (port 5007), migrate + seed the hand-written words
pnpm dev                      # web :7007 + api :9007
pnpm verify                   # typecheck → typecheck:server → gates → lint → test → build — run before "done"
pnpm test:unit                # fast, no database (layout fuzzing, alphabet, validation, board logic)
pnpm test:integration         # real API against a throwaway crossword_test database, Gemini off
pnpm test:e2e                 # Playwright, needs `pnpm dev` running
pnpm check:messages           # ru/hy catalogues match en.json (keys, placeholders, plurals)
pnpm --filter crossword-server exec tsx prisma/check-seed.ts [locale]   # validate seed words + prompt material
pnpm build:api                # server/dist + the deployable out/api release
```

## Where things live

| Looking for | Go to |
|---|---|
| Locales, formats, topics, sizes, the puzzle wire shape | `src/constants/puzzle.ts` ↔ twin `server/src/lib/puzzle.ts` |
| What a letter is (`ու`/`և` one cell, `ё`→`е`), typing rules | `src/constants/alphabet.ts` ↔ twin `server/src/lib/alphabet.ts` |
| Grid layout (classic, scanword), pure + seeded | `server/src/lib/layout/` — fuzzed in `tests/unit/layout/` |
| Native prompt material: style guides, examples, subtopics | `server/src/lib/content/{en,ru,hy}.ts` |
| Seed words (non-AI fallback, integration data) | `server/prisma/seed/entries.{en,ru,hy}.json` · loader `prisma/seed.ts` · checker `prisma/check-seed.ts` |
| Generation: prompt, validation, judge pass | `server/src/services/entryGen.ts`, `entryValidation.ts` |
| The pool: upsert, diversity seeding, drawing, reports | `server/src/services/entryPool.ts` · refill job `server/src/jobs/poolRefill.ts` |
| Building + storing a puzzle, fallback ladder | `server/src/services/puzzleBuilder.ts` · routes `server/src/routes/puzzles.ts` |
| Gemini (model chain, cooldowns, the only key reader) | `server/src/lib/gemini.ts` |
| The board (grid, clue bar, lists, keyboard, toolbar) | `src/components/puzzle/` · state `src/store/puzzle/play/` · rules `src/helpers/puzzle/` |
| Creating puzzles, seen-list, prefetch queue | `src/store/puzzle/create/` · `src/helpers/puzzle/seen.ts` · `src/helpers/offline/db.ts` |
| Keyboards (on-screen rows, physical-key fallback) | `src/constants/keyboards.ts` |
| Topic colours and icons | `src/constants/topicStyles.ts` |
| HTTP calls from the web | `src/api/puzzles/` — `endpoints`, `types`, `processors`, `main` |
| Locales, routing, metadata, hreflang | `src/i18n/` · catalogues `src/messages/` |
| Design tokens | `src/styles/tokens.ts` (owner) → `theme.ts` (antd) → `globals.css` §1 mirror + §2 `--ant-*` aliases |
| UI kit (antd wrappers) | `src/components/ui/` (`bare/` and `layout/` render on the server) |
| SEO: sitemap, robots, JSON-LD | `src/app/sitemap.ts`, `robots.ts`, `src/linkedDataSchema/` |
| PWA: manifest, service worker, offline play shell | `src/app/manifest.ts`, `src/app/sw.js/route.ts` + `src/helpers/pwa.ts`, `src/app/[lang]/play/` |
| Deploying | `docs/DEPLOYMENT.md`, `deployment/`, `.github/workflows/` |

Per-layer rules: `src/CLAUDE.md` (web) and `server/CLAUDE.md` (API).

## Working rules

- **Inspect before writing.** Follow the structure of neighbouring files in the same domain.
- **Twin files stay identical** below their marker line — `tests/unit/twins.spec.ts`.
- **Named exports declared inline**; default exports only where a framework requires them.
- **Errors for two audiences**: translated copy by error *kind* in production (`ErrorAlert`,
  `classifyError`), the original message added in development. Never render a server's message.
  A deliberate silence goes through `reportError`.
- **Every user-visible string** is in `src/messages/en.json`, then written natively (not
  translated word for word) in `ru.json` and `hy.json`; `pnpm check:messages` keeps them in step.
- **Light only.** No `dark:`, no dark colour-scheme query. No hex outside the token files, no bare
  antd `Modal`/`Drawer`, no `var(--ant-*)` outside globals.css §2 — `pnpm gates` enforces it.
- **Server-render what crawlers should see.** Pages fetch through `src/helpers/serverData.ts`,
  which degrades to empty when the API is down.
- Comment only where the purpose is not obvious from the code.

## Easy to get wrong

- **No word may ever repeat for a device.** Entry ids are the identity a device excludes: never
  delete an `Entry` (retire it), never re-key one, and add a puzzle's ids to the seen-list when
  it *arrives* (created, prefetched or opened from a link). A gate forbids deleting entries.
- **Lengths are in cells, not string length.** Always `toCells` / `cellCount`. Armenian `ու`
  is one cell, `և` is one cell, and `'և'.toUpperCase()` is the classical `ԵՒ` — print letters
  with `displayCell`, never CSS `uppercase` (gated in `src/components/puzzle`).
- Normalization strips only stress marks and invisibles: NFD + dropping combining marks would
  turn `й` into `и`.
- **Code decides, the model speaks.** The layout, lengths, validation and difficulty are code;
  the model only proposes words and clues, which are dropped (never repaired) when invalid.
- The free Gemini tier's *daily* quota binds first: `POOL_DAILY_CALL_BUDGET`, at most one inline
  generation per request, two at once across requests.
- **Static rendering hinges on `src/i18n/request.ts`:** the locale comes from `lang()`, and
  `requestLocale` must never be destructured — that silently makes every page dynamic.
- `useSearchParams` needs a `<Suspense>` boundary; read `window.location` instead (see `OfflinePlay`).
- Integration tests only ever touch `crossword_test` (guarded in `tests/setup/integration.ts`).
