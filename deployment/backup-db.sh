#!/usr/bin/env bash
# =============================================================================
# Nightly Postgres backup, streamed to Google Drive through rclone.
# Install to /home/michael/apps/crossword/shared/backup-db.sh (docs/PRODUCTION_SETUP.md, step 8).
#
# Nothing is written to this server's disk: pg_dump runs inside the database container and its
# output is piped straight into `rclone rcat`. The upload goes under a `.partial` name and is
# renamed only once pg_dump has exited cleanly, so a broken night never looks like a backup.
# Dumps older than KEEP_DAYS are then deleted from the remote.
#
# Optional: set PING_URL to a healthchecks.io (or similar) check URL. Success pings it, failure
# pings <url>/fail, and a night with no ping at all makes the service email you.
#
# Restore: docs/PRODUCTION_SETUP.md, step 8.
# =============================================================================
set -euo pipefail

REMOTE="gdrive:crossword-backups"
KEEP_DAYS=22
CONTAINER="crossword-postgres-prod"
PING_URL=""

# cron starts with a bare PATH.
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

name="crossword-$(date -u +%Y-%m-%dT%H%MZ).dump"
log() { echo "$(date -u +%FT%TZ) $*"; }

fail() {
  log "FAILED: $*"
  rclone deletefile "$REMOTE/$name.partial" 2>/dev/null || true
  [ -n "$PING_URL" ] && curl -fsS -m 10 --retry 3 "$PING_URL/fail" >/dev/null 2>&1 || true
  exit 1
}

# -Fc: compressed custom format; pg_restore can bring back the whole database or one table.
# The container's own POSTGRES_* are used, so this script holds no password.
docker exec "$CONTAINER" sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
  | rclone rcat "$REMOTE/$name.partial" \
  || fail "pg_dump or upload"

rclone moveto "$REMOTE/$name.partial" "$REMOTE/$name" || fail "rename on the remote"
size=$(rclone size --json "$REMOTE/$name" | sed -n 's/.*"bytes":\([0-9]*\).*/\1/p')
[ "${size:-0}" -gt 1024 ] || fail "dump is only ${size:-0} bytes"

rclone delete "$REMOTE" --min-age "${KEEP_DAYS}d" --include 'crossword-*.dump' || log "warning: pruning old dumps failed"

log "ok: $name ($size bytes)"
[ -n "$PING_URL" ] && curl -fsS -m 10 --retry 3 "$PING_URL" >/dev/null 2>&1 || true
