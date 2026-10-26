# Crossword AI

Free AI crosswords and scanwords in **English, Russian and Armenian** — an installable PWA where
every puzzle brings words you haven't seen before.

- **Two formats:** a classic free-form crossword with numbered Across/Down clues, and a scanword
  (сканворд, սկանվորդ) with clues inside the grid.
- **No repeats, by design:** every word is one pool entry per language; your device remembers the
  entries it was shown and excludes them from every new puzzle.
- **Native, not translated:** Gemini writes each language's words and clues from a native style
  guide and examples; code validates every item (alphabet, length in cells, giveaways) and a second
  model judges it. Hand-written seed words keep the app working without AI.
- **Built for every screen:** phone (on-screen keyboard per language, clue bar in thumb reach),
  tablet and desktop (clue lists beside the grid); accessible ARIA grid; plays offline.

## Getting started

```bash
nvm use                         # Node 24
pnpm install
cp .env.example .env.local      # web
cp server/.env.example server/.env.development.local   # API — put a free Gemini key in GEMINI_KEY (optional)
pnpm db:up && pnpm db:setup     # Postgres on :5007, migrations, seed words
pnpm dev                        # http://localhost:7007 (web) · http://localhost:9007 (API)
```

Without `GEMINI_KEY` puzzles come from the seed words only (about 300 per language). With a key,
the pool grows on demand and in the background, within `POOL_DAILY_CALL_BUDGET`.

## Checks

```bash
pnpm verify          # typecheck (web + API) → grep gates → lint → unit + integration tests → build
pnpm test:e2e        # Playwright on desktop, tablet and phone (needs `pnpm dev`)
```

See `CLAUDE.md` for where things live, `docs/DEPLOYMENT.md` for production.
