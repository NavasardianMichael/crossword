#!/usr/bin/env node
/**
 * Assembles the API's deployable release directory (default `out/api`).
 *
 * The API cannot ship as a slice of the workspace: `pnpm install --filter crossword-server`
 * still installs every root dependency (next, antd, the whole web toolchain — ~900MB) and
 * still runs the root's `prepare: husky`, which is absent from a production install. And it
 * cannot ship a prebuilt `node_modules` either: `pnpm deploy` reassembles the virtual store
 * in a layout where Prisma's generated client fails to resolve its own `#main-entry-point`
 * self-reference.
 *
 * So the release is a standalone, single-package project: `dist/` + `prisma/` + a
 * `package.json` holding only the runtime dependencies, at the **exact** versions the
 * workspace lockfile resolved. Exact versions matter — a `^` range would let the server
 * install a different patch than CI tested. The deploy then runs a plain
 * `pnpm install --prod --frozen-lockfile` on the host, which is the same code path as a
 * normal install, so `@prisma/client`'s postinstall generates a working client and every
 * native dependency (the Prisma engines) is fetched for the host's own platform rather than
 * the runner's.
 *
 * Usage: node scripts/build-api-release.mjs [outDir]
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const serverDir = path.join(rootDir, 'server')
const outDir = path.resolve(rootDir, process.argv[2] ?? 'out/api')

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))

const serverPkg = readJson(path.join(serverDir, 'package.json'))
const rootPkg = readJson(path.join(rootDir, 'package.json'))

/** The version actually on disk after `pnpm install`, so prod matches what CI tested. */
function resolvedVersion(name) {
  const manifest = path.join(serverDir, 'node_modules', name, 'package.json')
  if (!existsSync(manifest)) {
    throw new Error(
      `${name} is not installed under server/node_modules — run \`pnpm install\` before this script.`
    )
  }
  return readJson(manifest).version
}

const dependencies = Object.fromEntries(
  Object.keys(serverPkg.dependencies).sort().map((name) => [name, resolvedVersion(name)])
)

if (!existsSync(path.join(serverDir, 'dist', 'src', 'index.js'))) {
  throw new Error('server/dist is missing — run `pnpm --filter crossword-server build` first.')
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

cpSync(path.join(serverDir, 'dist'), path.join(outDir, 'dist'), { recursive: true })
// The schema and migrations ship too: the deploy runs `prisma migrate deploy` on the host.
// So do the seed words: `node dist/prisma/seed.js` reads `prisma/seed/entries.<locale>.json`
// from the release's working directory. No TypeScript from prisma/: tsc already compiled
// seed.ts into dist/prisma, and check-seed.ts is a dev-time check.
const prismaDir = path.join(serverDir, 'prisma')
const prismaOut = path.join(outDir, 'prisma')
mkdirSync(prismaOut, { recursive: true })
cpSync(path.join(prismaDir, 'schema.prisma'), path.join(prismaOut, 'schema.prisma'))
cpSync(path.join(prismaDir, 'migrations'), path.join(prismaOut, 'migrations'), { recursive: true })
cpSync(path.join(prismaDir, 'seed'), path.join(prismaOut, 'seed'), {
  recursive: true,
  filter: (source) => statSync(source).isDirectory() || source.endsWith('.json'),
})

writeFileSync(
  path.join(outDir, 'package.json'),
  `${JSON.stringify(
    {
      name: serverPkg.name,
      version: serverPkg.version,
      private: true,
      type: 'module',
      // Pins the host install to the pnpm that resolved the lockfile. A corepack shim
      // reads this and fetches that exact version, so the deploy stops depending on
      // whichever pnpm the server happens to carry — or, after a Node reinstall drops
      // the shim, does not carry.
      packageManager: rootPkg.packageManager,
      // No `postinstall`/`prepare`: the host install must not migrate, seed, or reach for
      // husky. Migrations are an explicit, ordered step in the deploy script instead.
      scripts: { start: 'node dist/src/index.js' },
      dependencies,
    },
    null,
    2
  )}\n`
)

// `packages: []` makes the release its own workspace root. Without it pnpm walks up,
// resolves against the repo's workspace, and produces no standalone lockfile.
//
// `onlyBuiltDependencies` mirrors the repo's own pnpm-workspace.yaml and is REQUIRED:
// pnpm 10 blocks dependency install scripts by default, and a blocked @prisma/client
// postinstall means the client is never generated — the API then dies at boot with
// "Cannot find module '.prisma/client/default'".
const workspaceYaml = [
  'packages: []',
  '',
  'onlyBuiltDependencies:',
  "  - '@prisma/client'",
  "  - '@prisma/engines'",
  '  - prisma',
  '',
].join('\n')

writeFileSync(path.join(outDir, 'pnpm-workspace.yaml'), workspaceYaml)

console.log(`API release assembled at ${path.relative(rootDir, outDir)}`)
console.log(`  ${Object.keys(dependencies).length} runtime dependencies, pinned exactly`)
