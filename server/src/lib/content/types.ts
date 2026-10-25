import type { Difficulty, Topic } from '../puzzle.js'

/**
 * Hand-written, native material per language. Everything here is authored in the language
 * itself by (or for review by) a native speaker — it is what keeps generated words and clues
 * from reading like translations.
 */

/** A worked example the generator imitates: a real answer with a full and a short clue. */
export type ContentExample = {
  word: string
  clue: string
  shortClue: string
  difficulty: Difficulty
}

export type LocaleContent = {
  /** English name of the language, used inside the English rules of the prompt. */
  name: string
  /** Whose language and culture the words and clues are for. */
  culture: string
  /**
   * The style guide, written **in the language itself**: what counts as a valid answer
   * (part of speech, grammatical form, spelling norm) and how clues in this language's
   * crossword tradition are phrased.
   */
  styleGuide: string
  /** 8–12 examples across topics and difficulties; three are rotated into each prompt. */
  examples: ContentExample[]
  /** Per topic, 12–20 narrow native subtopics, written in the language. They steer each batch somewhere new. */
  subtopics: Record<Topic, string[]>
  /** Topic names in the language, as the prompt's user turn names them. */
  topicNames: Record<Topic, string>
  /** Difficulty guidance in the language, as the prompt's user turn states it. */
  difficultyGuide: Record<Difficulty, string>
}

/** One seed word (`prisma/seed/entries.<locale>.json`): the non-AI fallback pool. */
export type SeedEntry = {
  word: string
  topics: Topic[]
  difficulty: Difficulty
  kind: 'common' | 'proper'
  /** Classic list clue, at most 90 characters. */
  clue: string
  /** Scanword cell clue: at most 24 characters and 3 words. */
  shortClue: string
}
