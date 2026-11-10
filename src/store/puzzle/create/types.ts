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
  /** A new puzzle of unseen words, paid by the free puzzle or credits. `null` on failure or cancel (see `error`). */
  createPuzzle: (locale: PuzzleView['locale'], options?: Partial<GeneratorOptions>) => Promise<PuzzleView | null>
  /** Aborts the in-flight create. A cancelled create is not an error. */
  cancelCreate: () => void
}
