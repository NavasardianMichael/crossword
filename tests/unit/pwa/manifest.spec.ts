import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildManifest, manifestPath } from '@helpers/manifest'
import manifest from '../../../src/app/manifest'

const PUBLIC = path.resolve(__dirname, '../../../public')

/** Width and height from a PNG's IHDR chunk. */
const pngSize = (file: string): string => {
  const bytes = readFileSync(file)
  return `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`
}

describe('web manifest', () => {
  const { icons = [], screenshots = [], start_url } = manifest()

  it('offers the 192px and 512px icons install checks look for, plus a maskable one', () => {
    const sizes = icons.filter((icon) => icon.purpose === 'any').map((icon) => icon.sizes)
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']))
    expect(icons.some((icon) => icon.purpose === 'maskable')).toBe(true)
  })

  it('starts on a locale page, never on the redirecting root', () => {
    expect(start_url).toMatch(/^\/[a-z]{2}$/)
  })

  it('has narrow and wide screenshots, each the size its file really is', () => {
    expect(screenshots.filter((each) => each.form_factor === 'narrow').length).toBeGreaterThan(0)
    expect(screenshots.filter((each) => each.form_factor === 'wide').length).toBeGreaterThan(0)
    for (const each of screenshots) {
      expect(pngSize(path.join(PUBLIC, each.src))).toBe(each.sizes)
      expect(each.label).toBeTruthy()
    }
  })

  it('keeps every screenshot within the 2.3:1 ratio Chrome accepts', () => {
    for (const { sizes } of screenshots) {
      const [width, height] = sizes!.split('x').map(Number)
      expect(Math.max(width, height) / Math.min(width, height)).toBeLessThanOrEqual(2.3)
    }
  })
})

describe('per-language manifests', () => {
  const copy = { name: 'Խաչբառ AI', description: 'x' }

  it('opens the language it was installed from, as one app across languages', () => {
    const hy = buildManifest('hy', copy)
    expect(hy.start_url).toBe('/hy')
    expect(hy.lang).toBe('hy')
    expect(hy.id).toBe(manifest().id)
    expect(hy.shortcuts?.map(({ url }) => url)).toEqual(['/hy/crossword', '/hy/scanword'])
  })

  it('reads right to left where the language does, and handles three-letter codes', () => {
    expect(buildManifest('he', copy).dir).toBe('rtl')
    expect(buildManifest('fil', copy).start_url).toBe('/fil')
    expect(manifestPath('fil')).toBe('/manifests/fil.webmanifest')
  })

  it('falls back to the English short name when the translated one is too long for a launcher', () => {
    expect(buildManifest('de', { name: 'Kreuzworträtsel KI', description: 'x' }).short_name).toBe('Crossword AI')
  })
})
