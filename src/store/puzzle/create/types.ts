import type { StateCommonProps } from '@interfaces/store'
import type { Difficulty, PuzzleFormat, PuzzleSize, PuzzleView, TopicChoice } from '@constants/puzzle'

export type GeneratorOptions = {
  format: PuzzleFormat
  topic: TopicChoice
  difficulty: Difficulty
  size: PuzzleSize
}

export type CreateState = StateCommonProps & {
  options: GeneratorOptions
}

export type CreateActions = {
  hydrateOptions: () => void
  setOptions: (options: Partial<GeneratorOptions>) => void
  /** A new puzzle of unseen words — from the prefetch queue when one is ready. `null` on failure (see `error`). */
  createPuzzle: (locale: PuzzleView['locale'], options?: Partial<GeneratorOptions>) => Promise<PuzzleView | null>
}
