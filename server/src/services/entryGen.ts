import { type Schema, Type } from '@google/genai'
import { type CandidateEntry, validateBatch, type ValidEntry } from './entryValidation.js'
import { config } from '../config.js'
import { normalizeWord } from '../lib/alphabet.js'
import { LOCALE_CONTENT } from '../lib/content/index.js'
import type { ContentExample } from '../lib/content/types.js'
import { generateJson } from '../lib/gemini.js'
import { type Difficulty, type Locale, PROPER_NOUN_TOPICS, type Topic } from '../lib/puzzle.js'

/**
 * Writing crossword words and clues with Gemini.
 *
 * The prompt pairs precise rules in English (what each JSON field means, what is forbidden —
 * models follow constraints best in English, and code enforces them anyway) with material
 * written **natively** in the target language: its crossword style guide, worked examples, the
 * topic, a narrow subtopic. That native material is what keeps the output from reading like a
 * translation.
 *
 * Repeats are fought before the model is asked, not only after: every batch targets a narrow
 * subtopic and a handful of starting letters chosen where the pool is thin (`seeding` from
 * `entryPool.ts`), and names the words of that slice the pool already has. Everything the model
 * returns is validated, then judged by a second model.
 */

export const BATCH_SIZE = 25

/** Bumped when the prompt changes, so `GenerationLog` can compare yields across versions. */
export const PROMPT_VARIANT = 'v1'

export type Seeding = {
  subtopic: string
  /** Starting letters (cell tokens) every word must begin with. */
  letters: string[]
  /** Answers already in the pool for this slice, and words rejected on an earlier attempt. */
  avoid: string[]
  examples: ContentExample[]
}

export type GenerateParams = { locale: Locale; topic: Topic; difficulty: Difficulty; seeding: Seeding }

const ENTRIES_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    entries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          clue: { type: Type.STRING },
          shortClue: { type: Type.STRING },
          kind: { type: Type.STRING, enum: ['common', 'proper'] },
        },
        required: ['word', 'clue', 'shortClue', 'kind'],
        propertyOrdering: ['word', 'clue', 'shortClue', 'kind'],
      },
    },
  },
  required: ['entries'],
}

const buildSystemInstruction = (locale: Locale, examples: readonly ContentExample[]): string => {
  const { name, culture, styleGuide } = LOCALE_CONTENT[locale]
  return [
    `You are a native ${name} crossword author writing answer words and clues for crossword and scanword puzzles.`,
    `Your solvers are ${name} speakers from ${culture}. Think and write directly in ${name}: never translate from English or any other language, never mix languages, never use a calque where ${name} has its own word.`,
    'Every entry has:',
    `- word: the answer — ONE word, lowercase, spelled exactly as ${name} writes it. No spaces, hyphens, digits or abbreviations.`,
    '- clue: a full crossword clue, at most 90 characters, that defines the word precisely enough for its length.',
    '- shortClue: the same idea in at most 3 words and 24 characters, to be printed inside a small scanword cell.',
    '- kind: "proper" for a proper noun (a place, a person, a named work), otherwise "common".',
    'Rules:',
    '- Neither clue may contain the answer, a word of the same root, or a part of it.',
    '- Every word is a real, well-known dictionary word (or, where allowed, a well-known proper noun) — never invented.',
    '- Facts in clues are stable and verifiable. No politics, wars, tragedies, religious disputes, nothing rude or sexual.',
    '- All entries in a batch are different words.',
    `The style guide below, written in ${name}, is binding:`,
    styleGuide,
    'Examples of the tone and format:',
    ...examples.map((example) => JSON.stringify({ word: example.word, clue: example.clue, shortClue: example.shortClue })),
  ].join('\n')
}

const buildPrompt = ({ locale, topic, difficulty, seeding }: GenerateParams): string => {
  const { topicNames, difficultyGuide } = LOCALE_CONTENT[locale]
  const lines = [
    `Write ${BATCH_SIZE} new entries.`,
    `Topic: ${topicNames[topic]}. Focus on: ${seeding.subtopic}.`,
    `Difficulty: ${difficultyGuide[difficulty]}`,
    `Every word must start with one of these letters: ${seeding.letters.join(', ')} — at least 3 words for each letter.`,
    'Word lengths: about 10 words of 3–5 letters, 10 of 6–8 letters, 5 of 9 letters or more.',
    PROPER_NOUN_TOPICS.includes(topic)
      ? 'Well-known proper nouns of this topic are welcome, but at most a third of the batch.'
      : 'No proper nouns at all.',
  ]
  if (seeding.avoid.length) {
    lines.push(`These words are already used — do not write any of them, or any word of the same root:\n${seeding.avoid.join(', ')}`)
  }
  return lines.join('\n')
}

