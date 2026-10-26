#!/usr/bin/env bash
# Verifies a server is ready for the first deploy. Read-only — changes nothing.
#
#   bash preflight.sh /home/michael/apps/crossword
#
# Run it as the deploy user (michael), not as root: several checks are about what
# THAT user can do, and root would pass them spuriously.
set -uo pipefail

APP_DIR="${1:-/home/michael/apps/crossword}"
WEB_PORT="${WEB_PORT:-7007}"
API_PORT="${API_PORT:-9007}"
DB_PORT="${DB_PORT:-5007}"

pass=0 fail=0
ok()   { echo "  ok    $1"; pass=$((pass + 1)); }
bad()  { echo "  FAIL  $1"; fail=$((fail + 1)); }
note() { echo "        $1"; }

echo ""
echo "Preflight for $APP_DIR (as $(whoami))"
echo ""

echo "Toolchain"
# Keep in sync with .nvmrc, which .github/workflows/deploy.yml builds on.
BUILD_MAJOR=24
if command -v node >/dev/null; then
  v=$(node -v)
  major=${v#v}; major=${major%%.*}
  if [ "$major" -lt 20 ] 2>/dev/null; then
    bad "node $v is too old — next requires >=20.9.0"
  elif [ "$major" = "$BUILD_MAJOR" ]; then
    ok "node $v at $(command -v node) — matches the CI build"
  else
    ok "node $v at $(command -v node)"
    note "CI builds on Node $BUILD_MAJOR. Everything native here is N-API, so this works,"
    note "but matching majors removes a class of surprise — align one side."
    case $((major % 2)) in
      1) note "Node $major is an odd-numbered line: Current, never LTS. Prefer 24 LTS in production." ;;
    esac
  fi
else bad "node not on PATH"; fi

# Checked the way the DEPLOY invokes it, not the way you do. The deploy arrives as
# `ssh … bash -s` — non-interactive and non-login, so neither ~/.profile nor ~/.bashrc
# is read. A plain `command -v pnpm` here passes with your profile loaded while the
# deploy dies on "pnpm: command not found"; this repo was bitten by that three times.
#
# PATH mirrors what the deploy builds: sshd's own default, plus the three directories
# resolve_pnpm prepends. Keep it in step with deploy.yml or this check starts lying.
DEPLOY_PATH="${PNPM_HOME:-$HOME/.local/share/pnpm}:$HOME/.local/bin:/usr/local/bin"
DEPLOY_PATH="$DEPLOY_PATH:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"
if env -i HOME="$HOME" PATH="$DEPLOY_PATH" bash -c 'command -v pnpm' >/dev/null 2>&1; then
  ok "pnpm $(pnpm --version) — reachable from a non-interactive shell"
elif command -v pnpm >/dev/null; then
  bad "pnpm is on YOUR PATH but not a non-interactive one — the deploy will not find it"
  note "a shell profile is putting it there; the deploy reads no profile"
  note "fix: sudo -u $(whoami) npm install --global --prefix $HOME/.local pnpm@10.25.0"
else
  bad "pnpm not on PATH"
  note "the API release installs its dependencies on this host:"
  note "  npm install --global --prefix $HOME/.local pnpm@10.25.0"
