import { describe, expect, it } from 'vitest'
import { safeReturnPath as onServer } from '../../server/src/lib/return-path.js'
import { safeReturnPath as onWeb } from '../../src/constants/auth'

const ORIGIN = 'https://crossword.example'

describe.each([
  ['server', onServer],
  ['web', onWeb],
])('safeReturnPath (%s)', (_, safeReturnPath) => {
  it.each(['/', '/en/crossword', '/hy/p/abc?x=1#top', '/en/topics/%D5%A1'])('keeps the same-site path %j as it is', (path) => {
    expect(safeReturnPath(path)).toBe(path)
  })

  it.each([
    ['/en/his\ttory', '/en/history'],
    ['/en/his\ntory', '/en/history'],
    ['/en\\history', '/en/history'],
    ['/en/my puzzles', '/en/my%20puzzles'],
    ['en/history', '/en/history'],
    ['/.//evil.example', '/evil.example'],
  ])('cleans %j into %j instead of refusing it', (input, cleaned) => {
    expect(safeReturnPath(input)).toBe(cleaned)
  })

  it.each([
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '\\\\evil.example',
    '/\t/evil.example',
    '/\n/evil.example',
    '/\r/evil.example',
    ' //evil.example',
    'javascript:alert(1)',
    `/${'a'.repeat(512)}`,
    42,
    undefined,
  ])('refuses %j, which would leave the site', (value) => {
    expect(safeReturnPath(value)).toBeUndefined()
  })

  // Whatever it returns must stay on our origin when a browser resolves it.
  it('never returns a path that resolves off-site', () => {
    const probes = ['/\t/evil.example', '/\\/evil.example', '/%2F/evil.example', '/.//evil.example', '/x/../\t/evil.example', '/./\\evil.example', '/\u0000/x', '/x?\t//y#\\z']
    for (const probe of probes) {
      const path = safeReturnPath(probe)
      if (path === undefined) continue
      expect(path).toMatch(/^\/(?!\/)/)
      expect(new URL(path, ORIGIN).origin).toBe(ORIGIN)
    }
  })
})
