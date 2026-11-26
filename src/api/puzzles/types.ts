import type { Endpoint } from '@interfaces/api'
import type {
  CellView,
  Difficulty,
  Direction,
  Locale,
  PuzzleFormat,
  PuzzleSize,
  PuzzleView,
  ReportReason,
  Topic,
  TopicChoice,
} from '@constants/puzzle'

export type CreatePuzzlePayload = {
  locale: Locale
  format: PuzzleFormat
  topic: TopicChoice
  difficulty: Difficulty
  size: PuzzleSize
  /** Entry ids this device has seen, newest last. */
  exclude: number[]
}

export type CreatePuzzleAPI = Endpoint<{ payload: CreatePuzzlePayload; response: PuzzleView; processed: PuzzleView }>

export type GetPuzzleAPI = Endpoint<{ payload: { id: string }; response: PuzzleView; processed: PuzzleView }>

export type ReportPayload = { puzzleId: string; wordId: number; reason: ReportReason; note?: string }

export type ReportWordAPI = Endpoint<{ payload: ReportPayload; response: null; processed: null }>

export type ResultPayload = { puzzleId: string; solved: boolean; revealedWordIds: number[] }

export type SendResultAPI = Endpoint<{ payload: ResultPayload; response: null; processed: null }>

/** A puzzle this device was shown and its `WORD_STATES` codes, one per word. */
export type PlayReport = { id: string; states: number[] }

export type SyncPlaysAPI = Endpoint<{ payload: { plays: PlayReport[] }; response: { kept: number }; processed: null }>

export type Sample = { word: string; clue: string; length: number }

/** A word of today's daily: its clue, never its answer. */
export type DailyClue = { number: number; dir: Direction; clue: string; length: number }

/** A word of yesterday's daily, with its answer as cell tokens. */
export type DailyAnswer = { number: number; dir: Direction; clue: string; answer: string[] }

/** `GET /daily/:locale` — the server's `services/daily.ts` `DailyView`. */
export type DailyView = {
  date: string
  today: { id: string; date: string; width: number; height: number; cells: CellView[]; words: DailyClue[] } | null
  yesterday: { id: string; date: string; words: DailyAnswer[] } | null
  previous: { id: string; date: string }[]
}

export type GetDailyAPI = Endpoint<{ payload: { locale: Locale }; response: DailyView; processed: DailyView }>

export type GetSamplesAPI = Endpoint<{ payload: { locale: Locale; topic: Topic }; response: Sample[]; processed: Sample[] }>
