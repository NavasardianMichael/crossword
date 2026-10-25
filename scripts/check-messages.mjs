#!/usr/bin/env node
/**
 * Checks translated catalogues against `src/messages/en.json`:
 *   - the same set of keys (nothing missing, nothing extra);
 *   - every `{placeholder}` of the English string is present in the translation;
 *   - ICU messages still parse (balanced braces, `plural` blocks keep an `other` branch);
 *   - arrays (long-form page sections) exist, but may differ in length — a language takes the
 *     paragraphs it needs.
 *
 * Usage: node scripts/check-messages.mjs [locale ...]   (no locales = all of them)
 * Exits non-zero on any problem. `tests/unit/i18n/catalogues.spec.ts` runs the same checks.
 */
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'src/messages')

const flatten = (object, prefix = '') =>
  Object.entries(object).flatMap(([key, value]) => {
    if (Array.isArray(value)) return value.length ? [[`${prefix}${key}`, '[list]']] : []
    return value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, String(value)]]
  })

/** Top-level argument names: `{count, plural, …}` → count, `{name}` → name. */
export const placeholders = (message) => {
  const names = new Set()
  let depth = 0
  for (let i = 0; i < message.length; i++) {
    if (message[i] === '{') {
      if (depth === 0) {
        const match = /^\{\s*([A-Za-z][\w]*)\s*[,}]/.exec(message.slice(i))
        if (match) names.add(match[1])
      }
      depth++
    } else if (message[i] === '}') depth--
  }
  return names
}

export const balanced = (message) => {
  let depth = 0
  for (const char of message) {
    if (char === '{') depth++
    if (char === '}') depth--
    if (depth < 0) return false
  }
  return depth === 0
}

/** Values every language keeps verbatim. None yet: even the app's name is translated (Common.appName). */
const PRESERVED = []

export const checkLocale = (locale, english = flatten(JSON.parse(readFileSync(path.join(DIR, 'en.json'), 'utf8')))) => {
  const problems = []
  let translated
  try {
    translated = new Map(flatten(JSON.parse(readFileSync(path.join(DIR, `${locale}.json`), 'utf8'))))
  } catch (error) {
    return [`${locale}: invalid JSON — ${error.message}`]
  }
  const englishMap = new Map(english)

  for (const [key, source] of english) {
    const value = translated.get(key)
    if (value === undefined) {
      problems.push(`${locale}: missing ${key}`)
      continue
    }
    if (!balanced(value)) problems.push(`${locale}: unbalanced braces in ${key}`)
    for (const name of placeholders(source)) {
      if (!placeholders(value).has(name)) problems.push(`${locale}: ${key} lost {${name}}`)
    }
    if (/\bplural\b/.test(source) && !/\bother\s*\{/.test(value)) problems.push(`${locale}: ${key} plural has no "other"`)
  }
  for (const key of translated.keys()) if (!englishMap.has(key)) problems.push(`${locale}: extra key ${key}`)
  for (const [key, expected] of PRESERVED) {
    if (translated.get(key) !== expected) problems.push(`${locale}: ${key} must stay "${expected}"`)
  }
  return problems
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const requested = process.argv.slice(2)
  const locales = requested.length
    ? requested
    : readdirSync(DIR)
        .filter((file) => file.endsWith('.json') && file !== 'en.json')
        .map((file) => file.replace(/\.json$/, ''))
  const problems = locales.flatMap((locale) => checkLocale(locale))
  for (const problem of problems.slice(0, 200)) console.log(problem)
  console.log(problems.length ? `\n${problems.length} problem(s) in ${locales.length} locale(s).` : `${locales.length} locale(s) OK.`)
  process.exit(problems.length ? 1 : 0)
}
