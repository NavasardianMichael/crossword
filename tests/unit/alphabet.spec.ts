import { describe, expect, it } from 'vitest'
import {
  cellCount,
  displayCell,
  displayWord,
  foldTyped,
  mergeTyped,
  normalizeWord,
  toCells,
} from '../../server/src/lib/alphabet.js'

describe('normalizeWord', () => {
  it('lowercases and keeps a plain word', () => {
    expect(normalizeWord('Garden', 'en')).toBe('garden')
    expect(normalizeWord(' Самовар ', 'ru')).toBe('самовар')
    expect(normalizeWord('Ծիրան', 'hy')).toBe('ծիրան')
  })

  it('rejects anything that is not one word of the alphabet', () => {
    for (const word of ['ice cream', 'well-being', "o'clock", 'b52', 'café', '']) expect(normalizeWord(word, 'en')).toBeNull()
    for (const word of ['кто-то', 'Ivan', 'ёлка2']) expect(normalizeWord(word, 'ru')).toBeNull()
    for (const word of ['կարմիր խնձոր', 'Erevan', 'Մոսկվա-Երևան']) expect(normalizeWord(word, 'hy')).toBeNull()
  })

  it('folds ё into е but never touches й', () => {
    expect(normalizeWord('Ёлка', 'ru')).toBe('елка')
    expect(normalizeWord('чайник', 'ru')).toBe('чайник')
    expect(normalizeWord('чайник'.normalize('NFD'), 'ru')).toBe('чайник')
  })

  it('strips stress marks and invisible characters', () => {
    expect(normalizeWord('мука́', 'ru')).toBe('мука')
    expect(normalizeWord('co­conut', 'en')).toBe('coconut')
    expect(normalizeWord('Երևա՛ն', 'hy')).toBe('երևան')
  })

  it('reads Armenian ու as one letter and և in either spelling', () => {
    expect(normalizeWord('ՈՒՂԻՂ', 'hy')).toBe('ուղիղ')
    expect(normalizeWord('Երեւան', 'hy')).toBe('երևան')
    expect(cellCount('երևան', 'hy')).toBe(5)
    expect(cellCount('ուղիղ', 'hy')).toBe(4)
  })

  it('rejects classical Armenian spelling', () => {
    expect(normalizeWord('իւղ', 'hy')).toBeNull()
  })
})

describe('cells', () => {
  it('splits ու as one cell, other letters one by one', () => {
    expect(toCells('կուլա', 'hy')).toEqual(['կ', 'ու', 'լ', 'ա'])
    expect(toCells('ձու', 'hy')).toEqual(['ձ', 'ու'])
    expect(toCells('ночь', 'ru')).toEqual(['н', 'о', 'ч', 'ь'])
  })

  it('prints grid capitals, keeping և as written', () => {
    expect(displayCell('ու', 'hy')).toBe('ՈՒ')
    expect(displayCell('և', 'hy')).toBe('և')
    expect(displayWord('երևան', 'hy')).toBe('ԵՐևԱՆ')
    expect(displayCell('й', 'ru')).toBe('Й')
    expect(displayCell('i', 'en')).toBe('I')
  })
})

describe('typing', () => {
  it('folds keystrokes into cell tokens', () => {
    expect(foldTyped('Ё', 'ru')).toBe('е')
    expect(foldTyped('Q', 'en')).toBe('q')
    expect(foldTyped('և', 'hy')).toBe('և')
    expect(foldTyped('ՈՒ', 'hy')).toBe('ու')
    expect(foldTyped('ւ', 'hy')).toBeNull()
    expect(foldTyped('1', 'en')).toBeNull()
    expect(foldTyped('q', 'ru')).toBeNull()
  })

  it('merges ո then ւ into ու, and nothing else', () => {
    expect(mergeTyped('ո', 'ւ', 'hy')).toBe('ու')
    expect(mergeTyped('ո', 'Ւ', 'hy')).toBe('ու')
    expect(mergeTyped('ա', 'ւ', 'hy')).toBeNull()
    expect(mergeTyped('ու', 'ւ', 'hy')).toBeNull()
    expect(mergeTyped('е', 'е', 'ru')).toBeNull()
  })
})
