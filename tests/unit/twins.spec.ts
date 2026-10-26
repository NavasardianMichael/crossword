import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The web app and the API each carry a copy of the puzzle vocabulary and the alphabet rules —
 * separate packages, different module resolution. Below the marker line the copies must be
 * identical, or the device would split, type and check words differently from the server
 * that measured and laid them out.
 */
const ROOT = path.resolve(__dirname, '../..')
const MARKER = '// --- twin: keep identical below this line ---'

const below = (file: string) => {
  const text = readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n')
  const index = text.indexOf(MARKER)
  expect(index, `${file} has the twin marker`).toBeGreaterThanOrEqual(0)
  return text.slice(index)
}

describe('twin files', () => {
  it.each([
    ['src/constants/puzzle.ts', 'server/src/lib/puzzle.ts'],
    ['src/constants/alphabet.ts', 'server/src/lib/alphabet.ts'],
  ])('%s matches %s', (web, server) => {
    expect(below(web)).toBe(below(server))
  })
})
