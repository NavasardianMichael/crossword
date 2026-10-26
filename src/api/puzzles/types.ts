import type { Endpoint } from '@interfaces/api'
import type {
  Difficulty,
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

export type ReportPayload = { puzzleId: string; wordId: number; reason: ReportReason }

export type ReportWordAPI = Endpoint<{ payload: ReportPayload; response: null; processed: null }>

export type ResultPayload = { puzzleId: string; solved: boolean; revealedWordIds: number[] }

export type SendResultAPI = Endpoint<{ payload: ResultPayload; response: null; processed: null }>

export type Sample = { word: string; clue: string; length: number }

export type GetSamplesAPI = Endpoint<{ payload: { locale: Locale; topic: Topic }; response: Sample[]; processed: Sample[] }>
