/**
 * Puzzle vocabulary shared by the web app and the API: locales, formats, topics, sizes and
 * the shape of a puzzle on the wire.
 *
 * **Twin file.** `src/constants/puzzle.ts` (web) and `server/src/lib/puzzle.ts` (API) must stay
 * byte-identical below the marker line — `tests/unit/twins.spec.ts` fails on drift. The server
 * cannot import from `src/` (separate package, NodeNext resolution), which is why the rules
 * are duplicated rather than shared.
 */
// --- twin: keep identical below this line ---

/** The languages puzzles are written in. Each has its own word pool, never translated. */
export const LOCALES = ['en', 'ru', 'hy'] as const
export type Locale = (typeof LOCALES)[number]

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)

/**
 * `classic`: a free-form grid with numbered Across/Down clue lists.
 * `scanword` (сканворд, սկանվորդ): clues printed inside grid cells, arrows pointing to the answer.
 */
export const FORMATS = ['classic', 'scanword'] as const
export type PuzzleFormat = (typeof FORMATS)[number]

export const isFormat = (value: unknown): value is PuzzleFormat => FORMATS.includes(value as PuzzleFormat)

export const TOPICS = [
  'general',
  'nature',
  'animals',
  'food',
  'geography',
  'history',
  'science',
  'sport',
  'arts',
  'home',
  'professions',
  'localCulture',
] as const
export type Topic = (typeof TOPICS)[number]

/** A request may leave the topic open: the puzzle is then built from every topic. */
export type TopicChoice = Topic | 'any'

export const isTopic = (value: unknown): value is Topic => TOPICS.includes(value as Topic)
export const isTopicChoice = (value: unknown): value is TopicChoice => value === 'any' || isTopic(value)

/** Proper nouns (cities, rivers, heroes) are fair answers only where the topic is about them. */
export const PROPER_NOUN_TOPICS: readonly Topic[] = ['geography', 'localCulture']

/** 1 — everyday words with direct clues · 2 — broader vocabulary · 3 — rarer words, oblique clues. */
export const DIFFICULTIES = [1, 2, 3] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const isDifficulty = (value: unknown): value is Difficulty => DIFFICULTIES.includes(value as Difficulty)

export const SIZES = ['small', 'medium', 'large'] as const
export type PuzzleSize = (typeof SIZES)[number]

export const isSize = (value: unknown): value is PuzzleSize => SIZES.includes(value as PuzzleSize)

export type GridSpec = { width: number; height: number; minWords: number; maxWords: number }

/**
 * The box each layout fills. Classic grids are cropped to what was placed; scanwords keep
 * their rectangle and are portrait-first, because most of them are solved on a phone.
 */
export const GRID_SPECS: Record<PuzzleFormat, Record<PuzzleSize, GridSpec>> = {
  classic: {
    small: { width: 9, height: 9, minWords: 8, maxWords: 14 },
    medium: { width: 13, height: 13, minWords: 16, maxWords: 24 },
    large: { width: 15, height: 15, minWords: 22, maxWords: 34 },
  },
  scanword: {
    small: { width: 8, height: 10, minWords: 8, maxWords: 22 },
    medium: { width: 10, height: 13, minWords: 13, maxWords: 34 },
    large: { width: 13, height: 17, minWords: 22, maxWords: 52 },
  },
}

/** Word lengths, in cells. */
export const MIN_WORD_LENGTH = 3
export const MAX_WORD_LENGTH = 14

/** Seen entry ids a device keeps per locale and sends as `exclude`: about 130 puzzles. */
export const MAX_EXCLUDE = 4000

/** A full clue (classic lists) and a short one (scanword cells). */
export const MAX_CLUE_LENGTH = 90
export const MAX_SHORT_CLUE_LENGTH = 24

export const REPORT_REASONS = ['wrongClue', 'notAWord', 'offensive', 'typo'] as const
export type ReportReason = (typeof REPORT_REASONS)[number]

export const isReportReason = (value: unknown): value is ReportReason => REPORT_REASONS.includes(value as ReportReason)

export type Direction = 'across' | 'down'

/**
 * Where a scanword clue's answer runs, seen from its clue cell: `right` and `down` start in the
 * neighbouring cell; `downRight` starts below and runs right, `rightDown` starts right and runs down.
 */
export type Arrow = 'right' | 'down' | 'downRight' | 'rightDown'

/**
 * One grid cell, row-major. `L` holds a letter (`n` is the classic clue number), `B` is a block
 * — in a scanword a decorative tile, `d` naming which sticker it shows — and `C` is a scanword
 * clue cell holding one or two clues.
 */
export type CellView = { k: 'L'; n?: number } | { k: 'B'; d?: number } | { k: 'C'; clues: number[] }

export type WordView = {
  id: number
  dir: Direction
  row: number
  col: number
  length: number
  clue: string
  /** Classic: the printed number. */
  number?: number
  /** Scanword: the clue cell and how the arrow bends from it. */
  clueCell?: number
  arrow?: Arrow
  /** The pool entry — what the device adds to its seen-list. */
  entryId: number
}

export type PuzzleView = {
  id: string
  locale: Locale
  format: PuzzleFormat
  topic: TopicChoice
  difficulty: Difficulty
  width: number
  height: number
  cells: CellView[]
  words: WordView[]
  /** Per cell: the letter token (`ու` and `և` are one token), '' for blocks and clue cells. */
  solution: string[]
  createdAt: string
}
