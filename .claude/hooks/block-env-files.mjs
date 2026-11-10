// PreToolUse guard: Claude Code may not read or write dotenv files, except the `.example` templates.
// Checks only the fields that name files (paths, globs, shell commands) — not file contents or search patterns.
let raw = ''
for await (const chunk of process.stdin) raw += chunk

let input
try {
  input = JSON.parse(raw)
} catch {
  process.exit(0)
}

const { file_path, notebook_path, path, glob, command } = input.tool_input ?? {}
const targets = [file_path, notebook_path, path, glob, command].filter((value) => typeof value === 'string')

// A dotenv file name: preceded by a separator (so a property access on `process` does not count),
// followed by nothing, a further `.suffix` or a glob.
const DOTENV = /(^|[^\w$])\.env([.\w*-]*)/g
const namesSecretEnv = (text) =>
  [...text.matchAll(DOTENV)].some(([, , suffix]) => suffix !== '.example' && (suffix === '' || /^[.*]/.test(suffix)))

if (targets.some(namesSecretEnv)) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'This project does not let Claude Code read or write dotenv files (only the .example templates). Ask the user to check or change the value themselves.',
      },
    }),
  )
}
