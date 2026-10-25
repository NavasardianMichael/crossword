# Deployment

Push to `master` → GitHub Actions builds → two tarballs land on the server → symlink flip →
`systemctl restart` → health check. Same machinery as Bookie, on the same host.

## Shape

```
  crossword.mnavasardian.com ──► nginx ──► 127.0.0.1:7007  crossword-web  (Next standalone)
                                                       └────► /_next/static/  from disk
  api.crossword.mnavasardian.com ──► nginx ──► 127.0.0.1:9007  crossword-api  (Express)
                                                                     │
                                                                     ▼
                                                     127.0.0.1:5007  Postgres (Docker)
```

Two origins, not one. The browser calls the **API** host directly, at `NEXT_PUBLIC_API_URL`,
so every browser request is cross-origin and the API answers CORS for exactly one origin:
`CORS_ORIGIN`, which names the **web** host. `requireSameOrigin`
(`server/src/middleware/csrf.ts`) checks the `Origin` of every state-changing request against
that same value. Server-rendered pages skip nginx and reach the API over loopback
(`API_INTERNAL_URL` in `crossword-web.service`).

On-host layout:

```
$APP_DIR/                         /home/michael/apps/crossword
  web/releases/<sha>/             server.js · .next · public · node_modules
  web/current        -> releases/<sha>
  api/releases/<sha>/             dist · prisma · package.json · node_modules
  api/current        -> releases/<sha>
  shared/.env.api                 mode 600, written by the deploy — outside every release
  db/docker-compose.prod.yml
  db/.env                         POSTGRES_* for the container
```

`WorkingDirectory` in both units points at `current`; systemd resolves the symlink at start,
so `systemctl restart` is what promotes a release.

## One-time server setup

Node 24, pnpm and nginx are already on the host for Bookie; step 2 is only a check.

```bash
# 1. directory tree
sudo -u michael mkdir -p /home/michael/apps/crossword/{web/releases,api/releases,shared,db}

# 2. toolchain (already present for Bookie — verify, don't reinstall)
node -v                                    # v24.x
sudo -u michael /home/michael/.local/bin/pnpm --version

# 3. Postgres — its own container, port 5007 (Bookie holds 5004)
sudo -u michael cp deployment/docker-compose.prod.yml /home/michael/apps/crossword/db/
sudo -u michael cp deployment/db.env.example /home/michael/apps/crossword/db/.env
openssl rand -hex 32      # paste as POSTGRES_PASSWORD in that file
cd /home/michael/apps/crossword/db
sudo -u michael docker compose -f docker-compose.prod.yml up -d
# No manual schema work: `prisma migrate deploy` runs on every deploy, and the seed
# words (prisma/seed/entries.{en,ru,hy}.json) are loaded right after.

# 4. systemd units
sudo cp deployment/crossword-web.service deployment/crossword-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable crossword-web crossword-api    # do not start yet — no release exists

# 5. let the deploy user restart exactly these two units
sudo tee /etc/sudoers.d/crossword-deploy >/dev/null <<'SUDOERS'
michael ALL=(root) NOPASSWD: /usr/bin/systemctl restart crossword-web, /usr/bin/systemctl restart crossword-api
SUDOERS
sudo visudo -c        # check `which systemctl` — it is /bin/systemctl on some distros

# 6. DNS — two A records to the VPS:
#    crossword.mnavasardian.com
#    api.crossword.mnavasardian.com
#    (and www.crossword… if you want the redirect). If the zone is on
#    Cloudflare, grey-cloud the api record — see Gotchas.

# 7. nginx + TLS
# The API vhost is HTTPS-only and names files under
# /etc/letsencrypt/live/api.crossword.mnavasardian.com/ — enable it only
# after that cert exists, or `nginx -t` fails.
sudo cp deployment/crossword.mnavasardian.com.conf \
        deployment/api.crossword.mnavasardian.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/crossword.mnavasardian.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d crossword.mnavasardian.com -d www.crossword.mnavasardian.com
# The API conf has no :80 block, so use certonly with the webroot the :80 vhosts serve.
sudo certbot certonly --webroot -w /var/www/html -d api.crossword.mnavasardian.com
sudo ln -s /etc/nginx/sites-available/api.crossword.mnavasardian.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 8. CI's SSH key — reuse Bookie's deploy key or add a new one to
#    /home/michael/.ssh/authorized_keys

# 9. verify — as michael, NOT root
sudo -u michael bash deployment/preflight.sh /home/michael/apps/crossword
```

`preflight.sh` changes nothing. It checks Node and pnpm the way the deploy reaches them, the
directory tree, that Postgres is up, reachable as the
configured role and published on loopback only, both units installed and enabled,
passwordless `systemctl restart`, `nginx -t`, and that 7007/9007/5007 are free or held by
these units. Fix everything it reports before the first deploy.

The first deploy creates the release directories, migrates, seeds the word pool and
starts both services.

## Gemini

- **Gemini:** a key from https://aistudio.google.com/apikey into `GEMINI_KEY`. The free tier
  is enough: generated words are pooled and reused, `POOL_DAILY_CALL_BUDGET` caps the calls
  per UTC day, and `POOL_REFILL_MAX_CALLS` caps the background top-up. An empty key disables
  generation — puzzles are then built from the seeded pool only.

## GitHub configuration

**Secrets** (Settings → Secrets and variables → Actions):

