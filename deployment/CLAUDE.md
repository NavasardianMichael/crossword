# Deployment — invariants

Host-side configuration templates. How the pipeline works and the secrets live in
[docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md), the ordered manual setup in
[docs/PRODUCTION_SETUP.md](../docs/PRODUCTION_SETUP.md); this file holds the rules that must not break.

```
deployment/
  crossword.eapps.site.conf      nginx, web host -> 127.0.0.1:7007
  api.crossword.eapps.site.conf  nginx, API host -> 127.0.0.1:9007
  crossword-web.service   systemd, Next standalone
  crossword-api.service   systemd, Express
  docker-compose.prod.yml   production Postgres, loopback-bound on 5007
  db.env.example            shape of $APP_DIR/db/.env — the first deploy writes it from DATABASE_URL
```

**These are templates, not live config.** Nothing deploys them — they are copied to the
server by hand. Paths assume `APP_DIR=/home/michael/apps/crossword`. When you change one
here, say so in the PR: someone has to re-copy it.

## Rules

- **The release symlink is the deploy mechanism.** Both units set `WorkingDirectory` to
  `…/current`; `systemctl restart` is what promotes a release. Never point a unit at a
  concrete `releases/<sha>` path.
- **Never add `proxy_cache` to the web host.** `src/proxy.ts` answers unprefixed requests
  with personalised 307s (`Vary: Accept-Language, Cookie`, `no-store`). Pages are already
  cached inside Next (ISR).
- **`/sw.js` is never cached** anywhere — a stale worker pins old pages on every installed copy.
- **Never clear or rewrite `Origin`/`Referer` on the API host** — `requireSameOrigin` rejects
  state-changing requests without them in production.
- **`proxy_buffering off` on the web host is load-bearing** — Next streams RSC payloads.
- **`/_next/static/` is served from disk, `immutable`; `/_next/image` is not** — it is the
  optimizer and must reach Node.
- **Two origins, deliberately.** The browser calls the API host directly at
  `NEXT_PUBLIC_API_URL`, so CORS is required: `CORS_ORIGIN` names the web host, and
  `requireSameOrigin` checks `Origin` against it.
- **The database is create-only from CI.** `ensure_database` (deploy.yml) may create the
  Postgres container when it is missing, or start a stopped one — never `down`, `rm`,
  `--force-recreate`, a volume operation, or a rewrite of an existing `db/.env` /
  compose file. Changes to `docker-compose.prod.yml` reach an existing host by hand.
- **`shared/.env.api` lives outside the releases** — rotation deletes everything under
  `releases/`.
- **One API process.** Rate limits, the Gemini model cooldowns and the in-flight generation
  map are in-memory and per-process; `trust proxy` = 1 assumes exactly one hop.
- **Ports 7007 / 9007 / 5007** sit beside bookie (7004/9004/5004) and hangman (7005) on the
  same host. Changing one means editing every file listed in docs/DEPLOYMENT.md "Ports".
