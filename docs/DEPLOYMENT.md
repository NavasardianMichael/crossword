# Deployment

Push to `master` → GitHub Actions builds → two tarballs land on the server → symlink flip →
`systemctl restart` → health check. Same machinery as Bookie, on the same host.

## Shape

```
      crossword.eapps.site ──► nginx ──► 127.0.0.1:7007  crossword-web  (Next standalone)
                                     └────► /_next/static/  from disk
  api.crossword.eapps.site ──► nginx ──► 127.0.0.1:9007  crossword-api  (Express)
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
  db/docker-compose.prod.yml      written by the first API deploy, never rewritten
  db/.env                         POSTGRES_* derived from DATABASE_URL — same, mode 600
```

`WorkingDirectory` in both units points at `current`; systemd resolves the symlink at start,
so `systemctl restart` is what promotes a release.

## One-time server setup

The app-specific manual steps — DNS, systemd, certificates, nginx, GitHub secrets and the first
deploy — in the order they have to happen, are
[PRODUCTION_SETUP.md](PRODUCTION_SETUP.md). The one ordering trap: both vhosts name
Let's Encrypt files, so the certificates are issued **before** either vhost is enabled, with
`certbot certonly --nginx`: certbot answers the challenge through nginx by
itself and never rewrites the templates, and `certbot renew` reuses the same method.

The first deploy creates the release directories and the database, migrates, seeds the word
pool and starts both services.

### The database is created by the first deploy, once

`ensure_database` in `deploy.yml` runs before every `prisma migrate deploy` and is create-only:

| State on the host                         | What it does                                                        |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `crossword-postgres-prod` running         | nothing                                                             |
| container exists, stopped                 | `docker start` — no recreate, no config change                      |
| no container, no volume (first deploy)    | writes `db/docker-compose.prod.yml` + `db/.env` (from `DATABASE_URL`), `up -d --no-recreate` |
| no container, volume survives             | the same `up`, which **reattaches** the existing data               |
| `DATABASE_URL` not `127.0.0.1:5007`        | skipped — an external database is not ours to manage                |

It never runs `down`, `rm` or anything on a volume, and never rewrites an existing `db/.env`
or compose file. Postgres reads `POSTGRES_PASSWORD` only when it initialises an empty volume,
so changing the password later is done inside Postgres (see `deployment/db.env.example`), not
by editing either file. The password must be URL-safe (`openssl rand -hex 32`); the deploy
refuses anything else, since compose would interpolate `$` in `.env`.

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
| `NEXT_PUBLIC_API_URL`  | `https://api.crossword.eapps.site`                            |
| `NEXT_PUBLIC_SITE_URL` | `https://crossword.eapps.site`                                |

Optional, inlined at build time (empty turns the feature off): `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`,
`NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, and for source maps
`SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

All of them are kept as Secrets. The `NEXT_PUBLIC_*` values are public anyway (inlined into the
browser bundle); the workflow also accepts them as Variables (`secrets.*` first, then
`vars.*`), so a Secret with the same name as a Variable wins. Deploy fails closed if either
origin is missing, loopback or `http://`.

`ENV_API_BASE64` holds group A of `server/.env.example`: `DATABASE_URL`, `CORS_ORIGIN`,
`GEMINI_KEY`, optionally `GEMINI_MODELS`, `VERIFY_ENTRIES`, `POOL_DAILY_CALL_BUDGET`,
`POOL_REFILL_*`. Do **not** put `NODE_ENV`, `PORT` or `HOST` in it: the deploy
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
| `DATABASE_URL` | the credentials the Postgres volume was created with — the first deploy derives `$APP_DIR/db/.env` from it, port 5007 |

## The workflows

|              |                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yml`     | PR → master. Postgres service container; typecheck · typecheck:server · gates · lint · catalogues · unit · integration · build · build:api.              |
| `deploy.yml` | Push to `master` (or **Run workflow**). `changes` picks the sides, `verify` runs the non-build gates, `build-web` and `build-api` in parallel, `deploy`. |

The API deploys **first**: server-rendered pages and ISR call it, so the schema and API must
be new before new pages serve. API side: `pnpm install --prod --frozen-lockfile` →
`prisma generate` → `ensure_database` (creates Postgres only if missing) → `prisma migrate deploy` → `node dist/prisma/seed.js` (idempotent seed
words, `prisma/seed/entries.{en,ru,hy}.json`) → restart → poll `/health`. Web side: extract, flip the symlink, restart, poll `/en`
(never `/`, which is a 307).

The web bundle is booted in CI before it ships (standalone output can miss traced files), and
the API ships as a standalone package with pinned dependencies (`scripts/build-api-release.mjs`)
— both for the reasons documented in Bookie's `docs/DEPLOYMENT.md`.

## Ports

| Port | What     | Declared in                                                                                                        |
| ---- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| 7007 | Next     | `crossword-web.service`, `crossword.eapps.site.conf`, `deploy.yml` (`WEB_PORT`)        |
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

After the first deploy, submit `https://crossword.eapps.site/sitemap.xml`
in Google Search Console, Yandex Webmaster and Bing Webmaster Tools (63 URLs: the 9
`INDEXABLE_ROUTES` plus 12 topic pages, × 3 locales — en, ru, hy — with hreflang and x-default).
Check a shared `/p/<id>` link in a preview debugger (Facebook Sharing Debugger, opengraph.xyz):
it should show the title, description and `/opengraph-image`. `/llms.txt` and `/llms-full.txt`
summarise the site for AI assistants.

## Gotchas

- **Three hostnames, two certificates.** `crossword.eapps.site` (the app) and
  `www.crossword.eapps.site` (301 to the app, HTTP and HTTPS) share one Let's Encrypt
  certificate, named after the app host; `api.crossword.eapps.site` (HTTPS only — its `:80`
  drops every connection) has its own. Both are issued and renewed by certbot over HTTP-01 with the nginx authenticator, which
  adds its challenge location to the matching `:80` server only for the moment of the check.
  If the zone is on Cloudflare, all three records stay
  **DNS only**: Universal SSL does not cover two-label names like `api.crossword…`, and
  proxying would break HTTP-01 renewal.
- **`deploy` needs `verify` to have passed, not merely "not failed".** A failed `verify` skips
  both build jobs instead of failing them, so a "no failed build" condition let the deploy job
  start anyway.
- **Changing `NEXT_PUBLIC_*` requires a rebuild** — they are inlined.
- **Never add `proxy_cache`** to the web host, **never strip `Origin`/`Referer`** on the API
  host, **one API process only** — see `deployment/CLAUDE.md`.
- **ISR writes into the release's `.next/cache`**, which is why `ReadWritePaths` covers `web/`.
  A deploy starts with a fresh cache: the first visit to each page after a deploy renders it.
- **`/sw.js` is never cached** by nginx — a stale service worker pins old pages on every
  installed copy. `/_next/static/` is content-hashed and served `immutable`.
- **The database is the only state** — back up the Postgres volume; releases are disposable.
