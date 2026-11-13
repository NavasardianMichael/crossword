import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { SERVER_ONLY_NAMESPACES } from '@i18n/config'

const SRC = path.resolve(__dirname, '../../../src')

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(name) ? [full] : []
  })

/** Code that can run in the browser: `'use client'` modules, and the hooks and stores they use. */
const clientFiles = files(SRC).filter((file) => {
  const relative = path.relative(SRC, file).split(path.sep).join('/')
  return /^(hooks|store)\//.test(relative) || /^\s*['"]use client['"]/.test(readFileSync(file, 'utf8'))
})

describe('the catalogue sent to the browser', () => {
  it('finds client code to check', () => {
    expect(clientFiles.length).toBeGreaterThan(40)
  })

  // The layout leaves these namespaces out of NextIntlClientProvider: a client read would be a
  // missing message in production.
  it.each(SERVER_ONLY_NAMESPACES)('no client code reads %s', (namespace) => {
    // eslint-disable-next-line security/detect-non-literal-regexp -- namespaces come from a fixed list
    const pattern = new RegExp(`['"\`]${namespace}[.'"\`]`)
    const offenders = clientFiles.filter((file) => pattern.test(readFileSync(file, 'utf8')))
    expect(offenders.map((file) => path.relative(SRC, file))).toEqual([])
  })
})
