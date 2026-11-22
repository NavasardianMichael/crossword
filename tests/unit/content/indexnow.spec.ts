import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { pathsFor } from '../../../scripts/content/indexnow.mjs'

describe('guides IndexNow', () => {
  it('has exactly one key file, holding its own name', () => {
    const dir = path.resolve(__dirname, '../../../public')
    const keys = readdirSync(dir).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name))
    expect(keys).toHaveLength(1)
    expect(`${readFileSync(path.join(dir, keys[0]), 'utf8')}.txt`).toBe(keys[0])
  })

  it('announces each changed guide and its hub, in its own language', () => {
    expect(
      pathsFor(['src/content/guides/hy/hayeren-khachbar.ts', 'src/content/guides/en/armenian-crossword.ts', 'src/app/page.tsx'], ['en', 'hy'])
    ).toEqual(['/en/guides', '/en/guides/armenian-crossword', '/hy/guides', '/hy/guides/hayeren-khachbar'])
  })

  it("announces a language's hub for its list, and every hub for the shared registry", () => {
    expect(pathsFor(['src/content/guides/fil/index.ts'], ['en', 'fil'])).toEqual(['/fil/guides'])
    expect(pathsFor(['src/content/index.ts'], ['en', 'hy'])).toEqual(['/en/guides', '/hy/guides'])
    expect(pathsFor(['README.md'], ['en'])).toEqual([])
  })
})