const asCandidates = (text: string, difficulty: Difficulty): CandidateEntry[] => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return []
  }
  const items = (parsed as { entries?: unknown })?.entries
  if (!Array.isArray(items)) return []
  return items.flatMap((item): CandidateEntry[] => {
    const raw = item as Record<string, unknown>
    if (typeof raw.word !== 'string' || typeof raw.clue !== 'string' || typeof raw.shortClue !== 'string') return []
    // The bucket's difficulty: the prompt aimed at it, and solvers' reveals recalibrate it later.
    return [{ word: raw.word, clue: raw.clue, shortClue: raw.shortClue, kind: raw.kind === 'proper' ? 'proper' : 'common', difficulty }]
  })
}

const JUDGE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    verdicts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          index: { type: Type.INTEGER },
          realWord: { type: Type.BOOLEAN },
          rightForm: { type: Type.BOOLEAN },
          clueCorrect: { type: Type.BOOLEAN },
          natural: { type: Type.BOOLEAN },
        },
        required: ['index', 'realWord', 'rightForm', 'clueCorrect', 'natural'],
      },
    },
  },
  required: ['verdicts'],
}

type Verdict = { index: number; realWord: boolean; rightForm: boolean; clueCorrect: boolean; natural: boolean }

/**
 * A second opinion from a different model, acting as the puzzle editor. A blind "solve it"
 * check would be the wrong test — crossword clues are legitimately open ("pet, 3 letters") —
 * so the judge grades each entry against the style guide instead. When the judge call itself
 * fails the batch is kept unverified: losing good words to a quota blip is worse.
 */
export const judgeEntries = async (
  entries: ValidEntry[],
  locale: Locale,
  generatorModel: string
): Promise<{ entries: ValidEntry[]; verified: boolean }> => {
  if (!entries.length) return { entries, verified: true }
  const { name, styleGuide } = LOCALE_CONTENT[locale]
  const listing = entries
    .map((entry, index) => `${index}. ${entry.word} — ${entry.clue} | ${entry.shortClue}${entry.kind === 'proper' ? ' (proper noun)' : ''}`)
    .join('\n')

  try {
    const { text } = await generateJson({
      avoidModel: generatorModel,
      systemInstruction: [
        `You are a strict editor of ${name} crossword puzzles and a native ${name} speaker.`,
        'For every numbered entry "word — clue | short clue", answer:',
        `- realWord: the word really exists in ${name} and is well known (or is a well-known proper noun when marked so).`,
        '- rightForm: the word is in the dictionary form the style guide requires.',
        '- clueCorrect: both clues are factually right, point at this word, and do not give away its root.',
        `- natural: both clues read as idiomatic native ${name}, not as a translation.`,
        'Style guide:',
        styleGuide,
      ].join('\n'),
      contents: listing,
      schema: JUDGE_SCHEMA,
      temperature: 0,
      maxOutputTokens: 4096,
    })
    const verdicts = (JSON.parse(text) as { verdicts?: unknown }).verdicts
    if (!Array.isArray(verdicts)) return { entries, verified: false }
    const passed = new Set(
      (verdicts as Verdict[])
        .filter((verdict) => verdict.realWord && verdict.rightForm && verdict.clueCorrect && verdict.natural)
        .map((verdict) => verdict.index)
    )
    return { entries: entries.filter((_, index) => passed.has(index)), verified: true }
  } catch {
    return { entries, verified: false }
  }
}

export type GenerationResult = {
  entries: ValidEntry[]
  model: string
  verified: boolean
  /** Gemini calls spent, the judge included. */
  calls: number
  returned: number
  valid: number
  /** Proposed words that failed validation or the judge — named in the next attempt's avoid list. */
  rejectedWords: string[]
}

/** One generation (plus the judge). Throws `AllModelsFailedError` when the chain is exhausted. */
export const generateEntries = async (params: GenerateParams): Promise<GenerationResult> => {
  const { text, model } = await generateJson({
    systemInstruction: buildSystemInstruction(params.locale, params.seeding.examples),
    contents: buildPrompt(params),
    schema: ENTRIES_SCHEMA,
    maxOutputTokens: 8192,
    // Armenian is the language the cheapest model writes least well.
    strongestFirst: params.locale === 'hy',
  })

  const candidates = asCandidates(text, params.difficulty)
  const { entries: valid } = validateBatch(candidates, params.locale, params.topic)
  const judged = config.gemini.verifyEntries
    ? await judgeEntries(valid, params.locale, model)
    : { entries: valid, verified: false }

  const kept = new Set(judged.entries.map(({ answer }) => answer))
  const lower = (word: string) => word.trim().toLocaleLowerCase(params.locale)
  return {
    entries: judged.entries,
    model,
    verified: judged.verified && config.gemini.verifyEntries,
    calls: config.gemini.verifyEntries && valid.length ? 2 : 1,
    returned: candidates.length,
    valid: valid.length,
    rejectedWords: candidates
      .filter(({ word }) => !kept.has(normalizeWord(word, params.locale) ?? lower(word)))
      .map(({ word }) => lower(word)),
  }
}
