#!/usr/bin/env node
/**
 * Design-system and convention grep gates (bookie's pattern). Every gate must report 0 hits.
 * Scoped by extension so the docs that describe a gate never trip it; this file lives in
 * `scripts/`, outside every gate's root.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const TS = ['.ts', '.tsx']
const TSX = ['.tsx']
const CODE = ['.ts', '.tsx', '.css']

const GATES = [
  {
    name: 'no hex colours outside the token files',
    why: 'Colours live in src/styles/globals.css §1 and its mirror src/styles/tokens.ts — src/styles/CLAUDE.md',
    root: 'src',
    exts: TS,
    pattern: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])/,
    // The palette itself.
    skip: /^src\/styles\//,
    excludeLine: /^\s*(\/\/|\*)/,
  },
  {
    name: 'no `dark:` variants',
    why: 'Light only, by design — there is no dark theme (src/CLAUDE.md)',
    root: 'src',
    exts: CODE,
    pattern: /\bdark:/,
  },
  {
    name: 'no dark colour-scheme queries',
    why: 'Light only, by design — there is no dark theme (src/CLAUDE.md)',
    root: 'src',
    exts: CODE,
    pattern: /prefers-color-scheme:\s*dark|colorScheme:\s*'dark'/,
  },
  {
    name: 'no CSS uppercase on grid letters',
    why: "CSS uppercases Armenian և to the classical ԵՒ; print cells through displayCell (constants/alphabet.ts)",
    root: 'src/components/puzzle',
    exts: TSX,
    pattern: /\buppercase\b|text-transform/,
    // Labels that are not puzzle letters.
    excludeLine: /text-caption/,
  },
  {
    name: 'no Tailwind `2xl:` breakpoint',
    why: "globals.css resets Tailwind's scale; only sm/md/lg/xl exist",
    root: 'src',
    exts: TSX,
    pattern: /\b2xl:[a-z]/,
  },
  {
    name: "no raw `next/link`",
    why: 'Drops the locale prefix — use AppLink / @i18n/navigation',
    root: 'src',
    exts: TS,
    pattern: /from 'next\/link'/,
  },
  {
    name: "no raw `next/navigation` routing",
    why: 'Use @i18n/navigation for internal destinations; `notFound` and `useSearchParams` are fine',
    root: 'src',
    exts: TS,
    pattern: /from 'next\/navigation'/,
    excludeLine: /notFound|useSearchParams/,
  },
  {
    name: 'no default exports in components',
    why: 'A default export lets each import site rename the symbol — root CLAUDE.md',
    root: 'src/components',
    exts: TS,
    pattern: /export default/,
  },
  {
    name: 'no silently swallowed promise',
    why: 'Surface it, or route a deliberate silence through `reportError`',
    root: 'src',
    exts: TS,
    pattern: /\.catch\(\(\)\s*=>\s*(undefined|null|\{\s*\})\)/,
  },
  {
    name: 'no hand-rolled error alerts',
    why: 'Inline errors go through ErrorAlert — translated copy plus development details',
    root: 'src',
    exts: TSX,
    pattern: /role=['"]alert['"]/,
    skip: /^src\/components\/ui\/ErrorAlert\.tsx$/,
  },
  {
    name: 'no server message rendered to users',
    why: "The API's English messages are for developers; show translated copy by error kind",
    root: 'src',
    exts: TSX,
    pattern: /error\??\.message\}/,
  },
  {
    name: 'no bare antd Modal / Drawer',
    why: 'Overlays go through Dialog (sheet on phones, labelled close, pending lock) — src/CLAUDE.md',
    root: 'src',
    exts: TSX,
    pattern: /<(Modal|Drawer)\b/,
    skip: /^src\/components\/ui\/Dialog\.tsx$/,
  },
  {
    name: 'no deprecated antd props',
    why: 'antd 6 renamed them: mask={{ closable }}, destroyOnHidden, styles={{ body | mask }}, classNames={{ popup }}',
    root: 'src',
    exts: TSX,
    pattern: /\b(maskClosable|destroyOnClose|bodyStyle|maskStyle|dropdownClassName|dropdownStyle)=/,
  },
  {
    name: 'no `--ant-*` variables outside the alias block',
    why: 'globals.css §2 is the one place antd variables are named; use the --brand-* aliases or utilities',
    root: 'src',
    exts: CODE,
    pattern: /var\(--ant-/,
    skip: /^src\/styles\/globals\.css$/,
  },
  {
    name: 'no `process.env` outside config in the API',
    why: 'Every server env read lives in server/src/config.ts — server/CLAUDE.md',
    root: 'server/src',
    exts: ['.ts'],
    pattern: /process\.env\./,
    skip: /^server\/src\/(config|load-env)\.ts$/,
  },
  {
    name: 'no deleting pool words',
    why: 'Entries are retired, never deleted: a deleted word could come back under a new id past every seen-list — server/CLAUDE.md',
    root: 'server/src',
    exts: ['.ts'],
    pattern: /entry\.delete(Many)?\(|DELETE FROM "Entry"/,
  },
  {
    name: 'no GEMINI key outside lib/gemini.ts',
    why: 'One reader per secret — server/CLAUDE.md',
    root: 'server/src',
    exts: ['.ts'],
    pattern: /gemini\.key/,
    skip: /^server\/src\/(lib\/gemini|config)\.ts$/,
  },
]

const walk = (dir, exts, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, exts, out)
    else if (exts.includes(path.extname(entry))) out.push(full)
  }
  return out
}

const hitsFor = ({ root, exts, pattern, skip, excludeLine }) =>
  walk(path.join(ROOT, root), exts)
    .map((file) => ({ file, rel: path.relative(ROOT, file).split(path.sep).join('/') }))
    .filter(({ rel }) => !skip?.test(rel))
    .flatMap(({ file, rel }) =>
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .map((line, index) => ({ rel, line: index + 1, text: line.trim() }))
        .filter(({ text }) => pattern.test(text))
        .filter(({ text }) => !excludeLine?.test(text))
    )

let failed = 0
for (const gate of GATES) {
  const hits = hitsFor(gate)
  if (!hits.length) {
    console.log(`  ok   ${gate.name}`)
    continue
  }
  failed += 1
  console.log(`  FAIL ${gate.name} — ${hits.length} hit${hits.length > 1 ? 's' : ''}`)
  console.log(`       ${gate.why}`)
  for (const hit of hits.slice(0, 10)) console.log(`       ${hit.rel}:${hit.line}  ${hit.text.slice(0, 100)}`)
}

console.log(failed ? `\n${failed} of ${GATES.length} gates failed.` : `\n${GATES.length} gates clean.`)
process.exit(failed ? 1 : 0)
