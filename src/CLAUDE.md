# Web — invariants

- **Routing:** every page lives under `app/[lang]/`; internal links go through `AppLink` /
  `@i18n/navigation` (raw `next/link` and `next/navigation` routing are gated). Paths are
  locale-free constants in `constants/routes.ts`.
- **Metadata:** every page's `generateMetadata` goes through `pageMetadata()` (self-canonical,
  hreflang for all locales + `x-default`). Personal pages (`/p/[id]`, `/play`, `/history`) pass
  `noIndex` and are disallowed in `robots.ts`.
- **Data:** `api/<domain>/` (4 files) → `store/<domain>/<slice>/` → components. Server reads go
  through `helpers/serverData.ts` and degrade to empty.
- **The board:** rules are pure helpers (`helpers/puzzle/{model,cursor,check,seen}.ts`, unit
  tested); `store/puzzle/play` sequences them, keeps the clock and saves progress to IndexedDB
  (debounced, flushed on hide/pagehide). Typing goes through `foldTyped` / `mergeTyped` from
  `constants/alphabet.ts` — Armenian `ո` then `ւ` completes `ու` in the cell `ո` went into.
- **Accessibility:** the grid is an ARIA grid with one tab stop (roving tabindex), labelled
  cells, a polite live region for checks/reveals/solve, `aria-describedby` to the active clue.
  State is never colour alone (strike-through for wrong, corner flag for revealed). Targets are
  44 px or more. Touch devices get the on-screen keyboard; focusing a cell never opens the OS
  keyboard.
- **Design:** light only, playful "sticker" look. Colours are tokens (`styles/tokens.ts` → §1 of
  globals.css); a hex anywhere else fails `pnpm gates`. Buttons are `btn-chunky` + a variant
  (`primary`/`secondary`/`sun`/`outline`/`danger`, globals.css §6) or `ghost`. Topic colours
  are literal class sets in `constants/topicStyles.ts` — never build class names at runtime.
- **UI kit:** antd underneath, wrapped in `components/ui/` — `Button`, `IconButton`, `Dialog`
  (Modal or sheet), `SegmentedControl`, `Chip`, `Toggle`, `Spinner`, `ErrorAlert`, `Toaster`.
  Bare `Modal`/`Drawer` are gated.
- **Offline:** every received puzzle is saved to IndexedDB; the service worker sends an
  uncached `/[lang]/p/<id>` visit to the precached `/[lang]/play?id=<id>` shell. A prefetched
  next puzzle per generator setting waits in the `queue` store.
- **Hydration:** anything read from the device (settings, saved games, the seen-list) is read
  after mount; the server render assumes defaults.
