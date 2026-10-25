/**
 * The single source of truth for design constants (bookie's chain):
 *
 *   tokens.ts ─→ theme.ts (antd, cssVar) ─→ :root { --ant-* } ─→ globals.css §2 aliases ─→ utilities
 *            └→ globals.css §1 @theme ramps (mirrored literals — CSS cannot import JS;
 *               tests/unit/styles/tokens.spec.ts keeps the mirror equal)
 *
 * A raw hex may appear in this file and in globals.css §1 only (`pnpm gates`).
 *
 * The palette is a puzzle book's: warm cream paper, plum-ink lettering, and a box of
 * crayons — coral, teal, sunshine, mint, lavender, sky and rose — one per topic, and each
 * with a job on the grid. Light only: there is no dark theme.
 *
 * Contrast (WCAG AA, 4.5:1 for body text) is checked where text sits on a colour: ink on any
 * 100–400 step, white on the 700 steps. The 500 steps are for shapes and icons, not text.
 */

/** Paper: the page (100), raised paper (50), creases and dividers (200–300). */
export const CREAM = {
  50: '#fffdf8',
  100: '#fff8ec',
  200: '#fbeed8',
  300: '#f3dfbd',
} as const

/** Lettering: body copy (900), secondary copy (700), hints (500, AA on cream), decoration (300). */
export const INK = {
  300: '#b8afcb',
  500: '#6b6185',
  700: '#463c5e',
  900: '#2a2140',
} as const

/** The primary colour: actions, the cursor's word, the brand. */
export const CORAL = {
  100: '#ffe6de',
  200: '#ffc9b8',
  300: '#ffa58b',
  400: '#ff8466',
  500: '#f4623f',
  600: '#d9481f',
  700: '#a8361a',
} as const

/** Secondary: links, info, the scanword's clue cells. */
export const TEAL = {
  100: '#d9f4ef',
  200: '#b0e9df',
  300: '#7fdacb',
  400: '#46c4b0',
  500: '#1fa894',
  600: '#14897a',
  700: '#0d6f63',
} as const

/** Sunshine: the active word on the grid, highlights. */
export const SUN = {
  100: '#fff6cf',
  200: '#ffec9e',
  300: '#ffe06b',
  400: '#ffd23f',
  500: '#efb800',
  600: '#c99700',
  700: '#8a6700',
} as const

/** Correct, solved, success. */
export const MINT = {
  100: '#ddf7e8',
  200: '#bdefd3',
  300: '#8fe2b4',
  400: '#5cd08f',
  500: '#2fb46e',
  600: '#1f9257',
  700: '#176f43',
} as const

/** Wrong letters, errors. */
export const ROSE = {
  100: '#ffe4ea',
  200: '#ffc6d2',
  300: '#ff9eb3',
  400: '#ff7493',
  500: '#ee4570',
  600: '#c92c55',
  700: '#9c1f42',
} as const

/** Revealed letters, the history topic, quiet accents. */
export const LAVENDER = {
  100: '#efeaff',
  200: '#ddd3ff',
  300: '#c3b3ff',
  400: '#a48bf7',
  500: '#8566e8',
  600: '#6a4cc9',
  700: '#523a9c',
} as const

export const SKY = {
  100: '#e1f1ff',
  200: '#c0e2ff',
  300: '#93cdff',
  400: '#5fb2f5',
  500: '#3793e0',
  600: '#2475bd',
  700: '#1b5a92',
} as const

/** Hairlines on cream and white. */
export const LINE = {
  subtle: '#efe2cb',
  strong: '#dcc8a6',
} as const

export const WHITE = '#ffffff'

/** Corner radius in px — generous and friendly. */
export const RADII = { sm: 8, base: 12, lg: 20 } as const

/**
 * The class antd scopes its `--ant-*` block to: `ConfigProvider theme.cssVar.key`, stamped
 * on `<html>` by the root layout. Both ends must agree or every alias in globals.css §2
 * resolves to nothing.
 */
export const CSS_VAR_SCOPE = 'css-var-crossword'

export const CONFETTI_COLORS = [CORAL[400], TEAL[400], SUN[400], MINT[400], LAVENDER[400], SKY[400], ROSE[400]]