| Name                   | Value                                                         |
| ---------------------- | ------------------------------------------------------------- |
| `SSH_HOST`             | server hostname or IP                                         |
| `SSH_USER`             | `michael`                                                     |
| `SSH_KEY`              | private half of the deploy key (full PEM)                     |
| `SSH_PORT`             | optional, defaults to 22                                      |
| `APP_DIR`              | `/home/michael/apps/crossword`                              |
| `ENV_API_BASE64`       | see below                                                     |
| `NEXT_PUBLIC_API_URL`  | `https://api.crossword.mnavasardian.com`  |
| `NEXT_PUBLIC_SITE_URL` | `https://crossword.mnavasardian.com`      |

Optional, inlined at build time (Secrets or Variables; empty turns the feature off):
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`,
and for source maps `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

The `NEXT_PUBLIC_*` values are inlined into the browser bundle, so they are public by
construction. The workflow reads `secrets.*` first, then `vars.*` — different stores, a value
in one is invisible to the other. Deploy fails closed if either origin is missing, loopback or
`http://`.

`ENV_API_BASE64` holds group A of `server/.env.example`: `DATABASE_URL`, `CORS_ORIGIN`,
`GEMINI_KEY`, optionally `GEMINI_MODELS`, `VERIFY_ENTRIES`, `POOL_DAILY_CALL_BUDGET`,
`POOL_REFILL_*`, `SENTRY_DSN_API`. Do **not** put `NODE_ENV`, `PORT` or `HOST` in it: the deploy
strips and rewrites those three so they cannot drift from the units.

```bash
# server/.env.production.local, then:
pnpm env:base64 production              # base64 on stdout, key names (never values) on stderr
pnpm env:base64 production | clip       # Windows
```

Two values must match character for character:

|                | must equal                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------ |
| `CORS_ORIGIN`  | `NEXT_PUBLIC_SITE_URL` — CORS allows only it, and `requireSameOrigin` compares `Origin` to it |
| `DATABASE_URL` | `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` in `$APP_DIR/db/.env`, port 5007      |

## The workflows

|              |                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`     | PR → master. Postgres service container; typecheck · typecheck:server · gates · lint · catalogues · unit · integration · build · build:api.              |
| `deploy.yml` | Push to `master` (or **Run workflow**). `changes` picks the sides, `verify` runs the non-build gates, `build-web` and `build-api` in parallel, `deploy`. |

The API deploys **first**: server-rendered pages and ISR call it, so the schema and API must
be new before new pages serve. API side: `pnpm install --prod --frozen-lockfile` →
`prisma generate` → `prisma migrate deploy` → `node dist/prisma/seed.js` (idempotent seed
words, `prisma/seed/entries.{en,ru,hy}.json`) → restart → poll `/health`. Web side: extract, flip the symlink, restart, poll `/en`
(never `/`, which is a 307).

The web bundle is booted in CI before it ships (standalone output can miss traced files), and
the API ships as a standalone package with pinned dependencies (`scripts/build-api-release.mjs`)
— both for the reasons documented in Bookie's `docs/DEPLOYMENT.md`.

## Ports

| Port | What     | Declared in                                                                                                        |
| ---- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| 7007 | Next     | `crossword-web.service`, `crossword.mnavasardian.com.conf`, `deploy.yml` (`WEB_PORT`)        |
| 9007 | Express  | deploy's env file (`PORT`), `crossword-web.service` (`API_INTERNAL_URL`), API `.conf`, `deploy.yml` (`API_PORT`) |
| 5007 | Postgres | `docker-compose.prod.yml`, `DATABASE_URL` inside `ENV_API_BASE64`                                                  |

Bookie holds 7004/9004/5004 and hangman 7005 on the same host. Changing a port means editing
every row above — grep for the old number afterwards.

## Operations

```bash
journalctl -u crossword-web -f
journalctl -u crossword-api -f
systemctl status crossword-web crossword-api

# rollback — migrations do NOT roll back
ls -t /home/michael/apps/crossword/web/releases
ln -sfn /home/michael/apps/crossword/web/releases/<sha> /home/michael/apps/crossword/web/current
sudo systemctl restart crossword-web                     # same shape for api

# word pool health
docker exec crossword-postgres-prod psql -U crossword -d crossword \
  -c 'select locale, difficulty, count(*) from "Entry" where "retiredAt" is null group by 1,2 order by 1,2;'

# re-seed by hand (idempotent — the deploy already runs it)
cd /home/michael/apps/crossword/api/current
set -a; . /home/michael/apps/crossword/shared/.env.api; set +a; node dist/prisma/seed.js
```

After the first deploy, submit `https://crossword.mnavasardian.com/sitemap.xml`
in Google Search Console (60 URLs: the 8 `INDEXABLE_ROUTES` plus 12 topic pages, × 3 locales —
en, ru, hy — with hreflang).

## Gotchas

- **Cloudflare Universal SSL does not cover `api.crossword.mnavasardian.com`**
  (two labels under the zone; the free cert covers one). Grey-cloud that record and let origin
  nginx terminate TLS, as these templates assume — the same fix as Bookie's API host.
- **Changing `NEXT_PUBLIC_*` requires a rebuild** — they are inlined.
- **Never add `proxy_cache`** to the web host, **never strip `Origin`/`Referer`** on the API
  host, **one API process only** — see `deployment/CLAUDE.md`.
- **ISR writes into the release's `.next/cache`**, which is why `ReadWritePaths` covers `web/`.
  A deploy starts with a fresh cache: the first visit to each page after a deploy renders it.
- **`/sw.js` is never cached** by nginx — a stale service worker pins old pages on every
  installed copy. `/_next/static/` is content-hashed and served `immutable`.
- **The database is the only state** — back up the Postgres volume; releases are disposable.