fi
# A corepack shim would live in node's bin directory and not survive a node upgrade,
# which is how this broke once already. ~/.local/bin does survive.
case "$(command -v pnpm || echo none)" in
  "$HOME"/*) ok "pnpm lives under $HOME — a node upgrade cannot remove it" ;;
  none) : ;;
  *) note "pnpm sits outside $HOME; if it is a corepack shim, a node upgrade removes it" ;;
esac
command -v curl >/dev/null && ok "curl" || bad "curl missing — the deploy health check needs it"
command -v docker >/dev/null && ok "docker" || bad "docker missing"

echo ""
echo "Directories"
for d in "$APP_DIR/web/releases" "$APP_DIR/api/releases" "$APP_DIR/shared" "$APP_DIR/db"; do
  [ -d "$d" ] && ok "$d" || bad "$d missing"
done
# The deploy writes shared/.env.api there.
[ -w "$APP_DIR/shared" ] && ok "shared/ writable" || bad "shared/ not writable by $(whoami)"

echo ""
echo "Database"
if docker ps --format '{{.Names}}' 2>/dev/null | grep -qx crossword-postgres-prod; then
  ok "crossword-postgres-prod running"
  # The schema needs no extensions; the first deploy's `prisma migrate deploy` creates
  # every table, and the seed fills the word pool right after.
  if docker exec crossword-postgres-prod psql -U "${POSTGRES_USER:-crossword}" -d "${POSTGRES_DB:-crossword}" \
       -tAc 'select 1' >/dev/null 2>&1; then
    ok "postgres accepts the configured user/database"
  else
    bad "cannot connect as ${POSTGRES_USER:-crossword} to ${POSTGRES_DB:-crossword}"
    note "POSTGRES_USER/POSTGRES_DB in \$APP_DIR/db/.env must match DATABASE_URL"
  fi
else
  bad "crossword-postgres-prod not running"
fi
# Loopback-only is the intended posture; a 0.0.0.0 publish would expose Postgres.
if docker port crossword-postgres-prod 5432 2>/dev/null | grep -q '^127.0.0.1:'; then
  ok "postgres published on loopback only"
elif docker port crossword-postgres-prod 5432 >/dev/null 2>&1; then
  bad "postgres is published on all interfaces — bind it to 127.0.0.1"
fi

echo ""
echo "systemd"
for unit in crossword-web crossword-api; do
  if systemctl list-unit-files 2>/dev/null | grep -q "^$unit.service"; then
    ok "$unit installed"
    systemctl is-enabled --quiet "$unit" && ok "$unit enabled" || bad "$unit not enabled"
    exec_path=$(systemctl show "$unit" -p ExecStart --value 2>/dev/null | grep -oE '/[^ ]*/node' | head -1)
    if [ -n "$exec_path" ] && [ ! -x "$exec_path" ]; then
      bad "$unit ExecStart points at $exec_path which is not executable"
    fi
  else
    bad "$unit not installed"
  fi
done

echo ""
echo "Permissions"
if sudo -n systemctl restart crossword-api >/dev/null 2>&1; then
  ok "passwordless systemctl restart works"
else
  # A unit that fails to start still proves sudo worked; distinguish the two.
  if sudo -n true 2>/dev/null; then
    note "sudo works; restart failed — expected before the first release exists"
    ok "passwordless sudo available"
  else
    bad "no passwordless sudo for systemctl restart"
    note "check /etc/sudoers.d/crossword-deploy and that the path matches $(command -v systemctl)"
  fi
fi

echo ""
echo "nginx"
command -v nginx >/dev/null && ok "nginx installed" || bad "nginx missing"
if sudo -n nginx -t >/dev/null 2>&1; then ok "nginx config valid"; else note "could not run nginx -t (needs root) — run: sudo nginx -t"; fi

echo ""
echo "Ports"
# Matters on a shared host: other apps and their containers claim ports too, and a
# clash surfaces as "port is already allocated" mid-deploy, or as nginx proxying to
# somebody else's service. `holder` needs root to name the process; without it we
# can still tell occupied from free.
listening() {
  if command -v ss >/dev/null; then ss -ltnH 2>/dev/null; else netstat -ltn 2>/dev/null; fi
}
holder() {
  sudo -n ss -ltnp 2>/dev/null | grep -E "[:.]$1[[:space:]]" | grep -oE 'users:\(\("[^"]+"' | head -1 | tr -d '"' | sed 's/users:((//'
}
port_owner_is_ours() {
  # crossword-web / crossword-api holding their own port is expected on a redeploy.
  systemctl is-active --quiet "$1" 2>/dev/null
}

check_port() {
  local port="$1" what="$2" unit="${3:-}"
  if listening | grep -qE "[:.]$port[[:space:]]"; then
    if [ -n "$unit" ] && port_owner_is_ours "$unit"; then
      ok "$port ($what) held by $unit — already deployed"
    else
      local who; who=$(holder "$port")
      bad "$port ($what) is already in use${who:+ by $who}"
      note "either stop it, or move crossword off $port — see docs/DEPLOYMENT.md 'Changing a port'"
    fi
  else
    ok "$port ($what) free"
  fi
}

check_port "$WEB_PORT" "web"      crossword-web
check_port "$API_PORT" "api"      crossword-api
check_port "$DB_PORT"  "postgres" ""

if command -v docker >/dev/null; then
  echo ""
  echo "  published container ports on this host:"
  docker ps --format '    {{.Names}}\t{{.Ports}}' 2>/dev/null || true
fi

echo ""
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ] || echo "Fix the failures above before deploying; see docs/DEPLOYMENT.md"
exit $([ "$fail" -eq 0 ] && echo 0 || echo 1)
