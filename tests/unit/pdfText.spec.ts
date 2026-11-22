import bidiFactory from 'bidi-js'
import { describe, expect, it } from 'vitest'
import { fontRuns, type RunFace, type RunFont, scriptOf, scriptsIn, visualRuns } from '@helpers/puzzle/pdfText'

/** Fake fonts: what each can draw, by code point ranges. */
const font = (name: string, ...ranges: [number, number][]): RunFont & { name: string } => {
  const chars = new Set<number>()
  for (const [from, to] of ranges) for (let code = from; code <= to; code++) chars.add(code)
  return { name, chars }
}

const ASCII: [number, number] = [0x20, 0x7e]
const latin = font('latin', ASCII, [0xc0, 0x24f], [0x400, 0x4ff])
const armenian = font('armenian', ASCII, [0x530, 0x58f])
const arabic = font('arabic', ASCII, [0x600, 0x6ff])
const thai = font('thai', ASCII, [0xe00, 0xe7f])
const face: RunFace<typeof latin> = { primary: latin, fallbacks: [], scripts: { armenian, arabic, thai } }

const runs = (list: { text: string; font: { name: string } }[]) => list.map((run) => [run.text, run.font.name])

describe('PDF scripts', () => {
  it('names the font a character needs, Han by the puzzle’s language', () => {
    expect(scriptOf('a', 'en')).toBeUndefined()
    expect(scriptOf('ж', 'ru')).toBeUndefined()
    expect(scriptOf('ու'[0]!, 'hy')).toBe('armenian')
    expect(scriptOf('ש', 'he')).toBe('hebrew')
    expect(scriptOf('क', 'hi')).toBe('devanagari')
    expect(scriptOf('水', 'zh')).toBe('sc')
    expect(scriptOf('水', 'ja')).toBe('jp')
    expect(scriptOf('ね', 'en')).toBe('jp')
    expect(scriptOf('한', 'en')).toBe('kr')
  })

  it('lists each script a sheet needs once, in a fixed order', () => {
    expect(scriptsIn(['Crossword', 'Խաչբառ', 'كلمات', 'խաչ'], 'en')).toEqual(['armenian', 'arabic'])
  })
})

describe('font runs', () => {
  it('splits text between fonts at script changes; a space stays in the run it follows', () => {
    expect(runs(fontRuns('Crossword Խաչբառ AI', face, 'hy'))).toEqual([
      ['Crossword ', 'latin'],
      ['Խաչբառ ', 'armenian'],
      ['AI', 'latin'],
    ])
  })

  it('keeps an Arabic phrase, its spaces and digits one run: one shaping context', () => {
    expect(runs(fontRuns('حيوان أليف 12', face, 'ar'))).toEqual([['حيوان أليف 12', 'arabic']])
  })

  it('keeps Thai marks with their letters', () => {
    expect(runs(fontRuns('ที่อยู่', face, 'th'))).toEqual([['ที่อยู่', 'thai']])
  })
})

describe('right-to-left runs', () => {
  const bidi = bidiFactory()

  it('orders a line for drawing: numbers stay left-to-right, brackets mirror', () => {
    // Read right to left: «قطة (12)». Drawn left to right: "(", "12", then the Arabic run —
    // handed over in logical order with its bracket mirrored, for the shaper to reverse.
    expect(runs(visualRuns('قطة (12)', face, 'ar', bidi))).toEqual([
      ['(', 'latin'],
      ['12', 'latin'],
      ['قطة )', 'arabic'],
    ])
  })

  it('keeps a Latin URL in a right-to-left line in its own order', () => {
    const drawn = visualRuns('العب: https://x.example/ar', face, 'ar', bidi)
    expect(drawn.map((run) => run.text).join('')).toContain('https://x.example/ar')
  })
})
