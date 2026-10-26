import { describe, expect, it } from 'vitest'
import { isGiveaway, validateBatch, validateEntry } from '../../server/src/services/entryValidation.js'

const entry = (word: string, clue: string, shortClue: string, kind: 'common' | 'proper' = 'common') => ({
  word,
  clue,
  shortClue,
  kind,
  difficulty: 1 as const,
})

describe('isGiveaway', () => {
  it('catches the answer and words of its root', () => {
    expect(isGiveaway('лес', 'Лесной массив', 'ru')).toBe(true)
    expect(isGiveaway('garden', 'A gardener works here', 'en')).toBe(true)
    expect(isGiveaway('ջուր', 'Ջուրը հոսում է', 'hy')).toBe(true)
  })

  it('catches a long part of a compound', () => {
    expect(isGiveaway('waterfall', 'A fall of water from a cliff', 'en')).toBe(true)
  })

  it('lets unrelated words with a short shared start through', () => {
    expect(isGiveaway('forest', 'Land covered with trees, good for a walk', 'en')).toBe(false)
    expect(isGiveaway('tear', 'The greatest earnest drop from an eye', 'en')).toBe(false)
    expect(isGiveaway('самовар', 'Медный сосуд для чаепития', 'ru')).toBe(false)
    expect(isGiveaway('car', 'Red bird, the cardinal, sits on it', 'en')).toBe(false)
    expect(isGiveaway('ant', 'Tiny worker found even near Antarctica', 'en')).toBe(false)
  })
})

describe('validateEntry', () => {
  it('accepts a native entry and measures it in cells', () => {
    const result = validateEntry(entry('Ուղտ', 'Անապատի համբերատար ճամփորդը', 'Անապատի նավ'), 'hy', 'animals')
    expect('entry' in result && result.entry).toMatchObject({ answer: 'ուղտ', length: 3, firstCell: 'ու' })
  })

  it('rejects clues in the wrong script or with foreign letters', () => {
    expect(validateEntry(entry('кот', 'A pet that purrs', 'Мурлыка'), 'ru', 'animals')).toEqual({ rejection: 'clueScript' })
    expect(validateEntry(entry('кот', 'Домашний любимец, по-английски cat', 'Мурлыка'), 'ru', 'animals')).toEqual({
      rejection: 'clueScript',
    })
  })

  it('rejects proper nouns outside geography and local culture', () => {
    const volga = entry('Волга', 'Великая русская река', 'Река', 'proper')
    expect(validateEntry(volga, 'ru', 'nature')).toEqual({ rejection: 'properNoun' })
    expect('entry' in validateEntry(volga, 'ru', 'geography')).toBe(true)
  })

  it('rejects a short clue that does not fit a scanword cell', () => {
    expect(validateEntry(entry('кот', 'Домашний мурлыка', 'Домашний ласковый усатый зверёк'), 'ru', 'animals')).toEqual({
      rejection: 'shortClueLength',
    })
  })

  it('rejects words that are too short or too long', () => {
    expect(validateEntry(entry('ox', 'A strong farm animal', 'Farm beast'), 'en', 'animals')).toEqual({ rejection: 'length' })
  })
})

describe('validateBatch', () => {
  it('drops duplicates after normalization and counts rejections', () => {
    const { entries, rejections } = validateBatch(
      [entry('Ёлка', 'Новогоднее дерево', 'Хвойное'), entry('елка', 'Лесная красавица', 'Хвойное'), entry('x', 'y', 'z')],
      'ru',
      'nature'
    )
    expect(entries.map(({ answer }) => answer)).toEqual(['елка'])
    expect(rejections).toEqual({ duplicate: 1, notAWord: 1 })
  })
})
